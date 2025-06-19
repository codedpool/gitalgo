import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface Repository extends Tables<'repositories'> {
  owner?: Tables<'profiles'>;
  is_starred?: boolean;
  collaborators_count?: number;
}

export interface CreateRepositoryData {
  name: string;
  description?: string;
  isPrivate: boolean;
  initializeWithReadme?: boolean;
  license?: string;
  gitignoreTemplate?: string;
}

class RepositoryService {
  async createRepository(data: CreateRepositoryData): Promise<{ repository: Repository | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      // Check if repository name already exists for this user
      const { data: existing } = await supabase
        .from('repositories')
        .select('id')
        .eq('owner_id', user.id)
        .eq('name', data.name)
        .single();

      if (existing) {
        throw new Error('Repository name already exists');
      }

      const repositoryData = {
        id: uuidv4(),
        name: data.name,
        description: data.description || null,
        owner_id: user.id,
        is_private: data.isPrivate,
        license: data.license && data.license !== 'None' ? data.license : null,
        default_branch: 'main',
        has_issues: true,
        has_projects: true,
        has_wiki: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        pushed_at: new Date().toISOString(),
      };

      const { data: repository, error } = await supabase
        .from('repositories')
        .insert(repositoryData)
        .select(`
          *,
          owner:profiles(*)
        `)
        .single();

      if (error) throw error;

      // Create initial README if requested
      if (data.initializeWithReadme) {
        await this.createFile(repository.id, {
          path: 'README.md',
          content: `# ${data.name}\n\n${data.description || 'A new repository'}\n`,
          message: 'Initial commit',
        });
      }

      // Create default labels
      await this.createDefaultLabels(repository.id);

      return { repository, error: null };
    } catch (error) {
      return { repository: null, error: error as Error };
    }
  }

  async getRepositories(userId?: string): Promise<{ repositories: Repository[]; error: Error | null }> {
    try {
      let query = supabase
        .from('repositories')
        .select(`
          *,
          owner:profiles(*),
          stars!inner(user_id)
        `)
        .order('updated_at', { ascending: false });

      if (userId) {
        query = query.eq('owner_id', userId);
      } else {
        // Get public repositories or user's own repositories
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.or(`is_private.eq.false,owner_id.eq.${user.id}`);
        } else {
          query = query.eq('is_private', false);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process repositories to add computed fields
      const repositories = data?.map(repo => ({
        ...repo,
        is_starred: repo.stars?.some((star: any) => {
          const { data: { user } } = supabase.auth.getUser();
          return star.user_id === user?.id;
        }) || false,
      })) || [];

      return { repositories, error: null };
    } catch (error) {
      return { repositories: [], error: error as Error };
    }
  }

  async getRepository(owner: string, name: string): Promise<{ repository: Repository | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('repositories')
        .select(`
          *,
          owner:profiles(*)
        `)
        .eq('name', name)
        .eq('owner.username', owner)
        .single();

      if (error) throw error;

      return { repository: data, error: null };
    } catch (error) {
      return { repository: null, error: error as Error };
    }
  }

  async starRepository(repositoryId: string): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('stars')
        .insert({
          user_id: user.id,
          repository_id: repositoryId,
        });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async unstarRepository(repositoryId: string): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('stars')
        .delete()
        .eq('user_id', user.id)
        .eq('repository_id', repositoryId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async forkRepository(repositoryId: string): Promise<{ repository: Repository | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      // Get original repository
      const { data: originalRepo, error: fetchError } = await supabase
        .from('repositories')
        .select('*')
        .eq('id', repositoryId)
        .single();

      if (fetchError) throw fetchError;

      // Create fork
      const forkData = {
        ...originalRepo,
        id: uuidv4(),
        owner_id: user.id,
        is_fork: true,
        fork_parent_id: repositoryId,
        stars_count: 0,
        forks_count: 0,
        watchers_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: fork, error: createError } = await supabase
        .from('repositories')
        .insert(forkData)
        .select(`
          *,
          owner:profiles(*)
        `)
        .single();

      if (createError) throw createError;

      // Record the fork relationship
      await supabase
        .from('forks')
        .insert({
          user_id: user.id,
          repository_id: repositoryId,
          forked_repository_id: fork.id,
        });

      return { repository: fork, error: null };
    } catch (error) {
      return { repository: null, error: error as Error };
    }
  }

  async createFile(repositoryId: string, data: { path: string; content: string; message: string }): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      // Create commit
      const commitSha = uuidv4();
      await supabase
        .from('commits')
        .insert({
          sha: commitSha,
          message: data.message,
          author_name: user.email!,
          author_email: user.email!,
          author_id: user.id,
          repository_id: repositoryId,
        });

      // Create file
      await supabase
        .from('files')
        .insert({
          path: data.path,
          name: data.path.split('/').pop() || data.path,
          type: 'file',
          content: data.content,
          size_bytes: new Blob([data.content]).size,
          repository_id: repositoryId,
          commit_sha: commitSha,
        });

      // Update repository pushed_at
      await supabase
        .from('repositories')
        .update({ pushed_at: new Date().toISOString() })
        .eq('id', repositoryId);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  private async createDefaultLabels(repositoryId: string) {
    const defaultLabels = [
      { name: 'bug', color: 'd73a49', description: "Something isn't working" },
      { name: 'documentation', color: '0075ca', description: 'Improvements or additions to documentation' },
      { name: 'duplicate', color: 'cfd3d7', description: 'This issue or pull request already exists' },
      { name: 'enhancement', color: 'a2eeef', description: 'New feature or request' },
      { name: 'good first issue', color: '7057ff', description: 'Good for newcomers' },
      { name: 'help wanted', color: '008672', description: 'Extra attention is needed' },
      { name: 'invalid', color: 'e4e669', description: "This doesn't seem right" },
      { name: 'question', color: 'd876e3', description: 'Further information is requested' },
      { name: 'wontfix', color: 'ffffff', description: 'This will not be worked on' },
    ];

    await supabase
      .from('labels')
      .insert(
        defaultLabels.map(label => ({
          ...label,
          repository_id: repositoryId,
        }))
      );
  }

  async searchRepositories(query: string): Promise<{ repositories: Repository[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('repositories')
        .select(`
          *,
          owner:profiles(*)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_private', false)
        .order('stars_count', { ascending: false })
        .limit(20);

      if (error) throw error;

      return { repositories: data || [], error: null };
    } catch (error) {
      return { repositories: [], error: error as Error };
    }
  }
}

export const repositoryService = new RepositoryService();
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface PullRequest extends Tables<'pull_requests'> {
  author?: Tables<'profiles'>;
  assignee?: Tables<'profiles'>;
  repository?: Tables<'repositories'>;
  labels?: Tables<'labels'>[];
}

export interface CreatePullRequestData {
  title: string;
  body: string;
  repositoryId: string;
  headBranch: string;
  baseBranch: string;
  draft?: boolean;
}

class PullRequestService {
  async createPullRequest(data: CreatePullRequestData): Promise<{ pullRequest: PullRequest | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const prData = {
        id: uuidv4(),
        title: data.title,
        body: data.body,
        repository_id: data.repositoryId,
        author_id: user.id,
        head_branch: data.headBranch,
        base_branch: data.baseBranch,
        draft: data.draft || false,
        state: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: pullRequest, error } = await supabase
        .from('pull_requests')
        .insert(prData)
        .select(`
          *,
          author:profiles(*),
          repository:repositories(*)
        `)
        .single();

      if (error) throw error;

      return { pullRequest, error: null };
    } catch (error) {
      return { pullRequest: null, error: error as Error };
    }
  }

  async getPullRequests(repositoryId: string, state?: 'open' | 'closed'): Promise<{ pullRequests: PullRequest[]; error: Error | null }> {
    try {
      let query = supabase
        .from('pull_requests')
        .select(`
          *,
          author:profiles(*),
          assignee:profiles(*),
          repository:repositories(*)
        `)
        .eq('repository_id', repositoryId)
        .order('created_at', { ascending: false });

      if (state) {
        query = query.eq('state', state);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { pullRequests: data || [], error: null };
    } catch (error) {
      return { pullRequests: [], error: error as Error };
    }
  }

  async getPullRequest(prId: string): Promise<{ pullRequest: PullRequest | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('pull_requests')
        .select(`
          *,
          author:profiles(*),
          assignee:profiles(*),
          repository:repositories(*)
        `)
        .eq('id', prId)
        .single();

      if (error) throw error;

      return { pullRequest: data, error: null };
    } catch (error) {
      return { pullRequest: null, error: error as Error };
    }
  }

  async mergePullRequest(prId: string): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('pull_requests')
        .update({
          state: 'closed',
          merged: true,
          merged_at: new Date().toISOString(),
          merged_by_id: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', prId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async closePullRequest(prId: string): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('pull_requests')
        .update({
          state: 'closed',
          closed_at: new Date().toISOString(),
          closed_by_id: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', prId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async addComment(prId: string, body: string): Promise<{ comment: Tables<'comments'> | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          body,
          author_id: user.id,
          pull_request_id: prId,
        })
        .select(`
          *,
          author:profiles(*)
        `)
        .single();

      if (error) throw error;

      return { comment: data, error: null };
    } catch (error) {
      return { comment: null, error: error as Error };
    }
  }
}

export const pullRequestService = new PullRequestService();
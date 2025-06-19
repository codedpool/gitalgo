import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface Issue extends Tables<'issues'> {
  author?: Tables<'profiles'>;
  assignee?: Tables<'profiles'>;
  repository?: Tables<'repositories'>;
  labels?: Tables<'labels'>[];
}

export interface CreateIssueData {
  title: string;
  body: string;
  repositoryId: string;
  assigneeId?: string;
  labelIds?: string[];
}

class IssueService {
  async createIssue(data: CreateIssueData): Promise<{ issue: Issue | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const issueData = {
        id: uuidv4(),
        title: data.title,
        body: data.body,
        repository_id: data.repositoryId,
        author_id: user.id,
        assignee_id: data.assigneeId || null,
        state: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: issue, error } = await supabase
        .from('issues')
        .insert(issueData)
        .select(`
          *,
          author:profiles(*),
          assignee:profiles(*),
          repository:repositories(*)
        `)
        .single();

      if (error) throw error;

      // Add labels if provided
      if (data.labelIds && data.labelIds.length > 0) {
        await supabase
          .from('issue_labels')
          .insert(
            data.labelIds.map(labelId => ({
              issue_id: issue.id,
              label_id: labelId,
            }))
          );
      }

      // Update repository open issues count
      await supabase.rpc('increment_open_issues_count', {
        repo_id: data.repositoryId,
      });

      return { issue, error: null };
    } catch (error) {
      return { issue: null, error: error as Error };
    }
  }

  async getIssues(repositoryId: string, state?: 'open' | 'closed'): Promise<{ issues: Issue[]; error: Error | null }> {
    try {
      let query = supabase
        .from('issues')
        .select(`
          *,
          author:profiles(*),
          assignee:profiles(*),
          repository:repositories(*),
          labels:issue_labels(label:labels(*))
        `)
        .eq('repository_id', repositoryId)
        .order('created_at', { ascending: false });

      if (state) {
        query = query.eq('state', state);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process labels
      const issues = data?.map(issue => ({
        ...issue,
        labels: issue.labels?.map((il: any) => il.label) || [],
      })) || [];

      return { issues, error: null };
    } catch (error) {
      return { issues: [], error: error as Error };
    }
  }

  async getIssue(issueId: string): Promise<{ issue: Issue | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          author:profiles(*),
          assignee:profiles(*),
          repository:repositories(*),
          labels:issue_labels(label:labels(*))
        `)
        .eq('id', issueId)
        .single();

      if (error) throw error;

      // Process labels
      const issue = {
        ...data,
        labels: data.labels?.map((il: any) => il.label) || [],
      };

      return { issue, error: null };
    } catch (error) {
      return { issue: null, error: error as Error };
    }
  }

  async updateIssue(issueId: string, updates: Partial<Issue>): Promise<{ issue: Issue | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('issues')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', issueId)
        .select(`
          *,
          author:profiles(*),
          assignee:profiles(*),
          repository:repositories(*)
        `)
        .single();

      if (error) throw error;

      return { issue: data, error: null };
    } catch (error) {
      return { issue: null, error: error as Error };
    }
  }

  async closeIssue(issueId: string): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('issues')
        .update({
          state: 'closed',
          closed_at: new Date().toISOString(),
          closed_by_id: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', issueId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async reopenIssue(issueId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('issues')
        .update({
          state: 'open',
          closed_at: null,
          closed_by_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', issueId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async addComment(issueId: string, body: string): Promise<{ comment: Tables<'comments'> | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          body,
          author_id: user.id,
          issue_id: issueId,
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

  async getComments(issueId: string): Promise<{ comments: Tables<'comments'>[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return { comments: data || [], error: null };
    } catch (error) {
      return { comments: [], error: error as Error };
    }
  }
}

export const issueService = new IssueService();
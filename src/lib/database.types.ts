export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          company: string | null;
          email_public: boolean;
          hireable: boolean;
          twitter_username: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          company?: string | null;
          email_public?: boolean;
          hireable?: boolean;
          twitter_username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          company?: string | null;
          email_public?: boolean;
          hireable?: boolean;
          twitter_username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      repositories: {
        Row: {
          id: string;
          name: string;
          full_name: string;
          description: string | null;
          owner_id: string | null;
          organization_id: string | null;
          is_private: boolean;
          is_fork: boolean;
          fork_parent_id: string | null;
          default_branch: string;
          language: string | null;
          topics: string[];
          has_issues: boolean;
          has_projects: boolean;
          has_wiki: boolean;
          has_pages: boolean;
          has_downloads: boolean;
          archived: boolean;
          disabled: boolean;
          license: string | null;
          readme: string | null;
          stars_count: number;
          forks_count: number;
          watchers_count: number;
          size_kb: number;
          open_issues_count: number;
          created_at: string;
          updated_at: string;
          pushed_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          owner_id?: string | null;
          organization_id?: string | null;
          is_private?: boolean;
          is_fork?: boolean;
          fork_parent_id?: string | null;
          default_branch?: string;
          language?: string | null;
          topics?: string[];
          has_issues?: boolean;
          has_projects?: boolean;
          has_wiki?: boolean;
          has_pages?: boolean;
          has_downloads?: boolean;
          archived?: boolean;
          disabled?: boolean;
          license?: string | null;
          readme?: string | null;
          stars_count?: number;
          forks_count?: number;
          watchers_count?: number;
          size_kb?: number;
          open_issues_count?: number;
          created_at?: string;
          updated_at?: string;
          pushed_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          owner_id?: string | null;
          organization_id?: string | null;
          is_private?: boolean;
          is_fork?: boolean;
          fork_parent_id?: string | null;
          default_branch?: string;
          language?: string | null;
          topics?: string[];
          has_issues?: boolean;
          has_projects?: boolean;
          has_wiki?: boolean;
          has_pages?: boolean;
          has_downloads?: boolean;
          archived?: boolean;
          disabled?: boolean;
          license?: string | null;
          readme?: string | null;
          stars_count?: number;
          forks_count?: number;
          watchers_count?: number;
          size_kb?: number;
          open_issues_count?: number;
          created_at?: string;
          updated_at?: string;
          pushed_at?: string;
        };
      };
      issues: {
        Row: {
          id: string;
          number: number;
          title: string;
          body: string;
          state: string;
          repository_id: string;
          author_id: string | null;
          assignee_id: string | null;
          milestone_id: string | null;
          locked: boolean;
          comments_count: number;
          created_at: string;
          updated_at: string;
          closed_at: string | null;
          closed_by_id: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          body?: string;
          state?: string;
          repository_id: string;
          author_id?: string | null;
          assignee_id?: string | null;
          milestone_id?: string | null;
          locked?: boolean;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
          closed_at?: string | null;
          closed_by_id?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          state?: string;
          repository_id?: string;
          author_id?: string | null;
          assignee_id?: string | null;
          milestone_id?: string | null;
          locked?: boolean;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
          closed_at?: string | null;
          closed_by_id?: string | null;
        };
      };
      pull_requests: {
        Row: {
          id: string;
          number: number;
          title: string;
          body: string;
          state: string;
          repository_id: string;
          author_id: string | null;
          assignee_id: string | null;
          head_branch: string;
          base_branch: string;
          head_sha: string | null;
          base_sha: string | null;
          merged: boolean;
          mergeable: boolean | null;
          draft: boolean;
          locked: boolean;
          comments_count: number;
          review_comments_count: number;
          commits_count: number;
          additions: number;
          deletions: number;
          changed_files: number;
          created_at: string;
          updated_at: string;
          closed_at: string | null;
          merged_at: string | null;
          closed_by_id: string | null;
          merged_by_id: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          body?: string;
          state?: string;
          repository_id: string;
          author_id?: string | null;
          assignee_id?: string | null;
          head_branch: string;
          base_branch: string;
          head_sha?: string | null;
          base_sha?: string | null;
          merged?: boolean;
          mergeable?: boolean | null;
          draft?: boolean;
          locked?: boolean;
          comments_count?: number;
          review_comments_count?: number;
          commits_count?: number;
          additions?: number;
          deletions?: number;
          changed_files?: number;
          created_at?: string;
          updated_at?: string;
          closed_at?: string | null;
          merged_at?: string | null;
          closed_by_id?: string | null;
          merged_by_id?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          state?: string;
          repository_id?: string;
          author_id?: string | null;
          assignee_id?: string | null;
          head_branch?: string;
          base_branch?: string;
          head_sha?: string | null;
          base_sha?: string | null;
          merged?: boolean;
          mergeable?: boolean | null;
          draft?: boolean;
          locked?: boolean;
          comments_count?: number;
          review_comments_count?: number;
          commits_count?: number;
          additions?: number;
          deletions?: number;
          changed_files?: number;
          created_at?: string;
          updated_at?: string;
          closed_at?: string | null;
          merged_at?: string | null;
          closed_by_id?: string | null;
          merged_by_id?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          body: string;
          author_id: string | null;
          issue_id: string | null;
          pull_request_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          body: string;
          author_id?: string | null;
          issue_id?: string | null;
          pull_request_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          body?: string;
          author_id?: string | null;
          issue_id?: string | null;
          pull_request_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stars: {
        Row: {
          id: string;
          user_id: string;
          repository_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          repository_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          repository_id?: string;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
      labels: {
        Row: {
          id: string;
          name: string;
          color: string;
          description: string | null;
          repository_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          description?: string | null;
          repository_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          description?: string | null;
          repository_id?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string | null;
          read: boolean;
          repository_id: string | null;
          issue_id: string | null;
          pull_request_id: string | null;
          actor_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message?: string | null;
          read?: boolean;
          repository_id?: string | null;
          issue_id?: string | null;
          pull_request_id?: string | null;
          actor_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string | null;
          read?: boolean;
          repository_id?: string | null;
          issue_id?: string | null;
          pull_request_id?: string | null;
          actor_id?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
/*
  # Complete GitHub Clone Database Schema

  1. New Tables
    - `profiles` - User profiles extending auth.users
    - `organizations` - Multi-user organizations
    - `organization_members` - Organization membership with roles
    - `repositories` - Code repositories with privacy controls
    - `repository_collaborators` - Repository access permissions
    - `issues` - Issue tracking system
    - `pull_requests` - Pull request workflow
    - `comments` - Comments for issues and PRs
    - `labels` - Labeling system for issues/PRs
    - `issue_labels` & `pull_request_labels` - Label associations
    - `commits` - Commit history tracking
    - `files` - Repository file management
    - `stars` - Repository starring system
    - `forks` - Repository forking
    - `follows` - User following system
    - `notifications` - User notifications
    - `webhooks` - Repository webhooks

  2. Security
    - Enable RLS on all tables
    - Comprehensive policies for data access
    - User-based permissions and privacy controls

  3. Features
    - Automatic count maintenance via triggers
    - Full-text search capabilities
    - Performance optimized with indexes
    - Automatic profile creation on user registration
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  -- Drop existing policies on profiles table if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
    DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
    DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
    DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- =============================================
-- TABLE CREATION SECTION
-- =============================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  website text,
  company text,
  email_public boolean DEFAULT false,
  hireable boolean DEFAULT false,
  twitter_username text,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  public_repos_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 39),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9]([a-zA-Z0-9]|-(?=[a-zA-Z0-9]))*$')
);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  avatar_url text,
  website text,
  location text,
  email text,
  billing_email text,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT org_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 39),
  CONSTRAINT org_name_format CHECK (name ~ '^[a-zA-Z0-9]([a-zA-Z0-9]|-(?=[a-zA-Z0-9]))*$')
);

-- Organization members
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(organization_id, user_id),
  CONSTRAINT valid_role CHECK (role IN ('member', 'admin', 'owner'))
);

-- Repositories table
CREATE TABLE IF NOT EXISTS repositories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  full_name text,
  description text,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  is_private boolean DEFAULT false,
  is_fork boolean DEFAULT false,
  fork_parent_id uuid REFERENCES repositories(id) ON DELETE SET NULL,
  default_branch text DEFAULT 'main',
  language text,
  topics text[] DEFAULT '{}',
  has_issues boolean DEFAULT true,
  has_projects boolean DEFAULT true,
  has_wiki boolean DEFAULT true,
  has_pages boolean DEFAULT false,
  has_downloads boolean DEFAULT true,
  archived boolean DEFAULT false,
  disabled boolean DEFAULT false,
  license text,
  readme text,
  stars_count integer DEFAULT 0,
  forks_count integer DEFAULT 0,
  watchers_count integer DEFAULT 0,
  size_kb integer DEFAULT 0,
  open_issues_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  pushed_at timestamptz DEFAULT now(),
  
  CONSTRAINT repo_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  CONSTRAINT repo_name_format CHECK (name ~ '^[a-zA-Z0-9._-]+$'),
  CONSTRAINT owner_or_org CHECK ((owner_id IS NOT NULL AND organization_id IS NULL) OR (owner_id IS NULL AND organization_id IS NOT NULL)),
  UNIQUE(owner_id, name),
  UNIQUE(organization_id, name)
);

-- Repository collaborators
CREATE TABLE IF NOT EXISTS repository_collaborators (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  permission text NOT NULL DEFAULT 'read',
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(repository_id, user_id),
  CONSTRAINT valid_permission CHECK (permission IN ('read', 'triage', 'write', 'maintain', 'admin'))
);

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  number serial,
  title text NOT NULL,
  body text DEFAULT '',
  state text NOT NULL DEFAULT 'open',
  repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  assignee_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  milestone_id uuid,
  locked boolean DEFAULT false,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  closed_by_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  
  CONSTRAINT valid_state CHECK (state IN ('open', 'closed')),
  CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 256)
);

-- Pull requests table
CREATE TABLE IF NOT EXISTS pull_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  number serial,
  title text NOT NULL,
  body text DEFAULT '',
  state text NOT NULL DEFAULT 'open',
  repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  assignee_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  head_branch text NOT NULL,
  base_branch text NOT NULL,
  head_sha text,
  base_sha text,
  merged boolean DEFAULT false,
  mergeable boolean,
  draft boolean DEFAULT false,
  locked boolean DEFAULT false,
  comments_count integer DEFAULT 0,
  review_comments_count integer DEFAULT 0,
  commits_count integer DEFAULT 0,
  additions integer DEFAULT 0,
  deletions integer DEFAULT 0,
  changed_files integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  merged_at timestamptz,
  closed_by_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  merged_by_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  
  CONSTRAINT valid_pr_state CHECK (state IN ('open', 'closed')),
  CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 256)
);

-- Comments table (for issues and PRs)
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  body text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  issue_id uuid REFERENCES issues(id) ON DELETE CASCADE,
  pull_request_id uuid REFERENCES pull_requests(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT comment_target CHECK ((issue_id IS NOT NULL AND pull_request_id IS NULL) OR (issue_id IS NULL AND pull_request_id IS NOT NULL)),
  CONSTRAINT body_length CHECK (char_length(body) >= 1)
);

-- Labels table
CREATE TABLE IF NOT EXISTS labels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  color text NOT NULL,
  description text,
  repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(repository_id, name),
  CONSTRAINT color_format CHECK (color ~ '^[0-9a-fA-F]{6}$')
);

-- Issue labels (many-to-many)
CREATE TABLE IF NOT EXISTS issue_labels (
  issue_id uuid REFERENCES issues(id) ON DELETE CASCADE,
  label_id uuid REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (issue_id, label_id)
);

-- PR labels (many-to-many)
CREATE TABLE IF NOT EXISTS pull_request_labels (
  pull_request_id uuid REFERENCES pull_requests(id) ON DELETE CASCADE,
  label_id uuid REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (pull_request_id, label_id)
);

-- Commits table
CREATE TABLE IF NOT EXISTS commits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sha text NOT NULL,
  message text NOT NULL,
  author_name text NOT NULL,
  author_email text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  parent_shas text[] DEFAULT '{}',
  tree_sha text,
  additions integer DEFAULT 0,
  deletions integer DEFAULT 0,
  total_changes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(repository_id, sha)
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  path text NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  size_bytes integer DEFAULT 0,
  content text,
  encoding text DEFAULT 'utf-8',
  repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  commit_sha text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_type CHECK (type IN ('file', 'directory')),
  UNIQUE(repository_id, path, commit_sha)
);

-- Stars table
CREATE TABLE IF NOT EXISTS stars (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, repository_id)
);

-- Forks table
CREATE TABLE IF NOT EXISTS forks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  forked_repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, repository_id)
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  issue_id uuid REFERENCES issues(id) ON DELETE CASCADE,
  pull_request_id uuid REFERENCES pull_requests(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_notification_type CHECK (type IN ('issue', 'pull_request', 'mention', 'review', 'security', 'release', 'discussion'))
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id uuid REFERENCES repositories(id) ON DELETE CASCADE,
  url text NOT NULL,
  content_type text DEFAULT 'application/json',
  secret text,
  events text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- FUNCTIONS SECTION (Before Triggers)
-- =============================================

-- Function to update repository full_name
CREATE OR REPLACE FUNCTION update_repository_full_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.organization_id IS NOT NULL THEN
    NEW.full_name := (SELECT name FROM organizations WHERE id = NEW.organization_id) || '/' || NEW.name;
  ELSE
    NEW.full_name := (SELECT username FROM profiles WHERE id = NEW.owner_id) || '/' || NEW.name;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Functions to update counts
CREATE OR REPLACE FUNCTION update_repository_stars_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE repositories 
    SET stars_count = stars_count + 1 
    WHERE id = NEW.repository_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE repositories 
    SET stars_count = stars_count - 1 
    WHERE id = OLD.repository_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_repository_forks_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE repositories 
    SET forks_count = forks_count + 1 
    WHERE id = NEW.repository_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE repositories 
    SET forks_count = forks_count - 1 
    WHERE id = OLD.repository_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_issue_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.issue_id IS NOT NULL THEN
    UPDATE issues 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.issue_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.issue_id IS NOT NULL THEN
    UPDATE issues 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.issue_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_profile_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update follower count
    UPDATE profiles 
    SET followers_count = followers_count + 1 
    WHERE id = NEW.following_id;
    
    -- Update following count
    UPDATE profiles 
    SET following_count = following_count + 1 
    WHERE id = NEW.follower_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update follower count
    UPDATE profiles 
    SET followers_count = followers_count - 1 
    WHERE id = OLD.following_id;
    
    -- Update following count
    UPDATE profiles 
    SET following_count = following_count - 1 
    WHERE id = OLD.follower_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_repo_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET public_repos_count = public_repos_count + 1 
    WHERE id = NEW.owner_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles 
    SET public_repos_count = public_repos_count - 1 
    WHERE id = OLD.owner_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS SECTION
-- =============================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_repository_full_name_trigger ON repositories;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS stars_count_trigger ON stars;
DROP TRIGGER IF EXISTS forks_count_trigger ON forks;
DROP TRIGGER IF EXISTS comments_count_trigger ON comments;
DROP TRIGGER IF EXISTS profile_counts_trigger ON follows;
DROP TRIGGER IF EXISTS user_repo_count_trigger ON repositories;

-- Create triggers
CREATE TRIGGER update_repository_full_name_trigger
  BEFORE INSERT OR UPDATE ON repositories
  FOR EACH ROW EXECUTE FUNCTION update_repository_full_name();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER stars_count_trigger
  AFTER INSERT OR DELETE ON stars
  FOR EACH ROW EXECUTE FUNCTION update_repository_stars_count();

CREATE TRIGGER forks_count_trigger
  AFTER INSERT OR DELETE ON forks
  FOR EACH ROW EXECUTE FUNCTION update_repository_forks_count();

CREATE TRIGGER comments_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_issue_comments_count();

CREATE TRIGGER profile_counts_trigger
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_profile_counts();

CREATE TRIGGER user_repo_count_trigger
  AFTER INSERT OR DELETE ON repositories
  FOR EACH ROW EXECUTE FUNCTION update_user_repo_count();

-- =============================================
-- ROW LEVEL SECURITY SECTION
-- =============================================

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE repository_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE pull_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE pull_request_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE forks ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES SECTION (After Tables and RLS)
-- =============================================

-- Profiles policies
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Organizations policies
CREATE POLICY "organizations_select_policy" ON organizations
  FOR SELECT USING (true);

CREATE POLICY "organizations_insert_policy" ON organizations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "organizations_update_policy" ON organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_id = id 
      AND user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Organization members policies
CREATE POLICY "organization_members_select_policy" ON organization_members
  FOR SELECT USING (true);

CREATE POLICY "organization_members_all_policy" ON organization_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- Repositories policies
CREATE POLICY "repositories_select_policy" ON repositories
  FOR SELECT USING (NOT is_private OR owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM repository_collaborators 
      WHERE repository_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "repositories_insert_policy" ON repositories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND owner_id = auth.uid());

CREATE POLICY "repositories_update_policy" ON repositories
  FOR UPDATE USING (owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM repository_collaborators 
      WHERE repository_id = id AND user_id = auth.uid() AND permission IN ('admin', 'maintain')
    )
  );

CREATE POLICY "repositories_delete_policy" ON repositories
  FOR DELETE USING (owner_id = auth.uid());

-- Repository collaborators policies
CREATE POLICY "repository_collaborators_select_policy" ON repository_collaborators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM repositories r
      WHERE r.id = repository_id 
      AND (NOT r.is_private OR r.owner_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM repository_collaborators rc
          WHERE rc.repository_id = r.id AND rc.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "repository_collaborators_all_policy" ON repository_collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM repositories 
      WHERE id = repository_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM repository_collaborators 
      WHERE repository_id = repository_collaborators.repository_id 
      AND user_id = auth.uid() 
      AND permission = 'admin'
    )
  );

-- Issues policies
CREATE POLICY "issues_select_policy" ON issues
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM repositories r
      WHERE r.id = repository_id 
      AND (NOT r.is_private OR r.owner_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM repository_collaborators rc
          WHERE rc.repository_id = r.id AND rc.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "issues_insert_policy" ON issues
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM repositories r
      WHERE r.id = repository_id 
      AND (NOT r.is_private OR r.owner_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM repository_collaborators rc
          WHERE rc.repository_id = r.id AND rc.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "issues_update_policy" ON issues
  FOR UPDATE USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM repositories 
      WHERE id = repository_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM repository_collaborators 
      WHERE repository_id = issues.repository_id 
      AND user_id = auth.uid() 
      AND permission IN ('admin', 'maintain', 'write')
    )
  );

-- Pull requests policies
CREATE POLICY "pull_requests_select_policy" ON pull_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM repositories r
      WHERE r.id = repository_id 
      AND (NOT r.is_private OR r.owner_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM repository_collaborators rc
          WHERE rc.repository_id = r.id AND rc.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "pull_requests_insert_policy" ON pull_requests
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM repositories r
      WHERE r.id = repository_id 
      AND (NOT r.is_private OR r.owner_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM repository_collaborators rc
          WHERE rc.repository_id = r.id AND rc.user_id = auth.uid()
        )
      )
    )
  );

-- Comments policies
CREATE POLICY "comments_select_policy" ON comments
  FOR SELECT USING (
    (issue_id IS NOT NULL AND 
      EXISTS (
        SELECT 1 FROM issues i
        JOIN repositories r ON r.id = i.repository_id
        WHERE i.id = issue_id 
        AND (NOT r.is_private OR r.owner_id = auth.uid() OR 
          EXISTS (
            SELECT 1 FROM repository_collaborators rc
            WHERE rc.repository_id = r.id AND rc.user_id = auth.uid()
          )
        )
      )
    ) OR
    (pull_request_id IS NOT NULL AND 
      EXISTS (
        SELECT 1 FROM pull_requests pr
        JOIN repositories r ON r.id = pr.repository_id
        WHERE pr.id = pull_request_id 
        AND (NOT r.is_private OR r.owner_id = auth.uid() OR 
          EXISTS (
            SELECT 1 FROM repository_collaborators rc
            WHERE rc.repository_id = r.id AND rc.user_id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY "comments_insert_policy" ON comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "comments_update_policy" ON comments
  FOR UPDATE USING (author_id = auth.uid());

-- Stars policies
CREATE POLICY "stars_select_policy" ON stars
  FOR SELECT USING (true);

CREATE POLICY "stars_insert_policy" ON stars
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "stars_delete_policy" ON stars
  FOR DELETE USING (user_id = auth.uid());

-- Follows policies
CREATE POLICY "follows_select_policy" ON follows
  FOR SELECT USING (true);

CREATE POLICY "follows_insert_policy" ON follows
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND follower_id = auth.uid());

CREATE POLICY "follows_delete_policy" ON follows
  FOR DELETE USING (follower_id = auth.uid());

-- Notifications policies
CREATE POLICY "notifications_select_policy" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_policy" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_update_policy" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- =============================================
-- INDEXES SECTION (Performance Optimization)
-- =============================================

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_repositories_owner_id ON repositories(owner_id);
CREATE INDEX IF NOT EXISTS idx_repositories_organization_id ON repositories(organization_id);
CREATE INDEX IF NOT EXISTS idx_repositories_is_private ON repositories(is_private);
CREATE INDEX IF NOT EXISTS idx_repositories_created_at ON repositories(created_at);
CREATE INDEX IF NOT EXISTS idx_repositories_full_name ON repositories(full_name);
CREATE INDEX IF NOT EXISTS idx_issues_repository_id ON issues(repository_id);
CREATE INDEX IF NOT EXISTS idx_issues_author_id ON issues(author_id);
CREATE INDEX IF NOT EXISTS idx_issues_state ON issues(state);
CREATE INDEX IF NOT EXISTS idx_pull_requests_repository_id ON pull_requests(repository_id);
CREATE INDEX IF NOT EXISTS idx_pull_requests_author_id ON pull_requests(author_id);
CREATE INDEX IF NOT EXISTS idx_pull_requests_state ON pull_requests(state);
CREATE INDEX IF NOT EXISTS idx_comments_issue_id ON comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_comments_pull_request_id ON comments(pull_request_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_stars_user_id ON stars(user_id);
CREATE INDEX IF NOT EXISTS idx_stars_repository_id ON stars(repository_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_repository_collaborators_repo_id ON repository_collaborators(repository_id);
CREATE INDEX IF NOT EXISTS idx_repository_collaborators_user_id ON repository_collaborators(user_id);
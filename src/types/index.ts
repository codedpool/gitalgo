export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  followers: number;
  following: number;
  publicRepos: number;
  joinDate: string;
  role: UserRole;
  permissions: Permission[];
  isVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  status: UserStatus;
}

export interface UserRole {
  id: string;
  name: string;
  level: number; // 1: User, 2: Moderator, 3: Admin, 4: Owner
  color: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
}

export type PermissionCategory = 'repository' | 'organization' | 'user' | 'admin' | 'moderation';

export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loginAttempts: number;
  lastLoginAttempt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface Repository {
  id: string;
  name: string;
  description?: string;
  owner: User;
  collaborators: RepositoryCollaborator[];
  isPrivate: boolean;
  language: string;
  stars: number;
  forks: number;
  size: number;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  hasIssues: boolean;
  hasPullRequests: boolean;
  license?: string;
  visibility: RepositoryVisibility;
  permissions: RepositoryPermissions;
}

export interface RepositoryCollaborator {
  user: User;
  role: CollaboratorRole;
  addedAt: string;
  addedBy: User;
  permissions: RepositoryPermission[];
}

export type CollaboratorRole = 'read' | 'triage' | 'write' | 'maintain' | 'admin';

export type RepositoryVisibility = 'public' | 'private' | 'internal';

export interface RepositoryPermissions {
  canRead: boolean;
  canWrite: boolean;
  canAdmin: boolean;
  canDelete: boolean;
  canManageCollaborators: boolean;
  canManageSettings: boolean;
}

export interface RepositoryPermission {
  id: string;
  name: string;
  description: string;
}

export interface Organization {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  avatar: string;
  website?: string;
  location?: string;
  email?: string;
  members: OrganizationMember[];
  repositories: Repository[];
  createdAt: string;
  isVerified: boolean;
  plan: OrganizationPlan;
}

export interface OrganizationMember {
  user: User;
  role: OrganizationRole;
  joinedAt: string;
  invitedBy?: User;
  isPublic: boolean;
}

export type OrganizationRole = 'member' | 'moderator' | 'admin' | 'owner';

export type OrganizationPlan = 'free' | 'team' | 'enterprise';

export interface Issue {
  id: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  author: User;
  assignees: User[];
  labels: Label[];
  comments: number;
  createdAt: string;
  updatedAt: string;
  repository: Repository;
  milestone?: Milestone;
  reactions: Reaction[];
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed' | 'merged';
  author: User;
  reviewers: User[];
  sourceBranch: string;
  targetBranch: string;
  commits: number;
  additions: number;
  deletions: number;
  createdAt: string;
  repository: Repository;
  reviews: Review[];
  checks: Check[];
}

export interface Review {
  id: string;
  reviewer: User;
  state: 'pending' | 'approved' | 'changes_requested' | 'commented';
  body?: string;
  createdAt: string;
}

export interface Check {
  id: string;
  name: string;
  status: 'pending' | 'success' | 'failure' | 'error';
  conclusion?: string;
  url?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  state: 'open' | 'closed';
  progress: number;
}

export interface Reaction {
  id: string;
  type: ReactionType;
  user: User;
  createdAt: string;
}

export type ReactionType = 'thumbs_up' | 'thumbs_down' | 'laugh' | 'hooray' | 'confused' | 'heart' | 'rocket' | 'eyes';

export interface Label {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface FileTreeItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified: string;
  children?: FileTreeItem[];
}

export interface Commit {
  id: string;
  sha: string;
  message: string;
  author: User;
  date: string;
  additions: number;
  deletions: number;
  files: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  repository?: Repository;
  actor?: User;
}

export type NotificationType = 'issue' | 'pull_request' | 'mention' | 'review' | 'security' | 'release' | 'discussion';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  actor: User;
  repository?: Repository;
  createdAt: string;
  payload: any;
}

export type ActivityType = 'push' | 'create' | 'delete' | 'fork' | 'star' | 'watch' | 'issue' | 'pull_request' | 'release';
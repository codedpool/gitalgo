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
}

export interface Repository {
  id: string;
  name: string;
  description?: string;
  owner: User;
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
}

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
}

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
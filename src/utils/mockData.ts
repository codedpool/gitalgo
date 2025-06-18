import { Repository, Issue, PullRequest, FileTreeItem, Commit } from '../types';

export const mockRepositories: Repository[] = [
  {
    id: '1',
    name: 'Hello-World',
    description: 'My first repository on GitHub!',
    owner: {
      id: '1',
      username: 'octocat',
      name: 'The Octocat',
      email: 'octocat@github.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 4000,
      following: 9,
      publicRepos: 8,
      joinDate: '2011-01-25'
    },
    isPrivate: false,
    language: 'JavaScript',
    stars: 1347,
    forks: 9194,
    size: 108,
    defaultBranch: 'main',
    createdAt: '2011-01-26T19:01:12Z',
    updatedAt: '2023-12-07T14:33:00Z',
    topics: ['octocat', 'atom', 'electron', 'api'],
    hasIssues: true,
    hasPullRequests: true,
    license: 'MIT'
  },
  {
    id: '2',
    name: 'Spoon-Knife',
    description: 'This repo is for demonstration purposes only.',
    owner: {
      id: '1',
      username: 'octocat',
      name: 'The Octocat',
      email: 'octocat@github.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 4000,
      following: 9,
      publicRepos: 8,
      joinDate: '2011-01-25'
    },
    isPrivate: false,
    language: 'HTML',
    stars: 11234,
    forks: 139000,
    size: 15,
    defaultBranch: 'main',
    createdAt: '2011-01-27T23:26:08Z',
    updatedAt: '2023-12-07T12:15:00Z',
    topics: ['forking', 'git', 'github'],
    hasIssues: true,
    hasPullRequests: true
  },
  {
    id: '3',
    name: 'github-actions-demo',
    description: 'Demonstration of GitHub Actions CI/CD pipeline',
    owner: {
      id: '1',
      username: 'octocat',
      name: 'The Octocat',
      email: 'octocat@github.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 4000,
      following: 9,
      publicRepos: 8,
      joinDate: '2011-01-25'
    },
    isPrivate: false,
    language: 'TypeScript',
    stars: 542,
    forks: 89,
    size: 2340,
    defaultBranch: 'main',
    createdAt: '2022-03-15T10:30:00Z',
    updatedAt: '2023-12-06T16:45:00Z',
    topics: ['github-actions', 'ci-cd', 'automation', 'typescript'],
    hasIssues: true,
    hasPullRequests: true,
    license: 'Apache-2.0'
  }
];

export const mockIssues: Issue[] = [
  {
    id: '1',
    number: 347,
    title: 'Bug: Application crashes when clicking submit button',
    body: 'When I click the submit button on the login form, the application crashes with a TypeError. This happens consistently across different browsers.',
    state: 'open',
    author: {
      id: '2',
      username: 'johndoe',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 120,
      following: 75,
      publicRepos: 15,
      joinDate: '2020-03-15'
    },
    assignees: [],
    labels: [
      { id: '1', name: 'bug', color: 'd73a49', description: 'Something isn\'t working' },
      { id: '2', name: 'high priority', color: 'b60205', description: 'High priority issue' }
    ],
    comments: 8,
    createdAt: '2023-12-05T14:30:00Z',
    updatedAt: '2023-12-07T09:15:00Z',
    repository: mockRepositories[0]
  },
  {
    id: '2',
    number: 346,
    title: 'Feature Request: Add dark mode support',
    body: 'It would be great to have a dark mode option for better accessibility and user experience during night time usage.',
    state: 'open',
    author: {
      id: '3',
      username: 'janedoe',
      name: 'Jane Doe',
      email: 'jane@example.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 234,
      following: 89,
      publicRepos: 22,
      joinDate: '2019-11-20'
    },
    assignees: [],
    labels: [
      { id: '3', name: 'enhancement', color: 'a2eeef', description: 'New feature or request' },
      { id: '4', name: 'good first issue', color: '7057ff', description: 'Good for newcomers' }
    ],
    comments: 12,
    createdAt: '2023-12-04T10:45:00Z',
    updatedAt: '2023-12-06T16:20:00Z',
    repository: mockRepositories[0]
  }
];

export const mockPullRequests: PullRequest[] = [
  {
    id: '1',
    number: 42,
    title: 'Add user authentication system',
    body: 'This PR implements a complete user authentication system with login, registration, and password reset functionality.',
    state: 'open',
    author: {
      id: '4',
      username: 'contributor',
      name: 'Alex Contributor',
      email: 'alex@example.com',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 567,
      following: 234,
      publicRepos: 45,
      joinDate: '2018-07-12'
    },
    reviewers: [],
    sourceBranch: 'feature/user-auth',
    targetBranch: 'main',
    commits: 8,
    additions: 432,
    deletions: 67,
    createdAt: '2023-12-03T08:30:00Z',
    repository: mockRepositories[0]
  }
];

export const mockFileTree: FileTreeItem[] = [
  {
    name: '.github',
    path: '.github',
    type: 'directory',
    lastModified: '2023-12-07T10:30:00Z',
    children: [
      {
        name: 'workflows',
        path: '.github/workflows',
        type: 'directory',
        lastModified: '2023-12-07T10:30:00Z',
        children: [
          {
            name: 'ci.yml',
            path: '.github/workflows/ci.yml',
            type: 'file',
            size: 1234,
            lastModified: '2023-12-07T10:30:00Z'
          }
        ]
      }
    ]
  },
  {
    name: 'src',
    path: 'src',
    type: 'directory',
    lastModified: '2023-12-07T14:20:00Z',
    children: [
      {
        name: 'components',
        path: 'src/components',
        type: 'directory',
        lastModified: '2023-12-07T14:20:00Z'
      },
      {
        name: 'utils',
        path: 'src/utils',
        type: 'directory',
        lastModified: '2023-12-06T16:45:00Z'
      },
      {
        name: 'App.tsx',
        path: 'src/App.tsx',
        type: 'file',
        size: 2567,
        lastModified: '2023-12-07T14:20:00Z'
      },
      {
        name: 'main.tsx',
        path: 'src/main.tsx',
        type: 'file',
        size: 456,
        lastModified: '2023-12-05T11:15:00Z'
      }
    ]
  },
  {
    name: 'package.json',
    path: 'package.json',
    type: 'file',
    size: 1890,
    lastModified: '2023-12-06T09:30:00Z'
  },
  {
    name: 'README.md',
    path: 'README.md',
    type: 'file',
    size: 3456,
    lastModified: '2023-12-07T12:00:00Z'
  },
  {
    name: 'tsconfig.json',
    path: 'tsconfig.json',
    type: 'file',
    size: 567,
    lastModified: '2023-12-01T14:30:00Z'
  }
];

export const mockCommits: Commit[] = [
  {
    id: '1',
    sha: 'a1b2c3d',
    message: 'Add user authentication system',
    author: {
      id: '1',
      username: 'octocat',
      name: 'The Octocat',
      email: 'octocat@github.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 4000,
      following: 9,
      publicRepos: 8,
      joinDate: '2011-01-25'
    },
    date: '2023-12-07T14:33:00Z',
    additions: 245,
    deletions: 12,
    files: 8
  },
  {
    id: '2',
    sha: 'e4f5g6h',
    message: 'Fix responsive design issues on mobile',
    author: {
      id: '1',
      username: 'octocat',
      name: 'The Octocat',
      email: 'octocat@github.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 4000,
      following: 9,
      publicRepos: 8,
      joinDate: '2011-01-25'
    },
    date: '2023-12-06T16:20:00Z',
    additions: 67,
    deletions: 23,
    files: 4
  }
];
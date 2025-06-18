import { User, UserRole, Permission, LoginCredentials, RegisterData, AuthState } from '../types';

// Mock roles and permissions
export const PERMISSIONS: Permission[] = [
  // Repository permissions
  { id: 'repo_read', name: 'Read Repository', description: 'View repository content', category: 'repository' },
  { id: 'repo_write', name: 'Write Repository', description: 'Push to repository', category: 'repository' },
  { id: 'repo_admin', name: 'Admin Repository', description: 'Full repository access', category: 'repository' },
  { id: 'repo_delete', name: 'Delete Repository', description: 'Delete repositories', category: 'repository' },
  
  // Organization permissions
  { id: 'org_read', name: 'Read Organization', description: 'View organization', category: 'organization' },
  { id: 'org_write', name: 'Write Organization', description: 'Manage organization', category: 'organization' },
  { id: 'org_admin', name: 'Admin Organization', description: 'Full organization access', category: 'organization' },
  
  // User permissions
  { id: 'user_read', name: 'Read Users', description: 'View user profiles', category: 'user' },
  { id: 'user_write', name: 'Write Users', description: 'Edit user profiles', category: 'user' },
  
  // Admin permissions
  { id: 'admin_users', name: 'Manage Users', description: 'Manage all users', category: 'admin' },
  { id: 'admin_system', name: 'System Admin', description: 'Full system access', category: 'admin' },
  
  // Moderation permissions
  { id: 'mod_content', name: 'Moderate Content', description: 'Moderate user content', category: 'moderation' },
  { id: 'mod_users', name: 'Moderate Users', description: 'Suspend/ban users', category: 'moderation' },
];

export const USER_ROLES: UserRole[] = [
  {
    id: 'user',
    name: 'User',
    level: 1,
    color: '#6b7280',
    permissions: PERMISSIONS.filter(p => ['repo_read', 'repo_write', 'user_read'].includes(p.id))
  },
  {
    id: 'moderator',
    name: 'Moderator',
    level: 2,
    color: '#3b82f6',
    permissions: PERMISSIONS.filter(p => 
      ['repo_read', 'repo_write', 'user_read', 'user_write', 'mod_content', 'mod_users'].includes(p.id)
    )
  },
  {
    id: 'admin',
    name: 'Administrator',
    level: 3,
    color: '#ef4444',
    permissions: PERMISSIONS.filter(p => p.category !== 'admin' || p.id === 'admin_users')
  },
  {
    id: 'owner',
    name: 'Owner',
    level: 4,
    color: '#8b5cf6',
    permissions: PERMISSIONS
  }
];

export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    loginAttempts: 0,
  };

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Mock user database
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'octocat',
      name: 'The Octocat',
      email: 'octocat@github.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'How people build software',
      location: 'San Francisco',
      website: 'https://github.com',
      company: 'GitHub',
      followers: 4000,
      following: 9,
      publicRepos: 8,
      joinDate: '2011-01-25',
      role: USER_ROLES[3], // Owner
      permissions: USER_ROLES[3].permissions,
      isVerified: true,
      twoFactorEnabled: true,
      lastLoginAt: new Date().toISOString(),
      status: 'active'
    },
    {
      id: '2',
      username: 'admin',
      name: 'System Administrator',
      email: 'admin@github.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'System administrator',
      location: 'Remote',
      company: 'GitHub',
      followers: 150,
      following: 50,
      publicRepos: 25,
      joinDate: '2020-01-15',
      role: USER_ROLES[2], // Admin
      permissions: USER_ROLES[2].permissions,
      isVerified: true,
      twoFactorEnabled: true,
      status: 'active'
    },
    {
      id: '3',
      username: 'moderator',
      name: 'Community Moderator',
      email: 'mod@github.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Community moderator',
      location: 'New York',
      company: 'GitHub',
      followers: 75,
      following: 100,
      publicRepos: 12,
      joinDate: '2021-06-10',
      role: USER_ROLES[1], // Moderator
      permissions: USER_ROLES[1].permissions,
      isVerified: false,
      twoFactorEnabled: false,
      status: 'active'
    },
    {
      id: '4',
      username: 'user',
      name: 'Regular User',
      email: 'user@example.com',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Just a regular user',
      location: 'London',
      followers: 10,
      following: 25,
      publicRepos: 5,
      joinDate: '2022-03-20',
      role: USER_ROLES[0], // User
      permissions: USER_ROLES[0].permissions,
      isVerified: false,
      twoFactorEnabled: false,
      status: 'active'
    }
  ];

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check login attempts
    if (this.authState.loginAttempts >= 5) {
      const lastAttempt = this.authState.lastLoginAttempt;
      if (lastAttempt && Date.now() - new Date(lastAttempt).getTime() < 15 * 60 * 1000) {
        return { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' };
      } else {
        this.authState.loginAttempts = 0;
      }
    }

    // Find user by email
    const user = this.mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      this.authState.loginAttempts++;
      this.authState.lastLoginAttempt = new Date().toISOString();
      return { success: false, error: 'Invalid email or password' };
    }

    // Check user status
    if (user.status === 'suspended') {
      return { success: false, error: 'Your account has been suspended. Please contact support.' };
    }

    if (user.status === 'banned') {
      return { success: false, error: 'Your account has been banned.' };
    }

    // Mock password validation (in real app, use proper hashing)
    const validPassword = credentials.password === 'password123';
    
    if (!validPassword) {
      this.authState.loginAttempts++;
      this.authState.lastLoginAttempt = new Date().toISOString();
      return { success: false, error: 'Invalid email or password' };
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled && !credentials.twoFactorCode) {
      return { success: false, error: '2FA code required' };
    }

    if (user.twoFactorEnabled && credentials.twoFactorCode !== '123456') {
      return { success: false, error: 'Invalid 2FA code' };
    }

    // Update user's last login
    user.lastLoginAt = new Date().toISOString();

    // Set auth state
    this.authState = {
      isAuthenticated: true,
      user,
      token: this.generateToken(),
      refreshToken: this.generateToken(),
      loginAttempts: 0,
    };

    // Store in localStorage if remember me
    if (credentials.rememberMe) {
      localStorage.setItem('auth_token', this.authState.token!);
      localStorage.setItem('refresh_token', this.authState.refreshToken!);
    }

    return { success: true, user };
  }

  async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validation
    if (data.password !== data.confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    if (data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long' };
    }

    if (!data.acceptTerms) {
      return { success: false, error: 'You must accept the terms of service' };
    }

    // Check if user already exists
    const existingUser = this.mockUsers.find(u => 
      u.email === data.email || u.username === data.username
    );

    if (existingUser) {
      return { 
        success: false, 
        error: existingUser.email === data.email ? 'Email already registered' : 'Username already taken' 
      };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username: data.username,
      name: data.username,
      email: data.email,
      avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=150`,
      followers: 0,
      following: 0,
      publicRepos: 0,
      joinDate: new Date().toISOString(),
      role: USER_ROLES[0], // Default to User role
      permissions: USER_ROLES[0].permissions,
      isVerified: false,
      twoFactorEnabled: false,
      status: 'active'
    };

    this.mockUsers.push(newUser);

    return { success: true, user: newUser };
  }

  async logout(): Promise<void> {
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      loginAttempts: 0,
    };

    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  async refreshToken(): Promise<{ success: boolean; token?: string }> {
    const refreshToken = this.authState.refreshToken || localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      return { success: false };
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newToken = this.generateToken();
    this.authState.token = newToken;
    
    if (localStorage.getItem('auth_token')) {
      localStorage.setItem('auth_token', newToken);
    }

    return { success: true, token: newToken };
  }

  async initializeAuth(): Promise<User | null> {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return null;
    }

    // In a real app, validate token with backend
    // For now, just return the first user (octocat)
    const user = this.mockUsers[0];
    
    this.authState = {
      isAuthenticated: true,
      user,
      token,
      refreshToken: localStorage.getItem('refresh_token'),
      loginAttempts: 0,
    };

    return user;
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  getCurrentUser(): User | null {
    return this.authState.user;
  }

  hasPermission(permission: string): boolean {
    if (!this.authState.user) return false;
    return this.authState.user.permissions.some(p => p.id === permission);
  }

  hasRole(roleName: string): boolean {
    if (!this.authState.user) return false;
    return this.authState.user.role.name.toLowerCase() === roleName.toLowerCase();
  }

  canAccessRepository(repository: any, action: 'read' | 'write' | 'admin' = 'read'): boolean {
    if (!this.authState.user) return false;

    // Owner can do anything
    if (repository.owner.id === this.authState.user.id) return true;

    // Public repositories can be read by anyone
    if (!repository.isPrivate && action === 'read') return true;

    // Check collaborator permissions
    const collaborator = repository.collaborators?.find((c: any) => c.user.id === this.authState.user!.id);
    if (collaborator) {
      switch (action) {
        case 'read':
          return ['read', 'triage', 'write', 'maintain', 'admin'].includes(collaborator.role);
        case 'write':
          return ['write', 'maintain', 'admin'].includes(collaborator.role);
        case 'admin':
          return collaborator.role === 'admin';
        default:
          return false;
      }
    }

    // Check admin permissions
    return this.hasPermission('admin_system') || this.hasPermission('repo_admin');
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // User management methods (for admins)
  async getAllUsers(): Promise<User[]> {
    if (!this.hasPermission('admin_users')) {
      throw new Error('Insufficient permissions');
    }
    return [...this.mockUsers];
  }

  async updateUserRole(userId: string, roleId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.hasPermission('admin_users')) {
      return { success: false, error: 'Insufficient permissions' };
    }

    const user = this.mockUsers.find(u => u.id === userId);
    const role = USER_ROLES.find(r => r.id === roleId);

    if (!user || !role) {
      return { success: false, error: 'User or role not found' };
    }

    user.role = role;
    user.permissions = role.permissions;

    return { success: true };
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned'): Promise<{ success: boolean; error?: string }> {
    if (!this.hasPermission('mod_users') && !this.hasPermission('admin_users')) {
      return { success: false, error: 'Insufficient permissions' };
    }

    const user = this.mockUsers.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    user.status = status;
    return { success: true };
  }
}

export const authService = AuthService.getInstance();
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, Repository, AuthState } from '../types';
import { authService } from '../utils/auth';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  repositories: Repository[];
  currentRepo: Repository | null;
  isLoading: boolean;
  showCreateRepoModal: boolean;
  showCreateModal: boolean;
  showAuthModal: boolean;
  authMode: 'login' | 'register';
  auth: AuthState;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_REPOSITORIES'; payload: Repository[] }
  | { type: 'ADD_REPOSITORY'; payload: Repository }
  | { type: 'SET_CURRENT_REPO'; payload: Repository | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_CREATE_REPO_MODAL' }
  | { type: 'TOGGLE_CREATE_MODAL' }
  | { type: 'TOGGLE_AUTH_MODAL'; payload?: 'login' | 'register' }
  | { type: 'SET_AUTH_STATE'; payload: AuthState }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  theme: 'dark', // Default to dark mode
  repositories: [],
  currentRepo: null,
  isLoading: true,
  showCreateRepoModal: false,
  showCreateModal: false,
  showAuthModal: false,
  authMode: 'login',
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    loginAttempts: 0,
  },
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        auth: { ...state.auth, user: action.payload, isAuthenticated: !!action.payload }
      };
    case 'SET_THEME':
      // Store theme preference in localStorage
      localStorage.setItem('theme', action.payload);
      return { ...state, theme: action.payload };
    case 'SET_REPOSITORIES':
      return { ...state, repositories: action.payload };
    case 'ADD_REPOSITORY':
      return { 
        ...state, 
        repositories: [action.payload, ...state.repositories],
        user: state.user ? { ...state.user, publicRepos: state.user.publicRepos + 1 } : null
      };
    case 'SET_CURRENT_REPO':
      return { ...state, currentRepo: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'TOGGLE_CREATE_REPO_MODAL':
      return { ...state, showCreateRepoModal: !state.showCreateRepoModal };
    case 'TOGGLE_CREATE_MODAL':
      return { ...state, showCreateModal: !state.showCreateModal };
    case 'TOGGLE_AUTH_MODAL':
      return { 
        ...state, 
        showAuthModal: !state.showAuthModal,
        authMode: action.payload || state.authMode
      };
    case 'SET_AUTH_STATE':
      return { 
        ...state, 
        auth: action.payload,
        user: action.payload.user,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          loginAttempts: 0,
        },
        repositories: [],
        currentRepo: null,
        showCreateRepoModal: false,
        showCreateModal: false,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize theme and authentication on app start
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize theme from localStorage or default to dark
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const theme = savedTheme || 'dark';
        dispatch({ type: 'SET_THEME', payload: theme });

        // Initialize authentication
        const user = await authService.initializeAuth();
        const authState = authService.getAuthState();
        
        dispatch({ type: 'SET_AUTH_STATE', payload: authState });
        
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initApp();
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (state.theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
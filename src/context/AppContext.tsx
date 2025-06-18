import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Repository } from '../types';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  repositories: Repository[];
  currentRepo: Repository | null;
  isLoading: boolean;
  showCreateRepoModal: boolean;
  showCreateModal: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_REPOSITORIES'; payload: Repository[] }
  | { type: 'ADD_REPOSITORY'; payload: Repository }
  | { type: 'SET_CURRENT_REPO'; payload: Repository | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_CREATE_REPO_MODAL' }
  | { type: 'TOGGLE_CREATE_MODAL' };

const initialState: AppState = {
  user: {
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
    joinDate: '2011-01-25'
  },
  theme: 'light',
  repositories: [],
  currentRepo: null,
  isLoading: false,
  showCreateRepoModal: false,
  showCreateModal: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
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
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
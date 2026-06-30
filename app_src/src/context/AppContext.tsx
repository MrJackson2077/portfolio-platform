'use client';
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { AppState, AIModel, Portfolio, Project, Profile, Asset, OnboardingData } from '@/lib/types';
import { MOCK_USER, MOCK_WORKSPACE, MOCK_PROFILE, MOCK_PROJECTS, MOCK_ASSETS, MOCK_PORTFOLIO } from '@/lib/mock-data';

// ─── State ────────────────────────────────────────────────────
const INITIAL_STATE: AppState = {
  user: MOCK_USER,
  workspace: MOCK_WORKSPACE,
  profile: MOCK_PROFILE,
  projects: MOCK_PROJECTS,
  assets: MOCK_ASSETS,
  sources: [],
  externalLinks: [],
  portfolios: [MOCK_PORTFOLIO],
  currentPortfolio: MOCK_PORTFOLIO,
  onboarding: null,
  selectedModel: 'gemini-2.0-flash',
  isAuthenticated: true, // Start authenticated for demo
};

// ─── Actions ─────────────────────────────────────────────────
type Action =
  | { type: 'SET_MODEL'; model: AIModel }
  | { type: 'SET_PROFILE'; profile: Profile }
  | { type: 'ADD_PROJECT'; project: Project }
  | { type: 'UPDATE_PROJECT'; project: Project }
  | { type: 'DELETE_PROJECT'; id: string }
  | { type: 'ADD_ASSET'; asset: Asset }
  | { type: 'DELETE_ASSET'; id: string }
  | { type: 'SET_PORTFOLIO'; portfolio: Portfolio }
  | { type: 'SET_ONBOARDING'; data: OnboardingData }
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, selectedModel: action.model };
    case 'SET_PROFILE':
      return { ...state, profile: action.profile };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.project] };
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map(p => p.id === action.project.id ? action.project : p) };
    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter(p => p.id !== action.id) };
    case 'ADD_ASSET':
      return { ...state, assets: [...state.assets, action.asset] };
    case 'DELETE_ASSET':
      return { ...state, assets: state.assets.filter(a => a.id !== action.id) };
    case 'SET_PORTFOLIO':
      return { ...state, currentPortfolio: action.portfolio, portfolios: state.portfolios.map(p => p.id === action.portfolio.id ? action.portfolio : p) };
    case 'SET_ONBOARDING':
      return { ...state, onboarding: action.data };
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  setModel: (model: AIModel) => void;
  setProfile: (profile: Profile) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  setPortfolio: (portfolio: Portfolio) => void;
  setOnboarding: (data: OnboardingData) => void;
  login: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setModel = useCallback((model: AIModel) => dispatch({ type: 'SET_MODEL', model }), []);
  const setProfile = useCallback((profile: Profile) => dispatch({ type: 'SET_PROFILE', profile }), []);
  const addProject = useCallback((project: Project) => dispatch({ type: 'ADD_PROJECT', project }), []);
  const updateProject = useCallback((project: Project) => dispatch({ type: 'UPDATE_PROJECT', project }), []);
  const deleteProject = useCallback((id: string) => dispatch({ type: 'DELETE_PROJECT', id }), []);
  const addAsset = useCallback((asset: Asset) => dispatch({ type: 'ADD_ASSET', asset }), []);
  const deleteAsset = useCallback((id: string) => dispatch({ type: 'DELETE_ASSET', id }), []);
  const setPortfolio = useCallback((portfolio: Portfolio) => dispatch({ type: 'SET_PORTFOLIO', portfolio }), []);
  const setOnboarding = useCallback((data: OnboardingData) => dispatch({ type: 'SET_ONBOARDING', data }), []);
  const login = useCallback(() => dispatch({ type: 'LOGIN' }), []);
  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);

  return (
    <AppContext.Provider value={{ state, setModel, setProfile, addProject, updateProject, deleteProject, addAsset, deleteAsset, setPortfolio, setOnboarding, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

import React, { createContext, useContext, useState } from 'react';
import type { AppState, Screen, Provider, Job, UserMode } from '../types';

interface AppContextType extends AppState {
  navigate: (screen: Screen) => void;
  setMode: (mode: UserMode) => void;
  selectProvider: (p: Provider | null) => void;
  setActiveJob: (j: Job | null) => void;
  triggerPanic: () => void;
  dismissPanic: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    mode: null,
    screen: 'onboarding',
    selectedProvider: null,
    activeJob: null,
    panicActive: false,
  });

  const navigate = (screen: Screen) => setState(s => ({ ...s, screen }));
  const setMode = (mode: UserMode) => setState(s => ({ ...s, mode }));
  const selectProvider = (p: Provider | null) => setState(s => ({ ...s, selectedProvider: p }));
  const setActiveJob = (j: Job | null) => setState(s => ({ ...s, activeJob: j }));
  const triggerPanic = () => setState(s => ({ ...s, panicActive: true }));
  const dismissPanic = () => setState(s => ({ ...s, panicActive: false }));

  return (
    <AppContext.Provider value={{ ...state, navigate, setMode, selectProvider, setActiveJob, triggerPanic, dismissPanic }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

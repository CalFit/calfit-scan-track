
import { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useAuthState();
  const actions = useAuthActions(state, setState);

  const value = {
    ...state,
    ...actions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

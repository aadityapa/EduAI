import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AuthTokens } from '../api/services';
import { login as apiLogin } from '../api/services';
import { clearTokens, loadTokens, saveTokens } from './storage';
import { getDashboardRoute, type RoleCode } from '@eduai/shared';

interface AuthContextValue {
  tokens: AuthTokens | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string>;
  signOut: () => Promise<void>;
  primaryRole: RoleCode | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokens().then((t) => {
      setTokens(t);
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    await saveTokens(result);
    setTokens(result);
    const roles = result.user.roles as RoleCode[];
    return getDashboardRoute(roles).replace(/^\//, '');
  }, []);

  const signOut = useCallback(async () => {
    await clearTokens();
    setTokens(null);
  }, []);

  const primaryRole = tokens?.user.roles?.[0] as RoleCode | null ?? null;

  return (
    <AuthContext.Provider value={{ tokens, loading, signIn, signOut, primaryRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

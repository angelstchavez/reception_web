/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/lib/services/auth.service";
import type { UserRead, UserRegister } from "@/types/api";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: UserRead | null;
  status: AuthStatus;
  cardCredential: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: UserRegister) => Promise<UserRead>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (...roles: UserRead["role"][]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRead | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [cardCredential, setCardCredential] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authService.me();
      setUser(me);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authService.login(email, password);
      setCardCredential(result.card_credential ?? null);
      await refreshUser();
    },
    [refreshUser],
  );

  const register = useCallback(async (payload: UserRegister) => {
    return authService.register(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("No fue posible cerrar la sesión en el servidor:", error);
    } finally {
      setUser(null);
      setCardCredential(null);
      setStatus("unauthenticated");
    }
  }, []);

  const hasRole = useCallback(
    (...roles: UserRead["role"][]) => !!user && roles.includes(user.role),
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      cardCredential,
      login,
      register,
      logout,
      refreshUser,
      hasRole,
    }),
    [
      user,
      status,
      cardCredential,
      login,
      register,
      logout,
      refreshUser,
      hasRole,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { call, login as apiLogin, logout as apiLogout, setCsrfToken } from "../lib/api";
import type { Boot } from "../lib/types";

interface AuthState {
  boot: Boot | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [boot, setBoot] = useState<Boot | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBoot = useCallback(async () => {
    try {
      const b = await call<Boot>("session.boot");
      setCsrfToken(b.csrf_token);
      setBoot(b);
    } catch {
      setBoot(null);
    }
  }, []);

  useEffect(() => { loadBoot().finally(() => setLoading(false)); }, [loadBoot]);

  const signIn = async (email: string, password: string) => {
    await apiLogin(email, password);
    await loadBoot();
  };
  const signOut = async () => {
    await apiLogout();
    setBoot(null);
  };

  return <Ctx.Provider value={{ boot, loading, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}

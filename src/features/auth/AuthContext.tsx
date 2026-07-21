import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { AdminUser } from "./types";

const SESSION_KEY = "hubology.session";

const DEMO_ADMIN: AdminUser = {
  id: "admin-01",
  name: "Ayesha Rahman",
  email: "admin@hubology.com",
  role: "Super Admin",
  avatar: "https://i.pravatar.cc/160?img=47",
};

interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const cached = sessionStorage.getItem(SESSION_KEY);
      return cached ? DEMO_ADMIN : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    // Simulated auth check — no backend wired yet.
    await new Promise((resolve) => setTimeout(resolve, 550));

    const validEmail = email.trim().toLowerCase() === DEMO_ADMIN.email;
    const validPassword = password === "hubology2026";

    if (!validEmail || !validPassword) {
      return { ok: false, error: "Those credentials don't match our records. Try the demo login shown below." };
    }

    setUser(DEMO_ADMIN);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* sessionStorage unavailable — session just won't survive a refresh */
    }
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* no-op */
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

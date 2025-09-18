import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  userEmail?: string;
  needsOnboarding: boolean;
  login: (email: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("pf_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { isAuthenticated: boolean; userEmail?: string; needsOnboarding?: boolean };
        setIsAuthenticated(!!parsed.isAuthenticated);
        setUserEmail(parsed.userEmail);
        setNeedsOnboarding(!!parsed.needsOnboarding);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const payload = JSON.stringify({ isAuthenticated, userEmail, needsOnboarding });
    localStorage.setItem("pf_auth", payload);
  }, [isAuthenticated, userEmail, needsOnboarding]);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    userEmail,
    needsOnboarding,
    login: (email: string) => {
      setIsAuthenticated(true);
      setUserEmail(email);
      setNeedsOnboarding(true);
    },
    logout: () => {
      setIsAuthenticated(false);
      setUserEmail(undefined);
      setNeedsOnboarding(false);
    },
    completeOnboarding: () => setNeedsOnboarding(false),
  }), [isAuthenticated, userEmail, needsOnboarding]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}



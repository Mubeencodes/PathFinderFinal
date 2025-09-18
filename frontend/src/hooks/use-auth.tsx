import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchProfile,
  loginUser,
  registerUser,
  logoutUser as apiLogout,
} from "@/lib/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  profile?: {
    id: string;
    email?: string;
    username?: string;
    fullname?: string;
    bio?: string;
  };
  needsOnboarding: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (args: {
    username: string;
    email: string;
    password: string;
    fullname?: string;
    bio?: string;
  }) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] =
    useState<AuthContextValue["profile"]>(undefined);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Lazy fetch profile
      fetchMe();
    }
  }, []);

  useEffect(() => {
    const payload = JSON.stringify({
      isAuthenticated,
      profile,
      needsOnboarding,
    });
    localStorage.setItem("pf_auth", payload);
  }, [isAuthenticated, profile, needsOnboarding]);

  async function fetchMe() {
    try {
      const { data } = await fetchProfile();
      setProfile(data);
    } catch {}
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      profile,
      needsOnboarding,
      signIn: async (email: string, password: string) => {
        const res = await loginUser({ email, password });
        if (res.data?.token) {
          setIsAuthenticated(true);
          await fetchMe();
          setNeedsOnboarding(true);
        }
      },
      signUp: async ({ username, email, password, fullname, bio }) => {
        const res = await registerUser({
          username,
          email,
          password,
          fullname,
          bio,
        });
        if (res.data?.token) {
          setIsAuthenticated(true);
          await fetchMe();
          setNeedsOnboarding(true);
        }
      },
      fetchMe,
      logout: () => {
        apiLogout();
        setIsAuthenticated(false);
        setProfile(undefined);
        setNeedsOnboarding(false);
      },
      completeOnboarding: () => setNeedsOnboarding(false),
    }),
    [isAuthenticated, profile, needsOnboarding]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

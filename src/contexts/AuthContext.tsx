import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserType = "cuidador" | "necessitado" | "admin";

interface AuthUser {
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, userType: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "eldercare_auth";

interface StoredAuth {
  user: AuthUser;
  userType: UserType;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const { user: storedUser, userType: storedType }: StoredAuth = JSON.parse(stored);
        setUser(storedUser);
        setUserType(storedType);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (email: string, type: UserType) => {
    const newUser = { email };
    setUser(newUser);
    setUserType(type);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: newUser, userType: type }));
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

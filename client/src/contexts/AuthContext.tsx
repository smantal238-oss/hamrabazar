import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; name: string; phone: string } | null;
  login: (user: { id: string; name: string; phone: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; name: string; phone: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData: { id: string; name: string; phone: string }) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
  id: string;
  email: string;
  role: string;
  status?: string;
  publicKey?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  updateStellarKey: (publicKey: string, secretKey?: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password);
    setUser(user);
  };

  const register = async (email: string, password: string, role: string) => {
    const { user } = await authService.register(email, password, role);
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateStellarKey = async (publicKey: string, secretKey?: string) => {
    const { user } = await authService.updateStellarKey(publicKey, secretKey);
    setUser(user);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateStellarKey,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
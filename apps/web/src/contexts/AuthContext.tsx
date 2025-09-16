import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/api';
import AccessDeniedModal from '../components/AccessDeniedModal';

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
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  showAccessDenied: boolean;
  setShowAccessDenied: (show: boolean) => void;
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
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      // Check if user is rejected and show modal
      if (savedUser.status === 'REJECTED') {
        setShowAccessDenied(true);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password);
    setUser(user);
    // Check if user is rejected and show modal
    if (user.status === 'REJECTED') {
      setShowAccessDenied(true);
    }
  };

  const register = async (email: string, password: string, role: string) => {
    const { user } = await authService.register(email, password, role);
    setUser(user);
    // Check if user is rejected and show modal
    if (user.status === 'REJECTED') {
      setShowAccessDenied(true);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setShowAccessDenied(false);
  };

  const refreshUser = async () => {
    try {
      const { user } = await authService.getCurrentUserData();
      setUser(user);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
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
    refreshUser,
    isAuthenticated: !!user,
    loading,
    showAccessDenied,
    setShowAccessDenied,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => {
          setShowAccessDenied(false);
          logout(); // Faz logout do usuário rejeitado
        }}
        userRole={user?.role || ''}
      />
    </AuthContext.Provider>
  );
};
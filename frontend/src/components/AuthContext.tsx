import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  isInitializing: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchProfile = useCallback(async (authToken: string) => {
    const profile = await apiService.getUserProfile(authToken);
    setUser({
      id: profile.id,
      name: profile.name,
      email: profile.email,
    });
  }, []);

  // Initialize auth state from token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          await fetchProfile(storedToken);
          setIsAuthenticated(true);
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiService.login({ email, password });

    const authToken = response.token;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setIsAuthenticated(true);

    try {
      await fetchProfile(authToken);
    } catch {
      // Profile fetch is best-effort after login
    }
  }, [fetchProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  }, []);

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    token,
    isInitializing,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

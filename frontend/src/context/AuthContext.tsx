/**
 * Authentication context provider and useAuth hook.
 * Manages global authentication state and user information.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import authService from "../services/authService";
import { User, UserRole, AuthContextType } from "../types/auth";

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication context provider
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authService.getAccessToken();

      if (storedToken) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setToken(storedToken);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          authService.logout();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const tokenResponse = await authService.login({ email, password });
      setToken(tokenResponse.access_token);

      // Fetch user data
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  /**
   * Logout and clear auth state
   */
  const logout = (): void => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  /**
   * Refresh access token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      const newToken = await authService.refreshToken();
      setToken(newToken);
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === UserRole.ADMIN,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook to access authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

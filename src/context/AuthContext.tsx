import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, getCurrentUser, login as loginService, logout as logoutService } from '../services/authService';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error checking user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await loginService(username, password);
      setUser(loggedInUser);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log('AuthContext: Starting logout process');
      await logoutService();
      console.log('AuthContext: Logout service completed, clearing user state');
      
      // Always clear the user state, even if the API call fails
      setUser(null);
      console.log('AuthContext: User state cleared');
    } catch (err: any) {
      console.error('AuthContext: Logout error:', err.message || err);
      setError(err.message || 'Logout failed');
      
      // Still clear the user state even if there was an error with the API
      setUser(null);
      console.log('AuthContext: User state cleared after error');
    } finally {
      setIsLoading(false);
      console.log('AuthContext: Logout process completed');
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

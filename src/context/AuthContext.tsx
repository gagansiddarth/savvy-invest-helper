
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  riskProfile?: 'no' | 'low' | 'medium' | 'high' | 'very-high';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserRiskProfile: (profile: 'no' | 'low' | 'medium' | 'high' | 'very-high') => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('savvy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call to authenticate
    // For demo purposes, we'll just simulate a login
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login - in a real app, this would be validated by a server
      const newUser: User = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        email,
        // We'll set riskProfile later after assessment
      };
      
      setUser(newUser);
      localStorage.setItem('savvy_user', JSON.stringify(newUser));
      
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    // In a real app, this would create a new user account
    // For demo purposes, we'll just simulate account creation
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const newUser: User = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        email,
        // We'll set riskProfile later after assessment
      };
      
      setUser(newUser);
      localStorage.setItem('savvy_user', JSON.stringify(newUser));
      
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('savvy_user');
  };

  const updateUserRiskProfile = (profile: 'no' | 'low' | 'medium' | 'high' | 'very-high') => {
    if (user) {
      const updatedUser = {
        ...user,
        riskProfile: profile
      };
      setUser(updatedUser);
      localStorage.setItem('savvy_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateUserRiskProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

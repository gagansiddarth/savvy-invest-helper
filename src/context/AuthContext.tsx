
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

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
  logout: () => Promise<void>;
  updateUserRiskProfile: (profile: 'no' | 'low' | 'medium' | 'high' | 'very-high') => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Initialize: check for existing session
    const fetchSession = async () => {
      setIsLoading(true);
      
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        // Set user from session if it exists
        if (currentSession?.user) {
          const userData: User = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
          };
          
          // Check for stored risk profile in localStorage
          const storedUser = localStorage.getItem('savvy_user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.riskProfile) {
              userData.riskProfile = parsedUser.riskProfile;
            }
          }
          
          setUser(userData);
          localStorage.setItem('savvy_user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          const userData: User = {
            id: newSession.user.id,
            email: newSession.user.email || '',
          };
          
          // Check for stored risk profile in localStorage
          const storedUser = localStorage.getItem('savvy_user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.riskProfile) {
              userData.riskProfile = parsedUser.riskProfile;
            }
          }
          
          setUser(userData);
          localStorage.setItem('savvy_user', JSON.stringify(userData));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('savvy_user');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
        };
        
        // Check for stored risk profile in localStorage
        const storedUser = localStorage.getItem('savvy_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.riskProfile) {
            userData.riskProfile = parsedUser.riskProfile;
          }
        }
        
        setUser(userData);
        localStorage.setItem('savvy_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
        };
        
        setUser(userData);
        localStorage.setItem('savvy_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      localStorage.removeItem('savvy_user');
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
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

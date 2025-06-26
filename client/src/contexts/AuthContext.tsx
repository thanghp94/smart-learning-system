
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false); // Set to false to skip auth loading

  useEffect(() => {
    // For now, we'll skip authentication and set a default user
    // This allows the app to load without waiting for auth
    const defaultUser: User = {
      id: 'default-user',
      email: 'admin@school.com',
      name: 'Admin User'
    };
    
    const defaultSession: Session = {
      user: defaultUser,
      access_token: 'default-token'
    };
    
    setUser(defaultUser);
    setSession(defaultSession);
    setLoading(false);
  }, []);

  const signOut = async () => {
    try {
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

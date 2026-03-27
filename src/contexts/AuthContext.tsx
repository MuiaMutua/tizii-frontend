import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  platform_role?: string; 
  phone?: string;
  profile_img?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: "mock-user",
    email: "owner@tizii.com",
    full_name: "TIZII OWNER",
    role: "studio_owner",
  });
  const [token, setToken] = useState<string | null>("mock-token");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redesign phase: Always authorized with mock user
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Mock Login:", email);
    setUser({ id: "mock-user", email, full_name: "TIZII OWNER", role: "studio_owner" });
    setToken("mock-token");
  };

  const signup = async (fullName: string, email: string, password: string, role: string = 'artist') => {
    console.log("Mock Signup:", email);
    setUser({ id: "mock-user", email, full_name: fullName, role });
    setToken("mock-token");
  };

  const logout = async () => {
    console.log("Mock Logout");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

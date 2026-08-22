import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  quickLoginAs: (role: UserRole) => void;
}

const defaultAdminUser: User = {
  id: 'usr-1',
  name: 'David Sterling',
  email: 'admin@dayflow.io',
  role: 'admin',
  employeeId: 'DF-1004',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
};

const defaultHrUser: User = {
  id: 'usr-2',
  name: 'Priya Sharma',
  email: 'hr@dayflow.io',
  role: 'hr_officer',
  employeeId: 'DF-1005',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

const defaultEmployeeUser: User = {
  id: 'usr-3',
  name: 'Sarah Jenkins',
  email: 'sarah@dayflow.io',
  role: 'employee',
  employeeId: 'DF-1001',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dayflow_auth_user');
    return saved ? JSON.parse(saved) : defaultAdminUser;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('dayflow_auth_token') || 'demo_token';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('dayflow_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dayflow_auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('dayflow_auth_token', token);
    } else {
      localStorage.removeItem('dayflow_auth_token');
    }
  }, [token]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      // Attempt backend API call
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'password123' })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        return true;
      }
    } catch (e) {
      console.warn('Backend unavailable, using client-side auth fallback', e);
    }

    // Fallback client check
    const normalized = email.toLowerCase();
    if (normalized.includes('admin') || normalized === 'admin@dayflow.io') {
      setUser(defaultAdminUser);
      setToken('token_admin');
      return true;
    } else if (normalized.includes('hr') || normalized === 'hr@dayflow.io') {
      setUser(defaultHrUser);
      setToken('token_hr');
      return true;
    } else {
      setUser({
        ...defaultEmployeeUser,
        email: email,
        name: email.split('@')[0].replace('.', ' ').toUpperCase()
      });
      setToken('token_emp');
      return true;
    }
  };

  const register = async (name: string, email: string, password?: string, role: UserRole = 'employee'): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password || 'password123', role })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        return true;
      }
    } catch (e) {
      console.warn('Backend unavailable, using fallback register', e);
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      employeeId: `DF-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    setUser(newUser);
    setToken(`token_${newUser.id}`);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const quickLoginAs = (role: UserRole) => {
    if (role === 'admin') setUser(defaultAdminUser);
    else if (role === 'hr_officer') setUser(defaultHrUser);
    else setUser(defaultEmployeeUser);
    setToken(`token_${role}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickLoginAs
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (loginIdOrEmail: string, password?: string) => Promise<boolean>;
  quickLoginAs: (role: UserRole) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password?: string, role?: UserRole, companyName?: string, companyLogo?: string, phone?: string) => Promise<boolean>;
  updateUserCompany: (companyName: string, companyLogo?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUsers: Record<UserRole, User> = {
  admin: {
    id: 'usr-1',
    loginId: 'OIDAST20190003',
    email: 'admin@dayflow.io',
    name: 'David Sterling',
    role: 'admin',
    employeeId: 'DF-1004',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    companyName: 'Odoo India',
    companyLogo: ''
  },
  hr_officer: {
    id: 'usr-2',
    loginId: 'OIPRSH20210004',
    email: 'priya.s@dayflow.io',
    name: 'Priya Sharma',
    role: 'hr_officer',
    employeeId: 'DF-1005',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    companyName: 'Odoo India',
    companyLogo: ''
  },
  employee: {
    id: 'usr-3',
    loginId: 'OISAJE20220001',
    email: 'sarah.j@dayflow.io',
    name: 'Sarah Jenkins',
    role: 'employee',
    employeeId: 'DF-1001',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    companyName: 'Odoo India',
    companyLogo: ''
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dayflow_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return demoUsers.admin;
      }
    }
    return demoUsers.admin;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('dayflow_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dayflow_auth_user');
      localStorage.removeItem('dayflow_token');
    }
  }, [user]);

  const login = async (loginIdOrEmail: string, password = 'password123'): Promise<boolean> => {
    try {
      const response = await api.login(loginIdOrEmail, password);
      if (response && response.user) {
        setUser(response.user);
        if (response.token) {
          localStorage.setItem('dayflow_token', response.token);
        }
        return true;
      }
    } catch (err) {
      console.warn('Backend login fallback to local cache:', err);
      // Fallback
      const trimmed = loginIdOrEmail.trim().toLowerCase();
      const matched = Object.values(demoUsers).find(
        (u) => u.email.toLowerCase() === trimmed || (u.loginId && u.loginId.toLowerCase() === trimmed)
      );
      if (matched) {
        setUser(matched);
        return true;
      }
    }
    return false;
  };

  const quickLoginAs = async (role: UserRole) => {
    const targetUser = demoUsers[role];
    try {
      if (targetUser.loginId) {
        const response = await api.login(targetUser.loginId, 'password123');
        if (response?.user) {
          setUser(response.user);
          if (response.token) localStorage.setItem('dayflow_token', response.token);
          return;
        }
      }
    } catch (e) {
      console.warn('Quick login fallback:', e);
    }
    setUser(targetUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dayflow_auth_user');
    localStorage.removeItem('dayflow_token');
  };

  const register = async (
    name: string,
    email: string,
    password = 'password123',
    role: UserRole = 'admin',
    companyName = 'Odoo India',
    companyLogo = '',
    phone = ''
  ): Promise<boolean> => {
    try {
      const response = await api.register({
        name,
        email,
        password,
        role,
        companyName,
        companyLogo,
        phone
      });

      if (response && response.user) {
        setUser(response.user);
        if (response.token) localStorage.setItem('dayflow_token', response.token);
        return true;
      }
    } catch (err) {
      console.warn('Backend register error, local fallback:', err);
      const companyInitials = companyName
        .split(' ')
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase() || '')
        .join('');
      const nameParts = name.trim().split(' ');
      const f2 = (nameParts[0] || 'AD').substring(0, 2).toUpperCase().padEnd(2, 'X');
      const l2 = (nameParts[1] || nameParts[0] || 'MI').substring(0, 2).toUpperCase().padEnd(2, 'X');
      const currentYear = new Date().getFullYear();
      const generatedLoginId = `${companyInitials || 'DF'}${f2}${l2}${currentYear}0001`;

      const newUser: User = {
        id: `usr-${Date.now()}`,
        loginId: generatedLoginId,
        email,
        name,
        role,
        employeeId: 'DF-1004',
        avatar: companyLogo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        companyName,
        companyLogo,
        phone
      };

      setUser(newUser);
      return true;
    }
    return false;
  };

  const updateUserCompany = (companyName: string, companyLogo?: string) => {
    if (user) {
      const updated = {
        ...user,
        companyName,
        ...(companyLogo ? { companyLogo } : {})
      };
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        quickLoginAs,
        logout,
        register,
        updateUserCompany
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

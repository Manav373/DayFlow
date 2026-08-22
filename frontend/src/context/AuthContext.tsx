import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (loginIdOrEmail: string, password?: string) => Promise<boolean>;
  quickLoginAs: (role: UserRole) => void;
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

const allUsers: User[] = [
  demoUsers.admin,
  demoUsers.hr_officer,
  demoUsers.employee,
  {
    id: 'usr-4',
    loginId: 'OIALRI20210002',
    email: 'alex.rivera@dayflow.io',
    name: 'Alex Rivera',
    role: 'employee',
    employeeId: 'DF-1002',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    companyName: 'Odoo India'
  }
];

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
    return demoUsers.admin; // default active session
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('dayflow_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dayflow_auth_user');
    }
  }, [user]);

  const login = async (loginIdOrEmail: string, password?: string): Promise<boolean> => {
    const trimmed = loginIdOrEmail.trim().toLowerCase();

    // Match either Email OR Login ID
    const matched = allUsers.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        (u.loginId && u.loginId.toLowerCase() === trimmed)
    );

    if (matched) {
      setUser(matched);
      return true;
    }

    // Default fallback: create temporary session
    if (trimmed.includes('@') || trimmed.length > 3) {
      const isManager = trimmed.includes('admin') || trimmed.includes('hr');
      const newUser: User = {
        id: `usr-${Date.now()}`,
        loginId: trimmed.toUpperCase(),
        email: trimmed.includes('@') ? trimmed : `${trimmed.toLowerCase()}@dayflow.io`,
        name: trimmed.includes('@') ? trimmed.split('@')[0].replace('.', ' ') : 'Employee User',
        role: isManager ? (trimmed.includes('hr') ? 'hr_officer' : 'admin') : 'employee',
        employeeId: isManager ? 'DF-1004' : 'DF-1001',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        companyName: 'Odoo India'
      };
      setUser(newUser);
      return true;
    }

    return false;
  };

  const quickLoginAs = (role: UserRole) => {
    setUser(demoUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (
    name: string,
    email: string,
    _password?: string,
    role: UserRole = 'admin',
    companyName: string = 'Odoo India',
    companyLogo?: string,
    phone?: string
  ): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      loginId: `OI${name.substring(0, 2).toUpperCase()}20260001`,
      email,
      name,
      role,
      companyName,
      companyLogo,
      phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    allUsers.push(newUser);
    setUser(newUser);
    return true;
  };

  const updateUserCompany = (companyName: string, companyLogo?: string) => {
    if (user) {
      setUser({ ...user, companyName, companyLogo: companyLogo || user.companyLogo });
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

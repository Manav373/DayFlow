import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Clock,
  CalendarOff,
  CreditCard,
  BarChart3,
  Settings,
  Sparkles,
  User,
  FileText
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { stats, employees } = useHRMS();
  const { user } = useAuth();

  const currentEmp = employees.find(e => e.employeeId === user?.employeeId) || employees[0];
  const isEmployee = user?.role === 'employee';

  const adminNavItems = [
    {
      to: '/',
      label: 'Admin Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/employee-portal',
      label: 'Self Service',
      icon: UserCheck,
      badge: 'Live',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      to: '/directory',
      label: 'Directory',
      icon: Users,
      badge: `${stats.totalEmployees}`,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      to: '/attendance',
      label: 'Attendance',
      icon: Clock,
      badge: `${stats.presentToday} Logged`,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      to: '/time-off',
      label: 'Time Off',
      icon: CalendarOff,
      badge: stats.pendingLeaves > 0 ? `${stats.pendingLeaves} Req` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      to: '/payroll',
      label: 'Payroll',
      icon: CreditCard,
      badge: stats.payrollProcessing > 0 ? 'Pending' : null,
      badgeColor: 'bg-indigo-500 text-white',
    },
    {
      to: '/reports',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const employeeNavItems = [
    {
      to: '/employee-portal',
      label: 'My Portal',
      icon: UserCheck,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      to: '/directory',
      label: 'Directory',
      icon: Users,
      badge: `${stats.totalEmployees}`,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      to: '/attendance',
      label: 'My Attendance',
      icon: Clock,
      badge: 'Punch Log',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      to: '/time-off',
      label: 'Time Off & Leaves',
      icon: CalendarOff,
      badge: stats.pendingLeaves > 0 ? `${stats.pendingLeaves} Req` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      to: '/payroll',
      label: 'My Payslips',
      icon: FileText,
      badge: null,
    },
    {
      to: `/employee/${currentEmp?.id || 'emp-1'}`,
      label: 'My Profile',
      icon: User,
      badge: 'Odoo Tabs',
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
  ];

  const currentNavItems = isEmployee ? employeeNavItems : adminNavItems;

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
        <NavLink to={isEmployee ? '/employee-portal' : '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-brand-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                DAYFLOW
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                UNIFIED HRMS
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          {!isCollapsed && (
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Workspace Menu
            </span>
          )}
        </div>

        {currentNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-50/90 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${
                    item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer / User Authentication Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={user?.avatar || currentEmp.avatar}
                  alt={user?.name || currentEmp.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || currentEmp.name}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {user?.role === 'admin' ? 'Administrator' : user?.role === 'hr_officer' ? 'HR Officer' : 'Employee'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

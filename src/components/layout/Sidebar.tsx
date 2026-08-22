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
  ChevronRight,
  Shield,
  User
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { role, setRole, stats } = useHRMS();

  const navItems = [
    {
      to: '/',
      label: 'Admin Overview',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false,
    },
    {
      to: '/employee-portal',
      label: 'Self Service',
      icon: UserCheck,
      badge: 'Live',
      adminOnly: false,
    },
    {
      to: '/directory',
      label: 'Directory',
      icon: Users,
      badge: `${stats.totalEmployees}`,
      adminOnly: false,
    },
    {
      to: '/attendance',
      label: 'Attendance',
      icon: Clock,
      badge: `${stats.presentToday} Present`,
      adminOnly: false,
    },
    {
      to: '/time-off',
      label: 'Time Off',
      icon: CalendarOff,
      badge: stats.pendingLeaves > 0 ? `${stats.pendingLeaves} Req` : null,
      badgeColor: 'bg-amber-500 text-white',
      adminOnly: false,
    },
    {
      to: '/payroll',
      label: 'Payroll',
      icon: CreditCard,
      badge: stats.payrollProcessing > 0 ? 'Pending' : null,
      badgeColor: 'bg-indigo-500 text-white',
      adminOnly: false,
    },
    {
      to: '/reports',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
      adminOnly: false,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
      adminOnly: false,
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-brand-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                DAYFLOW
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Unified HRMS
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Role Selector Pill */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all ${
                role === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
            <button
              onClick={() => setRole('employee')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all ${
                role === 'employee'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Employee
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          {!isCollapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Workspace Menu
            </span>
          )}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-semibold shadow-xs'
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

      {/* Footer / System Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-200">Dayflow Enterprise</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              Syncing live attendance & payroll pipeline.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Clock,
  Play,
  Square,
  CheckCircle2,
  Menu,
  ChevronDown,
  KeyRound,
  LogOut,
  User
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { useAuth } from '../../context/AuthContext';
import { KioskModal } from '../kiosk/KioskModal';

interface TopNavProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  isCollapsed,
  setIsCollapsed,
  isDarkMode,
  setIsDarkMode,
}) => {
  const navigate = useNavigate();
  const { employees, isPunchedIn, togglePunch, workSeconds } = useHRMS();
  const { user, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showKiosk, setShowKiosk] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredQuickSearch = searchQuery.trim()
    ? employees.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.workInfo.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.workInfo.jobPosition.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const currentUser = employees.find(e => e.employeeId === user?.employeeId) || employees[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between">
      {/* Left: Hamburger & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees, departments, policies... (Ctrl+K)"
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
          />

          {/* Quick Search Dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                Quick Search Results
              </div>
              {filteredQuickSearch.length > 0 ? (
                filteredQuickSearch.slice(0, 4).map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      navigate(`/employee/${emp.id}`);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition"
                  >
                    <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{emp.name}</div>
                      <div className="text-[11px] text-slate-500">{emp.workInfo.jobPosition} • {emp.workInfo.department}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">No matching employees found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Kiosk Mode Shortcut */}
        <button
          onClick={() => setShowKiosk(true)}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-brand-600 dark:text-brand-300 rounded-xl hover:bg-indigo-100 transition"
          title="Open Kiosk PIN Punch"
        >
          <KeyRound className="w-3.5 h-3.5" />
          Kiosk Punch
        </button>

        {/* Live Attendance Clock Pill */}
        <div className="hidden sm:flex items-center bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 pl-3 gap-3">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isPunchedIn ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isPunchedIn ? 'Active Work Shift' : 'Off Clock'}
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                {isPunchedIn ? formatTimer(workSeconds) : '00:00:00'}
              </span>
            </div>
          </div>

          <button
            onClick={() => togglePunch()}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition shadow-xs ${
              isPunchedIn
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            {isPunchedIn ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                Punch Out
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Punch In
              </>
            )}
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 relative transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[11px] font-semibold text-brand-600 cursor-pointer">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50 mt-2 max-h-64 overflow-y-auto">
                <div className="py-2.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                      Leave approved for <span className="font-bold">Sarah Jenkins</span>
                    </p>
                    <span className="text-[10px] text-slate-400">10 mins ago</span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                      August payroll cycle open for signoff
                    </p>
                    <span className="text-[10px] text-slate-400">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <img
              src={user?.avatar || currentUser.avatar}
              alt={user?.name || currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {user?.name || currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">
                {user?.role === 'admin' ? 'Administrator' : user?.role === 'hr_officer' ? 'HR Officer' : 'Employee'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || currentUser.email}</p>
              </div>

              <Link
                to={`/employee/${currentUser.id}`}
                onClick={() => setShowUserMenu(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                View My Profile
              </Link>

              <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kiosk Modal */}
      <KioskModal isOpen={showKiosk} onClose={() => setShowKiosk(false)} />
    </header>
  );
};

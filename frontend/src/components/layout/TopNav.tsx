import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Clock,
  Menu,
  ChevronDown,
  KeyRound,
  LogOut,
  User,
  Lock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { useAuth } from '../../context/AuthContext';
import { KioskModal } from '../kiosk/KioskModal';
import { ChangePasswordModal } from '../common/ChangePasswordModal';
import { triggerSuccessBurst } from '../../utils/confetti';

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
  const { employees, isPunchedIn, togglePunch, workSeconds, attendanceRecords } = useHRMS();
  const { user, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSystrayPunch, setShowSystrayPunch] = useState(false);
  const [showKiosk, setShowKiosk] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = employees.find(e => e.employeeId === user?.employeeId) || employees[0];
  const todayRecord = attendanceRecords.find(
    r => r.employeeId === currentUser.employeeId && r.date === new Date().toISOString().split('T')[0]
  );
  const checkInTime = todayRecord?.checkIn || '09:00 AM';

  const handleSystrayPunch = async () => {
    await togglePunch();
    triggerSuccessBurst();
    setShowSystrayPunch(false);
  };

  const filteredQuickSearch = searchQuery.trim()
    ? employees.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.loginId && e.loginId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.workInfo.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.workInfo.jobPosition.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Sidebar Toggle Hamburger & Global Search */}
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
            placeholder="Search employees, Login IDs, departments... (Ctrl+K)"
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition"
          />

          {/* Quick Search Results Dropdown */}
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
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{emp.name}</span>
                        <span className="text-[10px] font-mono text-purple-600 font-bold bg-purple-50 dark:bg-purple-950/50 px-1 rounded">
                          {emp.loginId || 'OIJODO20220001'}
                        </span>
                      </div>
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
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 rounded-xl hover:bg-purple-100 transition"
          title="Open Kiosk PIN Punch"
        >
          <KeyRound className="w-3.5 h-3.5" />
          Kiosk Punch
        </button>

        {/* Live Attendance Systray Dot (Red / Green) */}
        <div className="relative">
          <button
            onClick={() => setShowSystrayPunch(!showSystrayPunch)}
            className={`flex items-center gap-2 p-2 rounded-2xl border transition ${
              isPunchedIn
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50/80 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
            }`}
            title="Attendance Check In / Check Out Systray"
          >
            <span
              className={`w-3.5 h-3.5 rounded-full ring-4 shadow-sm transition-all ${
                isPunchedIn
                  ? 'bg-emerald-500 ring-emerald-200 dark:ring-emerald-900 animate-pulse'
                  : 'bg-rose-500 ring-rose-200 dark:ring-rose-900'
              }`}
            />
            <span className="hidden sm:inline text-xs font-bold font-mono">
              {isPunchedIn ? 'Present' : 'Off Duty'}
            </span>
          </button>

          {/* Systray Dropdown Menu */}
          <AnimatePresence>
            {showSystrayPunch && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 8 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50 text-slate-900 dark:text-white"
              >
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isPunchedIn ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                      }`}
                    />
                    <span className="text-xs font-bold">
                      {isPunchedIn ? 'Currently Checked IN' : 'Currently Checked OUT'}
                    </span>
                  </div>

                  {isPunchedIn ? (
                    <div className="space-y-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                        Since <strong className="text-emerald-600 dark:text-emerald-400">{checkInTime}</strong>
                      </div>
                      <button
                        onClick={handleSystrayPunch}
                        className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                      >
                        Check Out -&gt;
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[11px] text-slate-400">
                        Mark your office presence for today
                      </p>
                      <button
                        onClick={handleSystrayPunch}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                      >
                        Check IN -&gt;
                      </button>
                    </div>
                  )}

                  <Link
                    to="/attendance"
                    onClick={() => setShowSystrayPunch(false)}
                    className="block text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline pt-1"
                  >
                    View Attendance Module →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[11px] font-semibold text-purple-600 cursor-pointer">Mark all read</span>
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
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <img
              src={user?.avatar || currentUser.avatar}
              alt={user?.name || currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/30 shadow-xs"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in text-slate-900 dark:text-white">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                <p className="text-xs font-bold">{user?.name || currentUser.name}</p>
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold">
                  {user?.loginId || 'OISAJE20220001'}
                </p>
              </div>

              <Link
                to={`/employee/${currentUser.id}`}
                onClick={() => setShowUserMenu(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/40 rounded-xl transition"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                My Profile
              </Link>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowChangePassword(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Change Password
              </button>

              <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kiosk Modal */}
      <KioskModal isOpen={showKiosk} onClose={() => setShowKiosk(false)} />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </header>
  );
};

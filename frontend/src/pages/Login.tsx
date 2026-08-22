import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Shield,
  UserCheck,
  User,
  Clock,
  CreditCard,
  CalendarOff,
  Check,
  Building,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { triggerSuccessBurst } from '../utils/confetti';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, quickLoginAs } = useAuth();

  const [loginIdOrEmail, setLoginIdOrEmail] = useState('OISAJE20220001');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successGreet, setSuccessGreet] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(loginIdOrEmail, password);

    if (success) {
      triggerSuccessBurst();
      setSuccessGreet('Authenticated! Initializing workspace...');
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      setLoading(false);
      setError('Invalid Login ID, Email, or Password. Please verify your credentials.');
    }
  };

  const handleQuickPersona = (role: 'admin' | 'hr_officer' | 'employee', idVal: string) => {
    setLoginIdOrEmail(idVal);
    quickLoginAs(role);
    triggerSuccessBurst();
    setSuccessGreet(
      `Signing in as ${
        role === 'admin' ? 'David Sterling' : role === 'hr_officer' ? 'Priya Sharma' : 'Sarah Jenkins'
      } (${idVal})...`
    );
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans relative overflow-hidden">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/40 dark:bg-purple-950/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Two-Column Master Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* ========================================================================= */}
        {/* LEFT SIDE: Brand Showcase, Live Floating Cards & Enterprise Metrics */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:col-span-6 space-y-6 lg:pr-6 hidden sm:block"
        >
          {/* Brand Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-200">
              Next-Gen Enterprise HRMS
            </span>
          </div>

          {/* Hero Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Manage talent, <br />
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent">
                attendance & payroll
              </span>{' '}
              seamlessly.
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Empower your enterprise with automated standardized Login IDs, biometric systray clocking, and dynamic compensation architecture.
            </p>
          </div>

          {/* Floating Feature Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <motion.div
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Formula Login IDs
              </h4>
              <p className="text-[11px] text-slate-500">
                <code className="text-purple-600 font-bold font-mono">[OI][JODO][2022][0001]</code> auto-provisioning.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Live Systray Attendance
              </h4>
              <p className="text-[11px] text-slate-500">
                🔴 / 🟢 Instant punch-in with day-wise timesheet logs.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Dynamic 50% Basic Salary
              </h4>
              <p className="text-[11px] text-slate-500">
                Real-time HRA, LTA, Bonus, and 12% PF calculation.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <CalendarOff className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                12-Month Leave Calendar
              </h4>
              <p className="text-[11px] text-slate-500">
                Odoo-style time off quotas with single-click approvals.
              </p>
            </motion.div>
          </div>

          {/* Social Proof Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-200/60 dark:border-purple-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="user" />
                <img className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="user" />
                <img className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" alt="user" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Trusted by 10,000+ HR Teams
              </span>
            </div>
            <span className="text-xs font-mono font-extrabold text-purple-700 dark:text-purple-300">99.9% Uptime</span>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* RIGHT SIDE: Sign In Form Card & 1-Click Persona Access */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:col-span-6 w-full max-w-md mx-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-none p-7 sm:p-8 space-y-6 relative z-10">
            
            {/* Top Logo Badge */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-800/60 rounded-2xl shadow-xs">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-black tracking-widest uppercase text-purple-900 dark:text-purple-200">
                  DAYFLOW HRMS
                </span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white pt-1">
                Sign in to Your Account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your system-generated Login ID or corporate email
              </p>
            </div>

            {/* Error / Feedback Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/50 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold text-center"
                >
                  {error}
                </motion.div>
              )}
              {successGreet && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {successGreet}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign In Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Login Id / Email :-
                </label>
                <div className="relative group">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-600 transition" />
                  <input
                    type="text"
                    required
                    value={loginIdOrEmail}
                    onChange={(e) => setLoginIdOrEmail(e.target.value)}
                    placeholder="e.g. OISAJE20220001 or sarah.j@dayflow.io"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 transition font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Login ID format: <code className="text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/50 px-1.5 py-0.5 rounded">OIJODO20220001</code>
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password :-
                  </label>
                  <a href="#forgot" className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-600 transition" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Signature Purple Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider rounded-xl shadow-md shadow-purple-500/25 transition disabled:opacity-50 uppercase mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                  </span>
                ) : (
                  'SIGN IN'
                )}
              </motion.button>
            </form>

            {/* 1-Click Demo Persona Login */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
                1-Click Demo Login with System IDs
              </p>
              <div className="grid grid-cols-3 gap-2">
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleQuickPersona('admin', 'OIDAST20190003')}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-slate-700 text-center transition group"
                >
                  <Shield className="w-4 h-4 text-purple-600 mx-auto mb-1 group-hover:scale-110 transition" />
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white">Admin</div>
                  <div className="text-[9px] font-mono font-semibold text-purple-700 dark:text-purple-300 truncate">
                    OIDAST20190003
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleQuickPersona('hr_officer', 'OIPRSH20210004')}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-slate-700 text-center transition group"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1 group-hover:scale-110 transition" />
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white">HR Officer</div>
                  <div className="text-[9px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 truncate">
                    OIPRSH20210004
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleQuickPersona('employee', 'OISAJE20220001')}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-slate-700 text-center transition group"
                >
                  <User className="w-4 h-4 text-indigo-600 mx-auto mb-1 group-hover:scale-110 transition" />
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white">Employee</div>
                  <div className="text-[9px] font-mono font-semibold text-indigo-700 dark:text-indigo-300 truncate">
                    OISAJE20220001
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Footer Sign Up Link */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
              Don't have an Account?{' '}
              <Link to="/register" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

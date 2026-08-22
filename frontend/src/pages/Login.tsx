import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  UserCheck,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { triggerSuccessBurst } from '../utils/confetti';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, quickLoginAs } = useAuth();

  const [email, setEmail] = useState('david.s@dayflow.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successGreet, setSuccessGreet] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      triggerSuccessBurst();
      setSuccessGreet('Welcome back! Loading your workspace...');
      setTimeout(() => {
        navigate('/');
      }, 700);
    } else {
      setLoading(false);
      setError('Invalid email or password credentials. Please retry.');
    }
  };

  const handleQuickPersona = (role: 'admin' | 'hr_officer' | 'employee') => {
    quickLoginAs(role);
    triggerSuccessBurst();
    setSuccessGreet(`Signing in as ${role === 'admin' ? 'David Sterling (Admin)' : role === 'hr_officer' ? 'Priya Sharma (HR)' : 'Sarah Jenkins (Employee)'}...`);
    setTimeout(() => {
      navigate(role === 'employee' ? '/employee-portal' : '/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Ambient Background Blobs */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-600/25 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Floating Glassmorphism Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-8 space-y-6 relative z-10 text-slate-900 dark:text-white"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-emerald-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-brand-500/30 cursor-pointer"
          >
            <Sparkles className="w-7 h-7" />
          </motion.div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Sign In to DayFlow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enterprise Human Resource Management System
          </p>
        </div>

        {/* Error or Success Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold text-center"
            >
              {error}
            </motion.div>
          )}
          {successGreet && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {successGreet}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-600 transition" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@dayflow.io"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <a href="#forgot" className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-600 transition" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/25 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                Sign In to Portal <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Quick Demo Personas */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-center mb-3">
            Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickPersona('admin')}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700 text-center transition group"
            >
              <Shield className="w-5 h-5 text-brand-600 mx-auto mb-1 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Admin</div>
              <div className="text-[10px] text-slate-400">Full Access</div>
            </motion.button>

            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickPersona('hr_officer')}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/80 dark:border-slate-700 text-center transition group"
            >
              <UserCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">HR Lead</div>
              <div className="text-[10px] text-slate-400">Approvals</div>
            </motion.button>

            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickPersona('employee')}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-slate-700 text-center transition group"
            >
              <User className="w-5 h-5 text-purple-600 mx-auto mb-1 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Employee</div>
              <div className="text-[10px] text-slate-400">Self Service</div>
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Register new employee
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lock,
  Mail,
  Shield,
  UserCheck,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  KeyRound
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
      setSuccessGreet('Authenticated! Initializing workspace session...');
      setTimeout(() => {
        navigate('/');
      }, 600);
    } else {
      setLoading(false);
      setError('Invalid Login ID, Email, or Password. Please try again.');
    }
  };

  const handleQuickPersona = (role: 'admin' | 'hr_officer' | 'employee', idVal: string) => {
    setLoginIdOrEmail(idVal);
    quickLoginAs(role);
    triggerSuccessBurst();
    setSuccessGreet(`Signing in as ${role === 'admin' ? 'David Sterling' : role === 'hr_officer' ? 'Priya Sharma' : 'Sarah Jenkins'} (${idVal})...`);
    setTimeout(() => {
      navigate(role === 'employee' ? '/employee-portal' : '/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Animated Blobs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-16 w-80 h-80 bg-purple-600/25 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 -right-16 w-80 h-80 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none"
      />

      {/* Main Sign In Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="w-full max-w-md bg-[#131926]/95 backdrop-blur-2xl rounded-3xl border border-slate-700/80 shadow-2xl p-8 space-y-6 relative z-10 text-white"
      >
        {/* App/Web Logo Box (from wireframe) */}
        <div className="text-center space-y-2">
          <div className="w-full max-w-[220px] mx-auto py-2.5 px-4 bg-slate-800/80 border border-slate-700 rounded-2xl flex items-center justify-center gap-2 shadow-inner">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-slate-200">
              DAYFLOW HRMS
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight pt-1">
            Sign in to Your Account
          </h2>
          <p className="text-xs text-slate-400">
            Enter your system-generated Login ID or Email
          </p>
        </div>

        {/* Feedback Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold text-center"
            >
              {error}
            </motion.div>
          )}
          {successGreet && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {successGreet}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Inputs (Wireframe standard) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Login Id / Email :-
            </label>
            <div className="relative group">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition" />
              <input
                type="text"
                required
                value={loginIdOrEmail}
                onChange={(e) => setLoginIdOrEmail(e.target.value)}
                placeholder="e.g. OIJODO20220001 or name@dayflow.io"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Example Login ID format: <code className="text-purple-300">OIJODO20220001</code>
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                Password :-
              </label>
              <a href="#forgot" className="text-[11px] font-semibold text-purple-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Wireframe Signature Purple Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider rounded-xl shadow-lg shadow-purple-600/30 transition disabled:opacity-50 uppercase mt-2"
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

        {/* Quick 1-Click Login ID Personas */}
        <div className="pt-3 border-t border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
            1-Click Login with System IDs
          </p>
          <div className="grid grid-cols-3 gap-2">
            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickPersona('admin', 'OIDAST20190003')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-purple-950/40 border border-slate-700 text-center transition"
            >
              <Shield className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-white">Admin</div>
              <div className="text-[9px] font-mono text-purple-300">OIDAST20190003</div>
            </motion.button>

            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickPersona('hr_officer', 'OIPRSH20210004')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-purple-950/40 border border-slate-700 text-center transition"
            >
              <UserCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-white">HR Officer</div>
              <div className="text-[9px] font-mono text-emerald-300">OIPRSH20210004</div>
            </motion.button>

            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickPersona('employee', 'OISAJE20220001')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-purple-950/40 border border-slate-700 text-center transition"
            >
              <User className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-white">Employee</div>
              <div className="text-[9px] font-mono text-indigo-300">OISAJE20220001</div>
            </motion.button>
          </div>
        </div>

        {/* Footer (from wireframe) */}
        <div className="text-center text-xs text-slate-400 pt-1">
          Don't have an Account?{' '}
          <Link to="/register" className="font-bold text-purple-400 hover:text-purple-300 underline underline-offset-4">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

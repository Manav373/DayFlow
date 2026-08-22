import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Info,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { triggerSuccessBurst, triggerCelebration } from '../utils/confetti';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [companyName, setCompanyName] = useState('Odoo India');
  const [companyLogo, setCompanyLogo] = useState('');
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successGreet, setSuccessGreet] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setCompanyLogo(fakeUrl);
      setLogoUploaded(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    const success = await register(
      name,
      email,
      password,
      'admin',
      companyName || 'Odoo India',
      companyLogo,
      phoneNumber
    );

    if (success) {
      triggerCelebration();
      setSuccessGreet('Company workspace initialized! Directing to Admin Portal...');
      setTimeout(() => {
        navigate('/');
      }, 800);
    } else {
      setLoading(false);
      setError('Failed to create account. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Animated Blobs */}
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-16 w-80 h-80 bg-purple-600/25 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 -left-16 w-80 h-80 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-lg space-y-4 relative z-10">
        {/* Main Sign Up Card (Wireframe Style) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="bg-[#131926]/95 backdrop-blur-2xl rounded-3xl border border-slate-700/80 shadow-2xl p-8 space-y-6 text-white"
        >
          {/* App/Web Logo Box */}
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
              Sign Up Company Account
            </h2>
            <p className="text-xs text-slate-400">
              Initialize your corporate tenant & primary administrator
            </p>
          </div>

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

          {/* Form Fields matching the Wireframe */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name + Upload Logo */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Company Name :-
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 group">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Odoo India"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition font-medium"
                  />
                </div>

                {/* Upload Logo Trigger (From Wireframe) */}
                <label
                  htmlFor="logo-upload"
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border cursor-pointer text-xs font-bold transition flex-shrink-0 ${
                    logoUploaded
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                      : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  }`}
                  title="Upload Company Logo"
                >
                  {logoUploaded ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                  <span>{logoUploaded ? 'Uploaded' : 'Upload Logo'}</span>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Name :-
              </label>
              <div className="relative group">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Sterling"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email :-
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@odooindia.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Phone :-
              </label>
              <div className="relative group">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition"
                />
              </div>
            </div>

            {/* Password & Confirm Password with Eye Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Password :-
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Confirm Password :-
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Wireframe Signature Purple Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider rounded-xl shadow-lg shadow-purple-600/30 transition disabled:opacity-50 mt-3 uppercase"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Provisioning Workspace...
                </span>
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>

          {/* Footer (from wireframe) */}
          <div className="text-center text-xs text-slate-400 pt-1">
            Already have an account ?{' '}
            <Link to="/login" className="font-bold text-purple-400 hover:text-purple-300 underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Note Box matching the exact wireframe instructions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#131926]/90 border border-slate-700/80 rounded-2xl p-4.5 space-y-2 text-slate-300 text-xs"
        >
          <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-700/60">
            <Info className="w-4 h-4" /> System Provisioning Note
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
            <li>
              <span className="text-slate-200 font-medium">Normal users cannot self-register:</span> When an Admin or HR Officer creates a user/employee, their unique <strong className="text-purple-300">Login ID</strong> is automatically generated following the standard format (e.g. <code className="text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded">OIJODO20220001</code>).
            </li>
            <li>
              Initial temporary passwords are auto-generated for first-time login and can be updated after signing in.
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

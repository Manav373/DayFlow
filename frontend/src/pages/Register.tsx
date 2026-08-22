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
  Check,
  Shield,
  KeyRound,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { triggerCelebration } from '../utils/confetti';

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
      setSuccessGreet('Company workspace initialized! Directing to Portal...');
      setTimeout(() => {
        navigate('/');
      }, 700);
    } else {
      setLoading(false);
      setError('Failed to create account. Please verify details.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans relative overflow-hidden">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/40 dark:bg-purple-950/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2" />

      {/* Two-Column Master Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* ========================================================================= */}
        {/* LEFT SIDE: System Provisioning Guidelines & Company Benefits */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:col-span-6 space-y-6 lg:pr-6 hidden sm:block"
        >
          {/* Brand Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 shadow-xs">
            <Building className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-200">
              Enterprise Tenant Provisioning
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Create your organization <br />
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent">
                DayFlow workspace.
              </span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Register your legal company entity and provision your primary master administrator account.
            </p>
          </div>

          {/* Official System Provisioning Note Box */}
          <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 rounded-3xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-extrabold uppercase tracking-wider text-xs pb-2 border-b border-purple-100 dark:border-purple-900/60">
              <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              System Provisioning Policy
            </div>

            <div className="space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                <p>
                  <strong className="text-slate-900 dark:text-white">Normal users cannot self-register:</strong> Standard employees are created by Admins/HR Officers with auto-generated Login IDs.
                </p>
              </div>

              <div className="ml-4 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 font-mono text-xs text-purple-900 dark:text-purple-200 font-bold">
                Formula format: <span className="text-purple-700 dark:text-purple-300 bg-white dark:bg-purple-900/80 px-2 py-0.5 rounded-lg border border-purple-200 dark:border-purple-700">OIJODO20220001</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                <p>
                  Initial temporary passwords are auto-generated and can be updated anytime after signing in.
                </p>
              </div>
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>End-to-end encrypted tenant isolation and role-based data partitioning.</span>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* RIGHT SIDE: Sign Up Form Card */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:col-span-6 w-full max-w-lg mx-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-none p-7 sm:p-8 space-y-5 relative z-10">
            
            {/* Header */}
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
                Sign Up Company Account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Initialize your corporate workspace & primary administrator
              </p>
            </div>

            {/* Error / Success Alerts */}
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Company Name + Upload Logo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Company Name :-
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 group">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-600 transition" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Odoo India"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition font-medium"
                    />
                  </div>

                  <label
                    htmlFor="reg-logo-upload"
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border cursor-pointer text-xs font-bold transition flex-shrink-0 ${
                      logoUploaded
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300'
                        : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-600 shadow-sm'
                    }`}
                  >
                    {logoUploaded ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    <span>{logoUploaded ? 'Uploaded' : 'Upload Logo'}</span>
                    <input
                      id="reg-logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Administrator Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Name :-
                </label>
                <div className="relative group">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-600 transition" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. David Sterling"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email :-
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-600 transition" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@odooindia.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone :-
                </label>
                <div className="relative group">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-600 transition" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password :-
                  </label>
                  <div className="relative group">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-600 transition" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password :-
                  </label>
                  <div className="relative group">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-600 transition" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider rounded-xl shadow-md shadow-purple-500/25 transition disabled:opacity-50 mt-2 uppercase"
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

            {/* Footer */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
              Already have an account ?{' '}
              <Link to="/login" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

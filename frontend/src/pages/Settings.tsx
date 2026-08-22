import React, { useState } from 'react';
import {
  Building,
  Clock,
  CalendarOff,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { triggerCelebration } from '../utils/confetti';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'shifts' | 'leaves' | 'notifications' | 'security'>('security');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [companySettings, setCompanySettings] = useState({
    name: user?.companyName || 'Odoo India',
    domain: 'odooindia.com',
    contactEmail: user?.email || 'admin@odooindia.com',
    timezone: 'UTC+05:30 (India Standard Time)',
    currency: 'INR (₹)',
    country: 'India',
    hqAddress: '100 Cyber City, Gandhinagar, Gujarat 382007'
  });

  const [shiftRules, setShiftRules] = useState({
    standardStart: '09:00',
    standardEnd: '17:00',
    gracePeriodMins: 15,
    halfDayThresholdHours: 4.5
  });

  const [leavePolicies, setLeavePolicies] = useState({
    casualQuota: 12,
    sickQuota: 10,
    annualQuota: 18,
    maternityQuota: 60,
    maxRolloverDays: 5
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    setPasswordError('');
    setPasswordSuccess(true);
    triggerCelebration();
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account & Enterprise Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your credentials, system Login ID, and workspace governance policies
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Settings saved successfully!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'security'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-4 h-4" />
          Security & Password
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'general'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4 h-4" />
          Company Profile
        </button>

        <button
          onClick={() => setActiveTab('shifts')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'shifts'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          Working Shifts & Hours
        </button>

        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'leaves'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <CalendarOff className="w-4 h-4" />
          Leave Policy Limits
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'notifications'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          Alerts & Notifications
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Identity Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 md:p-8 shadow-soft">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Your System Identity
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5 mb-1">
                  <KeyRound className="w-3.5 h-3.5" /> System Login ID
                </span>
                <div className="text-base font-black font-mono text-purple-800 dark:text-purple-200">
                  {user?.loginId || 'OISAJE20220001'}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Generated by formula: [OI][Name][Year][Serial]</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 mb-1 block">
                  Corporate Email
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user?.email || 'sarah.j@dayflow.io'}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Primary communication handle</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 mb-1 block">
                  Designated Role
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white uppercase">
                  {user?.role || 'Employee'}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Authorized access level</p>
              </div>
            </div>
          </div>

          {/* Change System Generated Password Form */}
          <form onSubmit={handlePasswordUpdate} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 md:p-8 shadow-soft space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Change System-Generated Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your initial temporary password with a personalized secure password
              </p>
            </div>

            {passwordError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Password has been updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current / System Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Temporary password"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                <ShieldCheck className="w-4 h-4" />
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 md:p-8 shadow-soft space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Organization Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Legal Entity Name
              </label>
              <input
                type="text"
                value={companySettings.name}
                onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Company Domain
              </label>
              <input
                type="text"
                value={companySettings.domain}
                onChange={(e) => setCompanySettings({ ...companySettings, domain: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Corporate HQ Address
              </label>
              <input
                type="text"
                value={companySettings.hqAddress}
                onChange={(e) => setCompanySettings({ ...companySettings, hqAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Timezone
              </label>
              <select
                value={companySettings.timezone}
                onChange={(e) => setCompanySettings({ ...companySettings, timezone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option>UTC+05:30 (India Standard Time)</option>
                <option>UTC-08:00 (Pacific Time)</option>
                <option>UTC-05:00 (Eastern Time)</option>
                <option>UTC+00:00 (London/GMT)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === 'shifts' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 md:p-8 shadow-soft space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Shift Rules & Biometric Clocking</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Shift Start Time
              </label>
              <input
                type="time"
                value={shiftRules.standardStart}
                onChange={(e) => setShiftRules({ ...shiftRules, standardStart: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Shift End Time
              </label>
              <input
                type="time"
                value={shiftRules.standardEnd}
                onChange={(e) => setShiftRules({ ...shiftRules, standardEnd: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Late Arrival Grace Period (Minutes)
              </label>
              <input
                type="number"
                value={shiftRules.gracePeriodMins}
                onChange={(e) => setShiftRules({ ...shiftRules, gracePeriodMins: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === 'leaves' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 md:p-8 shadow-soft space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Annual Leave Entitlement Quotas</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Casual Leave (Days)
              </label>
              <input
                type="number"
                value={leavePolicies.casualQuota}
                onChange={(e) => setLeavePolicies({ ...leavePolicies, casualQuota: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Sick Leave (Days)
              </label>
              <input
                type="number"
                value={leavePolicies.sickQuota}
                onChange={(e) => setLeavePolicies({ ...leavePolicies, sickQuota: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Annual PTO (Days)
              </label>
              <input
                type="number"
                value={leavePolicies.annualQuota}
                onChange={(e) => setLeavePolicies({ ...leavePolicies, annualQuota: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Max Rollover (Days)
              </label>
              <input
                type="number"
                value={leavePolicies.maxRolloverDays}
                onChange={(e) => setLeavePolicies({ ...leavePolicies, maxRolloverDays: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 md:p-8 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Email & Push Alert Preferences</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">New Leave Request Submissions</div>
                <div className="text-[11px] text-slate-500">Alert managers immediately when an employee requests PTO</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Monthly Payroll Processing Readiness</div>
                <div className="text-[11px] text-slate-500">Send disbursement notification 2 days before cycle close</div>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

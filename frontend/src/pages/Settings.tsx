import React, { useState } from 'react';
import {
  Building,
  Clock,
  CalendarOff,
  Bell,
  Save,
  CheckCircle2
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'shifts' | 'leaves' | 'notifications'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [companySettings, setCompanySettings] = useState({
    name: 'Dayflow Technologies Inc.',
    domain: 'dayflow.io',
    contactEmail: 'admin@dayflow.io',
    timezone: 'UTC-08:00 (Pacific Time)',
    currency: 'USD ($)',
    country: 'United States',
    hqAddress: '100 Montgomery St, Suite 1400, San Francisco, CA 94104'
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Portal Settings & Governance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure enterprise policies, working shifts, and HR rules
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Settings saved successfully!
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'general'
              ? 'bg-brand-600 text-white shadow-sm'
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
              ? 'bg-brand-600 text-white shadow-sm'
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
              ? 'bg-brand-600 text-white shadow-sm'
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
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          Alerts & Notifications
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 md:p-8 shadow-soft space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
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
                  <option>UTC-08:00 (Pacific Time)</option>
                  <option>UTC-05:00 (Eastern Time)</option>
                  <option>UTC+00:00 (London/GMT)</option>
                  <option>UTC+05:30 (India Standard Time)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shifts' && (
          <div className="space-y-6">
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
          </div>
        )}

        {activeTab === 'leaves' && (
          <div className="space-y-6">
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
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Email & Push Alert Preferences</h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">New Leave Request Submissions</div>
                  <div className="text-[11px] text-slate-500">Alert managers immediately when an employee requests PTO</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Monthly Payroll Processing Readiness</div>
                  <div className="text-[11px] text-slate-500">Send disbursement notification 2 days before cycle close</div>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

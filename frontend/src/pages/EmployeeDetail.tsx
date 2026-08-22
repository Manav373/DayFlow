import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Trash2,
  Briefcase,
  User,
  Shield,
  Building,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  CheckCircle2,
  Camera,
  MapPin,
  Lock
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { useAuth } from '../context/AuthContext';
import { Employee, UserRole } from '../types';
import { Badge } from '../components/common/Badge';
import { triggerSuccessBurst } from '../utils/confetti';

export const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, updateEmployee, deleteEmployee } = useHRMS();
  const { user } = useAuth();

  const employee = employees.find((e) => e.id === id || e.employeeId === id) || employees[0];

  const isManager = user?.role === 'admin' || user?.role === 'hr_officer';
  const isOwnProfile = user?.employeeId === employee?.employeeId;

  // Determine available tabs for current user
  const canViewPrivateInfo = isManager || isOwnProfile;
  const canViewHRSettings = isManager;

  const [activeTab, setActiveTab] = useState<'work' | 'private' | 'hr'>('work');
  const [formData, setFormData] = useState<Employee>(employee);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateEmployee(formData.id, formData);
    triggerSuccessBurst();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${formData.name}'s profile?`)) {
      await deleteEmployee(formData.id);
      navigate('/directory');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/directory"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </Link>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isSaved && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
              >
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </motion.span>
            )}
          </AnimatePresence>

          {isManager && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
              title="Delete Profile"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}

          {(isManager || isOwnProfile) && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Odoo Sheet Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-soft overflow-hidden">
        {/* Header Profile Section */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700/80 bg-slate-50/40 dark:bg-slate-800/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <motion.div whileHover={{ scale: 1.03 }} className="relative group">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-700 shadow-md"
                />
                {(isManager || isOwnProfile) && (
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter image URL for avatar:', formData.avatar);
                      if (url) setFormData({ ...formData, avatar: url });
                    }}
                    className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </motion.div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                    {formData.name}
                  </span>
                  <Badge variant={formData.status === 'Active' ? 'success' : 'warning'} size="sm">
                    {formData.status}
                  </Badge>
                  {isOwnProfile && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-200">
                      Your Profile
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {formData.workInfo.jobPosition} • {formData.workInfo.department}
                </p>
                <span className="text-[11px] font-mono text-slate-400">
                  Employee ID: {formData.employeeId} {isManager && `• Badge: ${formData.hrSettings.badgeId}`}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {isManager ? (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                >
                  <option value="Active">Status: Active</option>
                  <option value="On Leave">Status: On Leave</option>
                  <option value="Probation">Status: Probation</option>
                  <option value="Inactive">Status: Inactive</option>
                </select>
              ) : (
                <Badge variant={formData.status === 'Active' ? 'success' : 'warning'} size="md">
                  Status: {formData.status}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Odoo Style Tab Headers with Animated Sliding Indicator */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6 md:px-8 bg-white dark:bg-slate-800 relative">
          {/* TAB 1: WORK INFO */}
          <button
            onClick={() => setActiveTab('work')}
            className={`relative py-4 px-4 text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'work'
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Work Information
            {activeTab === 'work' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
          </button>

          {/* TAB 2: PRIVATE INFO */}
          {canViewPrivateInfo && (
            <button
              onClick={() => setActiveTab('private')}
              className={`relative py-4 px-4 text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'private'
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <User className="w-4 h-4" />
              Private Information
              {activeTab === 'private' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          )}

          {/* TAB 3: HR SETTINGS */}
          {canViewHRSettings && (
            <button
              onClick={() => setActiveTab('hr')}
              className={`relative py-4 px-4 text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'hr'
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Shield className="w-4 h-4" />
              HR Settings
              {activeTab === 'hr' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          )}
        </div>

        {/* Tab Contents with AnimatePresence */}
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
          <AnimatePresence mode="wait">
            {/* TAB 1: WORK INFORMATION */}
            {activeTab === 'work' && (
              <motion.div
                key="work-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b pb-2">
                    Location & Department
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Department
                    </label>
                    {isManager ? (
                      <select
                        value={formData.workInfo.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workInfo: { ...formData.workInfo, department: e.target.value }
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Product">Product</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Finance">Finance</option>
                        <option value="Executive">Executive</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        disabled
                        value={formData.workInfo.department}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 cursor-not-allowed"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Work Location
                    </label>
                    <input
                      type="text"
                      disabled={!isManager}
                      value={formData.workInfo.workLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workInfo: { ...formData.workInfo, workLocation: e.target.value }
                        })
                      }
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 ${
                        isManager ? 'bg-slate-50 dark:bg-slate-900' : 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed text-slate-600'
                      } text-slate-900 dark:text-white`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Work Address
                    </label>
                    <input
                      type="text"
                      disabled={!isManager}
                      value={formData.workInfo.workAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workInfo: { ...formData.workInfo, workAddress: e.target.value }
                        })
                      }
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 ${
                        isManager ? 'bg-slate-50 dark:bg-slate-900' : 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed text-slate-600'
                      } text-slate-900 dark:text-white`}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b pb-2">
                    Hierarchy & Schedule
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Reporting Manager
                    </label>
                    <input
                      type="text"
                      disabled={!isManager}
                      value={formData.workInfo.manager}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workInfo: { ...formData.workInfo, manager: e.target.value }
                        })
                      }
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 ${
                        isManager ? 'bg-slate-50 dark:bg-slate-900' : 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed text-slate-600'
                      } text-slate-900 dark:text-white`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Working Schedule
                    </label>
                    <input
                      type="text"
                      disabled={!isManager}
                      value={formData.workInfo.workSchedule}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workInfo: { ...formData.workInfo, workSchedule: e.target.value }
                        })
                      }
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 ${
                        isManager ? 'bg-slate-50 dark:bg-slate-900' : 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed text-slate-600'
                      } text-slate-900 dark:text-white`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      disabled={!isManager}
                      value={formData.workInfo.joinDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workInfo: { ...formData.workInfo, joinDate: e.target.value }
                        })
                      }
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 ${
                        isManager ? 'bg-slate-50 dark:bg-slate-900' : 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed text-slate-600'
                      } text-slate-900 dark:text-white`}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: PRIVATE INFORMATION */}
            {activeTab === 'private' && canViewPrivateInfo && (
              <motion.div
                key="private-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b pb-2">
                    Private Contact & Identity
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Personal Email
                    </label>
                    <input
                      type="email"
                      value={formData.privateInfo.privateEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, privateEmail: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Personal Phone
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.privatePhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, privatePhone: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Identification Number (SSN / PAN)
                    </label>
                    <input
                      type="text"
                      disabled={!isManager}
                      value={formData.privateInfo.identificationNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, identificationNumber: e.target.value }
                        })
                      }
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 ${
                        isManager ? 'bg-slate-50 dark:bg-slate-900' : 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed'
                      } text-slate-900 dark:text-white`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Residential Address
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, address: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b pb-2">
                    Emergency Contact & Bank Details
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Emergency Contact Name & Relation
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.emergencyContactName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, emergencyContactName: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.emergencyContactPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, emergencyContactPhone: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.bankName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, bankName: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Account Number & Routing
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.bankAccountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, bankAccountNumber: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: HR SETTINGS */}
            {activeTab === 'hr' && canViewHRSettings && (
              <motion.div
                key="hr-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b pb-2">
                    Attendance Badging & Security
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      RFID Badge ID
                    </label>
                    <input
                      type="text"
                      value={formData.hrSettings.badgeId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hrSettings: { ...formData.hrSettings, badgeId: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kiosk PIN Code (for attendance clock)
                    </label>
                    <input
                      type="text"
                      value={formData.hrSettings.pinCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hrSettings: { ...formData.hrSettings, pinCode: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b pb-2">
                    System Roles & Compensation
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      System Access Level
                    </label>
                    <select
                      value={formData.hrSettings.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hrSettings: { ...formData.hrSettings, role: e.target.value as UserRole }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="employee">Employee (Self Service)</option>
                      <option value="hr_officer">HR Officer (Personnel & Leaves)</option>
                      <option value="admin">Administrator (Complete Access)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Annual Gross Base Salary ($ USD)
                    </label>
                    <input
                      type="number"
                      value={formData.hrSettings.salary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hrSettings: { ...formData.hrSettings, salary: Number(e.target.value) }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
};

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
  CheckCircle2,
  MapPin,
  Pencil,
  Plus,
  Award,
  DollarSign,
  KeyRound,
  FileText,
  Clock,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Calculator
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { useAuth } from '../context/AuthContext';
import { Employee, ResumeInfo, SalaryBreakdown } from '../types';
import { Badge } from '../components/common/Badge';
import { triggerSuccessBurst } from '../utils/confetti';
import { api } from '../services/api';

export const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, updateEmployee, deleteEmployee } = useHRMS();
  const { user } = useAuth();

  const currentLoggedInEmp = employees.find(e => e.employeeId === user?.employeeId || e.loginId === user?.loginId || e.email === user?.email);
  const employee = (id && employees.find((e) => e.id === id || e.employeeId === id || e.loginId === id)) || currentLoggedInEmp || employees[0];

  const isManager = user?.role === 'admin' || user?.role === 'hr_officer';
  const isOwnProfile = user?.employeeId === employee?.employeeId || user?.loginId === employee?.loginId || user?.email === employee?.email;

  // Tab permissions
  const canViewPrivateInfo = isManager || isOwnProfile;
  const canViewSalaryInfo = isManager; // Salary Info strictly for Admin/HR
  const canViewSecurity = isManager || isOwnProfile; // Security/Password strictly for Owner or Admin

  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'salary' | 'security'>('resume');
  const [formData, setFormData] = useState<Employee>(employee);
  const [isSaved, setIsSaved] = useState(false);

  // Resume State
  const defaultResume: ResumeInfo = {
    about:
      formData?.resumeInfo?.about ||
      `${formData.name} is a dedicated professional with extensive experience in ${formData.workInfo.department}. Passionate about building robust systems and delivering high quality product standards.`,
    whatILove:
      formData?.resumeInfo?.whatILove ||
      'I love collaborating with cross-functional teams, solving challenging architectural problems, and mentoring rising talent in our department.',
    interests:
      formData?.resumeInfo?.interests ||
      'UI/UX design systems, open source software, reading tech journals, hiking, and continuous learning.',
    skills:
      formData?.resumeInfo?.skills || ['React & TypeScript', 'System Architecture', 'Design Systems', 'Team Leadership', 'API Design'],
    certifications:
      formData?.resumeInfo?.certifications || ['Certified Scrum Master (CSM)', 'AWS Certified Solutions Architect', 'Odoo Certified Specialist']
  };

  const [resumeData, setResumeData] = useState<ResumeInfo>(defaultResume);
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddCert, setShowAddCert] = useState(false);

  // Dynamic Salary Engine (Calculated automatically based on defined monthly wage)
  const initialMonthlyWage = formData?.salaryBreakdown?.monthWage || (formData.hrSettings?.salary ? Math.round(formData.hrSettings.salary / 12) : 50000);
  const [wageInput, setWageInput] = useState<number>(initialMonthlyWage || 50000);
  const [workingDays, setWorkingDays] = useState<number>(5);
  const [breakTime, setBreakTime] = useState<number>(1);

  // Auto-calculated salary components
  const monthlyWage = Number(wageInput) || 50000;
  const yearlyWage = monthlyWage * 12;

  const basicSalary = Math.round(monthlyWage * 0.5); // 50.00% of wage
  const basicPct = 50.0;

  const hra = Math.round(basicSalary * 0.5); // 50.00% of basic
  const hraPct = 50.0;

  const standardAllowance = Math.round(4167 * (monthlyWage / 50000)); // 16.67% of basic
  const standardAllowancePct = 16.67;

  const performanceBonus = Math.round(2082.5 * (monthlyWage / 50000)); // 8.33% of basic
  const performanceBonusPct = 8.33;

  const lta = Math.round(2082.5 * (monthlyWage / 50000)); // 8.33% of basic
  const ltaPct = 8.33;

  const fixedAllowance = Math.max(0, monthlyWage - (basicSalary + hra + standardAllowance + performanceBonus + lta));
  const fixedAllowancePct = Number(((fixedAllowance / monthlyWage) * 100).toFixed(2));

  const pfEmployee = Math.round(basicSalary * 0.12); // 12.00% of basic
  const pfEmployer = Math.round(basicSalary * 0.12); // 12.00% of basic
  const professionalTax = 200; // Fixed 200 ₹ / month

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      if (employee.resumeInfo) {
        setResumeData(employee.resumeInfo);
      }
    }
  }, [employee]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Employee = {
      ...formData,
      resumeInfo: resumeData,
      salaryBreakdown: {
        wageType: 'Fixed wage',
        monthWage: monthlyWage,
        yearlyWage,
        workingDaysWeek: workingDays,
        breakTimeHours: breakTime,
        basicSalary,
        basicPct,
        hra,
        hraPct,
        standardAllowance,
        standardAllowancePct,
        performanceBonus,
        performanceBonusPct,
        lta,
        ltaPct,
        fixedAllowance,
        fixedAllowancePct,
        pfEmployee,
        pfEmployeePct: 12,
        pfEmployer,
        pfEmployerPct: 12,
        professionalTax
      }
    };
    await updateEmployee(formData.id, updated);
    triggerSuccessBurst();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim()) {
      setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill.trim()] });
      setNewSkill('');
      setShowAddSkill(false);
    }
  };

  const handleAddCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCert.trim()) {
      setResumeData({ ...resumeData, certifications: [...resumeData.certifications, newCert.trim()] });
      setNewCert('');
      setShowAddCert(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await api.changePassword({
        userId: formData.hrSettings?.userId,
        loginId: formData.loginId,
        currentPassword,
        newPassword
      });
      setPassError('');
      setPassSuccess(true);
      triggerSuccessBurst();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(false), 4000);
    } catch (err: any) {
      setPassError(err.message || 'Failed to update password.');
    }
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
      className="space-y-6 max-w-6xl mx-auto font-sans"
    >
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Employees
        </Link>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isSaved && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200"
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
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Odoo Sheet Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden">
        {/* Header Profile Section (Exact Layout from Wireframe) */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
            {isOwnProfile ? 'My Profile' : 'Employee Profile'}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Avatar + Basic Info */}
            <div className="lg:col-span-7 flex items-start gap-5">
              <div className="relative group flex-shrink-0">
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
                    title="Change Avatar"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {formData.name}
                  </h1>
                  <Badge variant={formData.status === 'Active' ? 'success' : 'warning'} size="sm">
                    {formData.status}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold w-16">Login ID:</span>
                    <strong className="font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded">
                      {formData.loginId || 'OIJODO20220001'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold w-16">Email:</span>
                    <span className="truncate">{formData.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold w-16">Mobile:</span>
                    <span>{formData.phone || '+91 98765 43210'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Company, Department, Manager, Location */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-400 font-semibold">Company:</span>
                <span className="font-bold text-slate-900 dark:text-white">{user?.companyName || 'Odoo India'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-400 font-semibold">Department:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formData.workInfo.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-400 font-semibold">Manager:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.workInfo.manager}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-semibold">Location:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.workInfo.workLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Headers: [Resume] [Private Info] [Salary Info (Admin only)] [Security] */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 md:px-8 bg-white dark:bg-slate-900 relative">
          {/* TAB 1: RESUME */}
          <button
            onClick={() => setActiveTab('resume')}
            className={`relative py-4 px-4 text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'resume'
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            Resume
            {activeTab === 'resume' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
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
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <User className="w-4 h-4" />
              Private Info
              {activeTab === 'private' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          )}

          {/* TAB 3: SALARY INFO (Strictly visible only to Admin) */}
          {canViewSalaryInfo && (
            <button
              onClick={() => setActiveTab('salary')}
              className={`relative py-4 px-4 text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'salary'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Salary Info
              {activeTab === 'salary' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          )}

          {/* TAB 4: SECURITY (Only visible on own profile or for Admin/HR) */}
          {canViewSecurity && (
            <button
              onClick={() => setActiveTab('security')}
              className={`relative py-4 px-4 text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'security'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Shield className="w-4 h-4" />
              Security
              {activeTab === 'security' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          )}
        </div>

        {/* Tab Body Contents */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* TAB 1: RESUME (Wireframe 2-Column: About, What I Love, Interests | Skills, Certification) */}
            {activeTab === 'resume' && (
              <motion.div
                key="resume-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left Column (7 cols): About, What I Love, Interests */}
                <div className="lg:col-span-7 space-y-6">
                  {/* About Box */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        About
                      </h3>
                      {(isManager || isOwnProfile) && (
                        <button
                          type="button"
                          onClick={() => {
                            const val = prompt('Edit About summary:', resumeData.about);
                            if (val !== null) setResumeData({ ...resumeData, about: val });
                          }}
                          className="text-slate-400 hover:text-purple-600 p-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {resumeData.about}
                    </p>
                  </div>

                  {/* What I love about my job */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        What I love about my job
                      </h3>
                      {(isManager || isOwnProfile) && (
                        <button
                          type="button"
                          onClick={() => {
                            const val = prompt('Edit What I Love:', resumeData.whatILove);
                            if (val !== null) setResumeData({ ...resumeData, whatILove: val });
                          }}
                          className="text-slate-400 hover:text-purple-600 p-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {resumeData.whatILove}
                    </p>
                  </div>

                  {/* My interests and hobbies */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        My interests and hobbies
                      </h3>
                      {(isManager || isOwnProfile) && (
                        <button
                          type="button"
                          onClick={() => {
                            const val = prompt('Edit Interests & Hobbies:', resumeData.interests);
                            if (val !== null) setResumeData({ ...resumeData, interests: val });
                          }}
                          className="text-slate-400 hover:text-purple-600 p-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {resumeData.interests}
                    </p>
                  </div>
                </div>

                {/* Right Column (5 cols): Skills & Certifications */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Skills Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Skills
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {(isManager || isOwnProfile) && (
                      <div className="pt-2">
                        {showAddSkill ? (
                          <form onSubmit={handleAddSkillSubmit} className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="e.g. Next.js, Figma..."
                              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl"
                            >
                              Add
                            </button>
                          </form>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowAddSkill(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Skills
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Certification Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Certification
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {resumeData.certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                        >
                          <Award className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>

                    {(isManager || isOwnProfile) && (
                      <div className="pt-2">
                        {showAddCert ? (
                          <form onSubmit={handleAddCertSubmit} className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={newCert}
                              onChange={(e) => setNewCert(e.target.value)}
                              placeholder="e.g. AWS Solutions Architect..."
                              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl"
                            >
                              Add
                            </button>
                          </form>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowAddCert(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Certification
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: PRIVATE INFO (Exact Wireframe Fields: Date of Birth, Residing Address, Nationality, Personal Email, Gender, Marital Status, Date of Joining | Bank Details, Account Number, Bank Name, IFSC Code, PAN No, UAN NO, Emp Code) */}
            {activeTab === 'private' && canViewPrivateInfo && (
              <motion.div
                key="private-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Left Column: Personal Identity */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b pb-2">
                    Personal Identity & Residence
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.privateInfo.dateOfBirth || '1995-04-12'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, dateOfBirth: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Residing Address
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.address || 'Flat 402, Green Meadows, Gandhinagar, Gujarat'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, address: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.nationality || 'Indian'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, nationality: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Personal Email
                    </label>
                    <input
                      type="email"
                      value={formData.privateInfo.privateEmail || 'sarah.personal@gmail.com'}
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
                      Gender
                    </label>
                    <select
                      value={formData.privateInfo.gender || 'Female'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, gender: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option>Female</option>
                      <option>Male</option>
                      <option>Non-Binary / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Marital Status
                    </label>
                    <select
                      value={formData.privateInfo.maritalStatus || 'Single'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, maritalStatus: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      value={formData.workInfo.joinDate || '2022-06-01'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workInfo: { ...formData.workInfo, joinDate: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Right Column: Bank Details & Statutory IDs */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b pb-2">
                    Bank Details & Statutory Codes
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.bankAccountNumber || '987654321098'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, bankAccountNumber: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.bankName || 'HDFC Bank Ltd'}
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
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.bankIfscOrRouting || 'HDFC0001234'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, bankIfscOrRouting: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      PAN No
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.panNumber || 'ABCDE1234F'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, panNumber: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      UAN NO
                    </label>
                    <input
                      type="text"
                      value={formData.privateInfo.uanNumber || '101234567890'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privateInfo: { ...formData.privateInfo, uanNumber: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Emp Code
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.employeeId || 'EMP-1001'}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: SALARY INFO (Dynamic Live Calculation Engine based on Defined Wage - Admin Only) */}
            {activeTab === 'salary' && canViewSalaryInfo && (
              <motion.div
                key="salary-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Dynamic Wage Definition Header */}
                <div className="p-6 rounded-3xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5" /> Wage Type & Master Compensation Definition
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                        Fixed Wage: <span className="font-mono text-purple-700 dark:text-purple-300">₹{monthlyWage.toLocaleString()} / Month</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Salary components auto-calculate dynamically based on this defined wage.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Define Monthly Wage (₹) *
                        </label>
                        <input
                          type="number"
                          value={wageInput}
                          onChange={(e) => setWageInput(Number(e.target.value))}
                          className="w-36 px-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-purple-800 dark:text-purple-200 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-purple-200/60 dark:border-purple-800/60">
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-800/50">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Month Wage</span>
                      <div className="text-sm font-black font-mono text-slate-900 dark:text-white mt-0.5">
                        ₹{monthlyWage.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-800/50">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Yearly Wage</span>
                      <div className="text-sm font-black font-mono text-slate-900 dark:text-white mt-0.5">
                        ₹{yearlyWage.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-800/50">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Working Days / Week</span>
                      <div className="text-sm font-black font-mono text-slate-900 dark:text-white mt-0.5">
                        {workingDays} Days
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-800/50">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Daily Break Time</span>
                      <div className="text-sm font-black font-mono text-slate-900 dark:text-white mt-0.5">
                        {breakTime} Hour
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2-Column Salary Components & Deductions (Exact Wireframe Breakdown) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column (7 cols): Salary Components */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b pb-2">
                      Salary Components (Auto-Calculated)
                    </h3>

                    {/* 1. Basic Salary */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-white">Basic Salary</span>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">₹{basicSalary.toFixed(2)} / month</span>
                          <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded font-bold border border-purple-200 dark:border-purple-800">
                            50.00 %
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        Define Basic salary from company cost compute it based on monthly Wages (50% of wage)
                      </p>
                    </div>

                    {/* 2. House Rent Allowance */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-white">House Rent Allowance (HRA)</span>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">₹{hra.toFixed(2)} / month</span>
                          <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded font-bold border border-purple-200 dark:border-purple-800">
                            50.00 %
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        HRA provided to employees 50% of the basic salary
                      </p>
                    </div>

                    {/* 3. Standard Allowance */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-white">Standard Allowance</span>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">₹{standardAllowance.toFixed(2)} / month</span>
                          <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded font-bold border border-purple-200 dark:border-purple-800">
                            {standardAllowancePct} %
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        A standard allowance is a predetermined, fixed amount provided to employee as part of their salary
                      </p>
                    </div>

                    {/* 4. Performance Bonus */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-white">Performance Bonus</span>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">₹{performanceBonus.toFixed(2)} / month</span>
                          <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded font-bold border border-purple-200 dark:border-purple-800">
                            {performanceBonusPct} %
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary
                      </p>
                    </div>

                    {/* 5. Leave Travel Allowance */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-white">Leave Travel Allowance (LTA)</span>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">₹{lta.toFixed(2)} / month</span>
                          <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded font-bold border border-purple-200 dark:border-purple-800">
                            {ltaPct} %
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        LTA is paid by the company to employees to cover their travel expenses, and calculated as a % of the basic salary
                      </p>
                    </div>

                    {/* 6. Fixed Allowance */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-white">Fixed Allowance</span>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">₹{fixedAllowance.toFixed(2)} / month</span>
                          <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded font-bold border border-purple-200 dark:border-purple-800">
                            {fixedAllowancePct} %
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        Fixed allowance portion of wages is determined after calculating all salary components (Wage - Total)
                      </p>
                    </div>
                  </div>

                  {/* Right Column (5 cols): Statutory PF & Tax Deductions */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Provident Fund (PF) Contribution */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b pb-2">
                        Provident Fund (PF) Contribution
                      </h3>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800 dark:text-white">Employee</span>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">₹{pfEmployee.toFixed(2)} / month</span>
                            <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded font-bold">12.00 %</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">
                          PF is calculated based on the basic salary (12%)
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800 dark:text-white">Employer</span>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">₹{pfEmployer.toFixed(2)} / month</span>
                            <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded font-bold">12.00 %</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">
                          PF is calculated based on the basic salary (12%)
                        </p>
                      </div>
                    </div>

                    {/* Tax Deductions */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b pb-2">
                        Tax Deductions
                      </h3>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800 dark:text-white">Professional Tax</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">₹{professionalTax.toFixed(2)} / month</span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">
                          Professional Tax deducted from the Gross salary
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: SECURITY (Login ID, Change Password, Authentication Details) */}
            {activeTab === 'security' && canViewSecurity && (
              <motion.div
                key="security-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Identity Summary Card */}
                <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 block">
                        Assigned Login ID
                      </span>
                      <div className="text-base font-black font-mono text-purple-800 dark:text-purple-200 mt-0.5">
                        {formData.loginId || 'OIJODO20220001'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 block">
                        Corporate Handle
                      </span>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">
                        {formData.email}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 block">
                        Kiosk PIN Code
                      </span>
                      <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {formData.hrSettings?.pinCode || '1234'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Update Form */}
                <form onSubmit={handlePasswordUpdate} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-4">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Update Account Password
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Change the initial system-generated password to a custom secure password
                    </p>
                  </div>

                  {passError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                      {passError}
                    </div>
                  )}

                  {passSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Password has been updated successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current password"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-sm transition"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

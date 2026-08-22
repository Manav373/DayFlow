import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Plane,
  Grid,
  List,
  Mail,
  MapPin,
  Briefcase,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  Settings as SettingsIcon
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { useAuth } from '../context/AuthContext';
import { Employee, EmployeeStatus } from '../types';
import { Modal } from '../components/common/Modal';
import { generateLoginId, generateInitialPassword } from '../utils/idGenerator';
import { triggerCelebration } from '../utils/confetti';

export const EmployeeDirectory: React.FC = () => {
  const navigate = useNavigate();
  const { employees, addEmployee, attendanceRecords } = useHRMS();
  const { user } = useAuth();

  const isManager = user?.role === 'admin' || user?.role === 'hr_officer';

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ loginId: string; tempPass: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const [newEmpForm, setNewEmpForm] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    designation: '',
    status: 'Active' as EmployeeStatus,
    joinDate: new Date().toISOString().split('T')[0],
    phone: '+1 (555) 000-0000',
    location: 'San Francisco HQ',
    salary: 115000,
    manager: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  });

  const departments = ['All', 'Engineering', 'Design', 'Product', 'Human Resources', 'Finance', 'Executive'];

  // Live computed Login ID preview
  const liveJoinYear = newEmpForm.joinDate ? new Date(newEmpForm.joinDate).getFullYear() : 2026;
  const previewLoginId = generateLoginId(
    newEmpForm.name || 'John Doe',
    liveJoinYear,
    employees.length + 1,
    user?.companyName || 'Odoo India'
  );

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.loginId && emp.loginId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      emp.workInfo.jobPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.workInfo.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpForm.name || !newEmpForm.email) return;

    const tempPassword = generateInitialPassword();
    const created = await addEmployee({
      name: newEmpForm.name,
      email: newEmpForm.email,
      phone: newEmpForm.phone,
      status: newEmpForm.status,
      loginId: previewLoginId,
      workInfo: {
        department: newEmpForm.department,
        jobPosition: newEmpForm.role || newEmpForm.designation,
        manager: newEmpForm.manager,
        workLocation: newEmpForm.location,
        workAddress: '100 Montgomery St, San Francisco, CA',
        workSchedule: 'Standard 40 Hours',
        joinDate: newEmpForm.joinDate
      },
      hrSettings: {
        badgeId: `BADGE-${Math.floor(1000 + Math.random() * 9000)}`,
        pinCode: `${Math.floor(1000 + Math.random() * 9000)}`,
        role: 'employee',
        salary: newEmpForm.salary,
        loginId: previewLoginId,
        initialPassword: tempPassword
      }
    });

    triggerCelebration();
    setIsAddModalOpen(false);
    setCreatedCredentials({
      loginId: previewLoginId,
      tempPass: tempPassword,
      name: created.name
    });
  };

  const copyCredentials = () => {
    if (createdCredentials) {
      navigator.clipboard.writeText(
        `DayFlow Credentials:\nName: ${createdCredentials.name}\nLogin ID: ${createdCredentials.loginId}\nTemporary Password: ${createdCredentials.tempPass}\nSign In: ${window.location.origin}/login`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  /**
   * Status Indicator Logic matching the exact Wireframe:
   * 🟢 Green dot: Employee is present in the office.
   * ✈️ Airplane icon: Employee is on leave.
   * 🟡 Yellow dot: Employee is absent. (Employee has not applied time off and is absent.)
   */
  const getStatusIndicator = (emp: Employee) => {
    const isPresent = attendanceRecords.some(
      (a) => a.employeeId === emp.employeeId && a.date === new Date().toISOString().split('T')[0] && (a.status === 'Present' || a.status === 'Late')
    );

    if (emp.status === 'On Leave') {
      return (
        <div
          title="On Leave (Airplane)"
          className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs"
        >
          <Plane className="w-3.5 h-3.5" />
        </div>
      );
    }

    if (isPresent || emp.attendanceToday === 'Present') {
      return (
        <div
          title="Present in Office (Green Dot)"
          className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center"
        >
          <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-700 animate-pulse" />
        </div>
      );
    }

    // Otherwise absent / not checked in without approved leave (Yellow dot)
    return (
      <div
        title="Absent / Not checked in (Yellow Dot)"
        className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center"
      >
        <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-200 dark:ring-amber-700" />
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar matching Wireframe: [NEW (Purple Button)] on Left, [Search] on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3">
          {/* NEW Button (Purple / Wireframe Standard) */}
          {isManager && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider rounded-xl shadow-md shadow-purple-600/20 transition uppercase"
            >
              <Plus className="w-4 h-4" />
              NEW
            </motion.button>
          )}

          <div className="text-xs text-slate-500 font-semibold">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'Employee' : 'Employees'}
          </div>
        </div>

        {/* Search Bar on Right */}
        <div className="flex items-center gap-3 flex-1 max-w-md ml-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend for Status Indicators */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 px-1 font-medium">
        <span className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400">
          Work Status:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Present in Office</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Plane className="w-3.5 h-3.5 text-blue-500" />
          <span>On Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Absent / Not Checked In</span>
        </div>
      </div>

      {/* 3x3 Grid View (Exact Wireframe: Clickable Card, Top-right Status Dot/Icon, Avatar on left, Basic Info) */}
      {viewMode === 'grid' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEmployees.map((emp) => {
            const isOwnProfile = user?.employeeId === emp.employeeId;

            return (
              <motion.div
                key={emp.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/employee/${emp.id}`)}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-soft hover:shadow-elevated hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 cursor-pointer group relative flex flex-col justify-between"
              >
                {/* Top Row: Avatar on left, Status Indicator on top-right */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-700 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition">
                          {emp.name}
                        </h3>
                        {isOwnProfile && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{emp.workInfo.jobPosition}</p>
                      <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold mt-0.5">
                        {emp.loginId || 'OIJODO20220001'}
                      </div>
                    </div>
                  </div>

                  {/* Wireframe Status Indicator (Green dot / Airplane / Yellow dot) */}
                  <div className="flex-shrink-0">
                    {getStatusIndicator(emp)}
                  </div>
                </div>

                {/* Card Details */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.workInfo.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>

                {/* Footer action link */}
                <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-bold">
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* Table View */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-soft overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Login ID</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Job Position</th>
                  <th className="px-6 py-4">Work Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => navigate(`/employee/${emp.id}`)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 cursor-pointer transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{emp.name}</div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {emp.loginId || 'OIJODO20220001'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      {emp.workInfo.department}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{emp.workInfo.jobPosition}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIndicator(emp)}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {emp.status === 'On Leave' ? 'On Leave' : emp.status === 'Active' ? 'Present' : 'Absent'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/employee/${emp.id}`);
                        }}
                        className="text-xs font-bold text-purple-600 hover:underline"
                      >
                        Form View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}



      {/* Add Employee Modal */}
      {isManager && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Onboard New Employee (System Login ID Generator)"
          subtitle="Generates unique standardized Login ID & temporary access credentials"
          maxWidth="2xl"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Auto-Generated Login ID Formula
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Format: <span className="font-mono font-bold text-purple-800 dark:text-purple-200">[OI][Name2+2][Year][Serial]</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-base font-black font-mono text-purple-700 dark:text-purple-300">
                  {previewLoginId}
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Ready to assign</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newEmpForm.name}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  value={newEmpForm.email}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                  placeholder="john.doe@odooindia.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Job Position
                </label>
                <input
                  type="text"
                  required
                  value={newEmpForm.designation}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, designation: e.target.value, role: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={newEmpForm.department}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, department: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {departments.filter(d => d !== 'All').map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Year of Joining (For ID Formula)
                </label>
                <input
                  type="date"
                  value={newEmpForm.joinDate}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, joinDate: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gross Annual Salary ($)
                </label>
                <input
                  type="number"
                  value={newEmpForm.salary}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, salary: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md transition"
              >
                Provision Account & View Credentials →
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Generated Credentials Success Modal */}
      {createdCredentials && (
        <Modal
          isOpen={!!createdCredentials}
          onClose={() => setCreatedCredentials(null)}
          title="Account Provisioned Successfully!"
          subtitle="Share these initial login credentials with the new employee"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
              <Sparkles className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                {createdCredentials.name} is ready to sign in!
              </h3>
              <p className="text-xs text-slate-500">
                The employee can log in using their Login ID and change their temporary password.
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Login ID:</span>
                <strong className="text-purple-600 dark:text-purple-400 text-sm">{createdCredentials.loginId}</strong>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Initial Password:</span>
                <strong className="text-slate-800 dark:text-slate-200">{createdCredentials.tempPass}</strong>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={copyCredentials}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Credentials!' : 'Copy Credentials to Clipboard'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Play,
  Square,
  Calendar,
  CalendarOff,
  CreditCard,
  FileText,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Link } from 'react-router-dom';
import { triggerCelebration, triggerSuccessBurst } from '../utils/confetti';

export const EmployeeDashboard: React.FC = () => {
  const {
    employees,
    isPunchedIn,
    togglePunch,
    workSeconds,
    leaveRequests,
    submitLeaveRequest,
    payrollRecords
  } = useHRMS();

  const { user } = useAuth();

  const fallbackEmp: any = {
    id: 'emp-1',
    employeeId: user?.employeeId || 'DF-1001',
    loginId: user?.loginId || 'OISAJE20220001',
    name: user?.name || 'Sarah Jenkins',
    email: user?.email || 'sarah.j@dayflow.io',
    phone: user?.phone || '+1 (555) 234-5678',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    workInfo: {
      department: 'Design',
      jobPosition: 'Lead Product Designer',
      manager: 'Marcus Vance',
      workLocation: 'San Francisco HQ',
      workAddress: '100 Montgomery St, San Francisco, CA',
      workSchedule: 'Standard 40 Hours (9 AM - 5 PM)',
      joinDate: '2022-03-15'
    },
    privateInfo: {
      address: '424 Market Street, Apt 5B, San Francisco, CA',
      privateEmail: 'sarah.jenkins.personal@gmail.com',
      bankName: 'Silicon Valley Bank',
      bankAccountNumber: '987654321098',
      bankIfscOrRouting: 'SVB120934'
    },
    hrSettings: {
      badgeId: 'BADGE-8841',
      pinCode: '1001',
      role: 'employee',
      salary: 600000,
      loginId: user?.loginId || 'OISAJE20220001'
    },
    leaveBalance: { casual: 12, casualUsed: 3, sick: 10, sickUsed: 1, annual: 18, annualUsed: 5, maternity: 60, maternityUsed: 0 },
    attendanceToday: 'Present'
  };

  const currentUser = (employees && employees.length > 0)
    ? (employees.find(e => e.employeeId === user?.employeeId || e.loginId === user?.loginId || e.email === user?.email) || employees[0])
    : fallbackEmp;

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Paid Time Off (Annual)' as any,
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);

  const [currentTime, setCurrentTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePunchClick = async () => {
    await togglePunch();
    if (!isPunchedIn) {
      triggerSuccessBurst();
    }
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) return;

    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);
    const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    await submitLeaveRequest({
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      reason: leaveForm.reason,
      totalDays: diffDays > 0 ? diffDays : 1
    });

    triggerCelebration();
    setIsLeaveModalOpen(false);
    setLeaveForm({
      leaveType: 'Paid Time Off (Annual)',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const myLeaves = leaveRequests.filter((l) => l.employeeId === currentUser.employeeId);
  const myPayslips = payrollRecords.filter((p) => p.employeeId === currentUser.employeeId);

  const targetShiftSeconds = 8 * 3600;
  const progressPercent = Math.min(Math.round((workSeconds / targetShiftSeconds) * 100), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Hero Welcome Card with Motion Blobs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-brand-700 via-indigo-700 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Animated Glowing Orbs */}
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -25, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-8 -top-8 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"
        />

        <div className="flex items-center gap-5 relative z-10">
          <motion.img
            whileHover={{ scale: 1.06 }}
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-semibold backdrop-blur-md">
                {currentUser.employeeId}
              </span>
              <span className="text-xs text-indigo-200">
                {currentUser.workInfo.department} Department
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Good day, {currentUser.name}!
            </h1>
            <p className="text-xs text-indigo-100 font-medium">
              {currentUser.workInfo.jobPosition} • {currentUser.workInfo.workLocation}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold rounded-xl shadow-md transition"
          >
            <CalendarOff className="w-4 h-4 text-brand-600" />
            Apply for Time Off
          </motion.button>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              to={`/employee/${currentUser.id}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 text-white hover:bg-white/30 text-xs font-bold rounded-xl backdrop-blur-md transition"
            >
              <UserCheck className="w-4 h-4" />
              Edit My Profile Tabs
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Live Attendance Punch-In Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Attendance Tracker
                </h2>
                <p className="text-xs text-slate-500">Live work session</p>
              </div>
              <Badge variant={isPunchedIn ? 'success' : 'neutral'} dot>
                {isPunchedIn ? 'Logged In' : 'Off Duty'}
              </Badge>
            </div>

            <div className="my-5 text-center space-y-2">
              {/* Live Wall Clock */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[11px] font-bold font-mono">
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{currentTime}</span>
              </div>

              {/* Work Session Timer */}
              <div className="text-4xl md:text-5xl font-mono font-black text-slate-900 dark:text-white tracking-wider">
                {formatTimer(workSeconds)}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {isPunchedIn ? '🟢 Active Working Session' : '⚪ Shift Not Started (9 AM - 5 PM)'}
              </p>

              <div className="mt-4 space-y-1.5 text-left">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>Shift Completion (8 Hours)</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePunchClick}
              className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl font-bold text-sm shadow-md transition-all duration-200 ${
                isPunchedIn
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-brand-600 hover:bg-brand-500 text-white'
              }`}
            >
              {isPunchedIn ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  Clock Out For The Day
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Clock In Now
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Right 2 Cols: Leave Balances & Upcoming Holidays */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leave Balances Cards */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  My Leave Balances (2026)
                </h2>
                <p className="text-xs text-slate-500">Available quota and used days</p>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                + Request Leave
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              <motion.div whileHover={{ y: -3, scale: 1.02 }} className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60">
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Annual PTO</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {currentUser.leaveBalance.annual - currentUser.leaveBalance.annualUsed}
                  <span className="text-xs font-semibold text-slate-400">/{currentUser.leaveBalance.annual}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{currentUser.leaveBalance.annualUsed} days utilized</div>
              </motion.div>

              <motion.div whileHover={{ y: -3, scale: 1.02 }} className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Sick Leave</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {currentUser.leaveBalance.sick - currentUser.leaveBalance.sickUsed}
                  <span className="text-xs font-semibold text-slate-400">/{currentUser.leaveBalance.sick}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{currentUser.leaveBalance.sickUsed} days utilized</div>
              </motion.div>

              <motion.div whileHover={{ y: -3, scale: 1.02 }} className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/60">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300">Casual Leave</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {currentUser.leaveBalance.casual - currentUser.leaveBalance.casualUsed}
                  <span className="text-xs font-semibold text-slate-400">/{currentUser.leaveBalance.casual}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{currentUser.leaveBalance.casualUsed} days utilized</div>
              </motion.div>

              <motion.div whileHover={{ y: -3, scale: 1.02 }} className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/60">
                <div className="text-xs font-bold text-purple-700 dark:text-purple-300">Parental</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {currentUser.leaveBalance.maternity - currentUser.leaveBalance.maternityUsed}
                  <span className="text-xs font-semibold text-slate-400">/{currentUser.leaveBalance.maternity}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Special entitlement</div>
              </motion.div>
            </div>
          </div>

          {/* Recent Leave Requests History */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                My Leave Requests
              </h2>
              <Link to="/time-off" className="text-xs font-bold text-brand-600 dark:text-brand-400">
                Open Team Calendar →
              </Link>
            </div>
            {myLeaves.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {myLeaves.map((l) => (
                  <motion.div
                    key={l.id}
                    whileHover={{ x: 3 }}
                    className="py-3 flex items-center justify-between transition-transform"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {l.leaveType} ({l.totalDays} {l.totalDays === 1 ? 'day' : 'days'})
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {l.startDate} to {l.endDate} • Applied on {l.appliedDate}
                      </div>
                    </div>
                    <Badge
                      variant={l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {l.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                No leave requests filed yet this quarter.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Payslips */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Payslips</h2>
              <p className="text-xs text-slate-500">Salary statements & breakdowns</p>
            </div>
            <Link to="/payroll" className="text-xs font-bold text-brand-600 dark:text-brand-400">
              Full Portal →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 mt-2">
            {myPayslips.map((pay) => (
              <motion.div
                key={pay.id}
                whileHover={{ x: 3 }}
                className="py-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-brand-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Salary Slip - {pay.payPeriod}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Disbursed: {pay.paymentDate} • Net: ${pay.netSalary.toLocaleString()}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPayslip(pay)}
                  className="px-3 py-1.5 text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 rounded-xl transition"
                >
                  View Slip
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Company Announcements & Holidays */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Upcoming Holidays & Events
          </h2>
          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 flex items-center justify-center font-bold text-xs">
                  SEP 07
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Labor Day Holiday</div>
                  <div className="text-[11px] text-slate-400">Company-wide paid day off</div>
                </div>
              </div>
              <Badge variant="info" size="sm">National</Badge>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  OCT 15
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Dayflow Q3 Townhall</div>
                  <div className="text-[11px] text-slate-400">All-hands quarterly reflection</div>
                </div>
              </div>
              <Badge variant="primary" size="sm">Townhall</Badge>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Apply for Time Off"
        subtitle="Submit a leave request for managerial approval"
      >
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Leave Category
            </label>
            <select
              value={leaveForm.leaveType}
              onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="Paid Time Off (Annual)">Paid Time Off (Annual)</option>
              <option value="Sick Time Off">Sick Time Off</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Parental Leave">Parental Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reason for Absence *
            </label>
            <textarea
              required
              rows={3}
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              placeholder="Brief explanation for team handover..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Payslip View Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          title={`Payslip - ${selectedPayslip.payPeriod}`}
          subtitle={`Dayflow Technologies Inc. • ${selectedPayslip.employeeId}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedPayslip.employeeName}</div>
                <div className="text-xs text-slate-500">{selectedPayslip.designation} • {selectedPayslip.department}</div>
              </div>
              <Badge variant="success" size="md">Payment Status: {selectedPayslip.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="space-y-2 border-r border-slate-100 dark:border-slate-700 pr-4">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-emerald-600">
                  Earnings
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500">Basic Salary</span>
                  <span className="font-semibold">${selectedPayslip.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500">House Rent (HRA)</span>
                  <span className="font-semibold">${selectedPayslip.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500">Special Allowances</span>
                  <span className="font-semibold">${selectedPayslip.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Performance Bonus</span>
                  <span className="font-semibold">${selectedPayslip.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold">
                  <span>Gross Earnings</span>
                  <span className="text-slate-900 dark:text-white">${selectedPayslip.grossSalary.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-rose-600">
                  Deductions & Taxes
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500">Income Tax (TDS)</span>
                  <span className="font-semibold">-${selectedPayslip.taxDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500">Provident Fund (PF)</span>
                  <span className="font-semibold">-${selectedPayslip.providentFund.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Other Deductions</span>
                  <span className="font-semibold">-${selectedPayslip.otherDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold">
                  <span>Total Deductions</span>
                  <span className="text-rose-600">
                    -${(selectedPayslip.taxDeduction + selectedPayslip.providentFund + selectedPayslip.otherDeductions).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">NET DISBURSED SALARY</span>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Directly transferred to bank on file</p>
              </div>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                ${selectedPayslip.netSalary.toLocaleString()}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-xl transition"
              >
                Print / Download PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

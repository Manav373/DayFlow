import React, { useState } from 'react';
import {
  Users,
  Clock,
  CalendarOff,
  DollarSign,
  UserPlus,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { departmentsSummary } from '../data/mockData';
import { Link, useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    employees,
    leaveRequests,
    updateLeaveStatus,
    activities,
    stats,
    addEmployee
  } = useHRMS();

  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    designation: '',
    status: 'Active' as const,
    joinDate: new Date().toISOString().split('T')[0],
    phone: '',
    location: 'San Francisco HQ',
    salary: 100000,
    manager: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  });

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpForm.name || !newEmpForm.email) return;
    const created = await addEmployee({
      name: newEmpForm.name,
      email: newEmpForm.email,
      phone: newEmpForm.phone,
      status: newEmpForm.status,
      workInfo: {
        department: newEmpForm.department,
        jobPosition: newEmpForm.role || newEmpForm.designation,
        manager: newEmpForm.manager,
        workLocation: newEmpForm.location,
        workAddress: '100 Montgomery St, San Francisco, CA',
        workSchedule: 'Standard 40 Hours',
        joinDate: newEmpForm.joinDate
      }
    });
    setIsAddEmployeeModalOpen(false);
    navigate(`/employee/${created.id}`);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Live Operations Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, Operations Command
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Here is your daily corporate pulse: {stats.presentToday} team members are logged in today, with {stats.pendingLeaves} pending approvals requiring attention.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <button
            onClick={() => setIsAddEmployeeModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
          <Link
            to="/payroll"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition"
          >
            <DollarSign className="w-4 h-4" />
            Run Payroll
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Workforce"
          value={stats.totalEmployees}
          change="+8.4%"
          trend="up"
          subtitle="Active corporate roster"
          icon={Users}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50 dark:bg-indigo-950/50"
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats.attendanceRate}%`}
          change={`${stats.presentToday} / ${stats.totalEmployees} present`}
          trend="up"
          subtitle="96% target"
          icon={Clock}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
          badgeText="Active"
        />
        <StatCard
          title="Leave Requests"
          value={stats.pendingLeaves}
          change={stats.pendingLeaves > 0 ? "Requires review" : "All cleared"}
          trend={stats.pendingLeaves > 0 ? "neutral" : "up"}
          subtitle="Pending approvals"
          icon={CalendarOff}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950/50"
        />
        <StatCard
          title="Payroll Batch"
          value="$595,000"
          change="August cycle ready"
          trend="up"
          subtitle="Disburses on 1st"
          icon={DollarSign}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950/50"
        />
      </div>

      {/* Main Grid: Pending Approvals & Live Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Leave Approvals Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Leave & Time-Off Approvals
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage requests submitted by employees
                </p>
              </div>
              <Link
                to="/time-off"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
              >
                Calendar & Table View <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingLeaves.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60 mt-2">
                {pendingLeaves.slice(0, 4).map((req) => (
                  <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.employeeAvatar}
                        alt={req.employeeName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {req.employeeName}
                          </span>
                          <span className="text-xs text-slate-400">({req.department})</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <Badge variant="warning" size="sm">{req.leaveType}</Badge>
                          <span>{req.startDate} to {req.endDate} ({req.totalDays} {req.totalDays === 1 ? 'day' : 'days'})</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-1 bg-slate-50 dark:bg-slate-700/40 px-2.5 py-1 rounded-lg">
                          "{req.reason}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => updateLeaveStatus(req.id, 'Approved')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => updateLeaveStatus(req.id, 'Rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No pending leave requests</p>
                <p className="text-xs text-slate-400 mt-0.5">All employee time-off requests have been reviewed.</p>
              </div>
            )}
          </div>

          {/* Department Headcount Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Department Overview
              </h2>
              <Link to="/directory" className="text-xs font-bold text-brand-600 dark:text-brand-400">
                Directory →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {departmentsSummary.map((dept) => (
                <div
                  key={dept.name}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/50 hover:border-brand-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{dept.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {dept.headcount}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Lead: <span className="text-slate-600 dark:text-slate-300 font-medium">{dept.lead}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-8">
          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Quick Shortcuts
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsAddEmployeeModalOpen(true)}
                className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 text-left hover:bg-indigo-100/70 transition group"
              >
                <UserPlus className="w-5 h-5 text-brand-600 dark:text-brand-400 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Add Staff</div>
                <div className="text-[10px] text-slate-500">Odoo profile</div>
              </button>

              <Link
                to="/attendance"
                className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 text-left hover:bg-emerald-100/70 transition group"
              >
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Timesheets</div>
                <div className="text-[10px] text-slate-500">Daily punch log</div>
              </Link>

              <Link
                to="/payroll"
                className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 text-left hover:bg-blue-100/70 transition group"
              >
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Payslips</div>
                <div className="text-[10px] text-slate-500">Disbursements</div>
              </Link>

              <Link
                to="/reports"
                className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800 text-left hover:bg-purple-100/70 transition group"
              >
                <FileSpreadsheet className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Analytics</div>
                <div className="text-[10px] text-slate-500">Monthly reports</div>
              </Link>
            </div>
          </div>

          {/* Activity Stream */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Real-time Activity
            </h2>
            <div className="space-y-4">
              {activities.slice(0, 6).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <img
                    src={act.avatar}
                    alt={act.user}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      <span className="font-bold text-slate-900 dark:text-white">{act.user}</span>{' '}
                      {act.action}{' '}
                      <span className="font-semibold text-brand-600 dark:text-brand-400">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        title="Onboard New Employee (Odoo Record)"
        subtitle="Fill in basic employment details to generate full profile"
        maxWidth="2xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
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
                placeholder="e.g. Jordan Miller"
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
                placeholder="jordan.m@dayflow.io"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Job Title / Role
              </label>
              <input
                type="text"
                required
                value={newEmpForm.role}
                onChange={(e) => setNewEmpForm({ ...newEmpForm, role: e.target.value })}
                placeholder="e.g. Fullstack Engineer"
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
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddEmployeeModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition"
            >
              Save and View Tabs →
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

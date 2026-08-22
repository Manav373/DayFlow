import React, { useState } from 'react';
import {
  CalendarOff,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  List
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { LeaveStatus, LeaveType } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { StatCard } from '../components/common/StatCard';
import { LeaveCalendar } from '../components/calendar/LeaveCalendar';

export const TimeOff: React.FC = () => {
  const {
    leaveRequests,
    submitLeaveRequest,
    updateLeaveStatus,
    stats
  } = useHRMS();

  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Paid Time Off (Annual)' as LeaveType,
    startDate: '',
    endDate: '',
    reason: ''
  });

  const filteredRequests = leaveRequests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'All' || req.leaveType === selectedType;
    const matchesStatus = selectedStatus === 'All' || req.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

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

    setIsApplyModalOpen(false);
    setLeaveForm({
      leaveType: 'Paid Time Off (Annual)',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" dot>Approved</Badge>;
      case 'Pending':
        return <Badge variant="warning" dot>Pending Review</Badge>;
      case 'Rejected':
        return <Badge variant="danger" dot>Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const handleCalendarSelectDate = (dateStr: string) => {
    setLeaveForm((prev) => ({
      ...prev,
      startDate: dateStr,
      endDate: dateStr
    }));
    setIsApplyModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Time Off & Leave Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Odoo-style team calendar view & leave approval requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-xs">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                viewMode === 'calendar'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Requests Table
            </button>
          </div>

          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            Apply for Time Off
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Pending Requests"
          value={stats.pendingLeaves}
          change={stats.pendingLeaves > 0 ? 'Review queue active' : 'All cleared'}
          trend={stats.pendingLeaves > 0 ? 'neutral' : 'up'}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950/50"
        />
        <StatCard
          title="Approved Leaves"
          value={leaveRequests.filter(l => l.status === 'Approved').length}
          change="This calendar month"
          trend="up"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
        />
        <StatCard
          title="Currently On Leave"
          value={stats.onLeaveToday}
          subtitle="Team members absent"
          icon={CalendarOff}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950/50"
        />
        <StatCard
          title="Rejected Requests"
          value={leaveRequests.filter(l => l.status === 'Rejected').length}
          subtitle="Policy mismatches"
          icon={XCircle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50 dark:bg-rose-950/50"
        />
      </div>

      {/* View Switcher Output */}
      {viewMode === 'calendar' ? (
        <LeaveCalendar
          leaveRequests={leaveRequests}
          onSelectDate={handleCalendarSelectDate}
        />
      ) : (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by employee, department, or reason..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="All">All Leave Types</option>
                <option value="Paid Time Off (Annual)">Paid Time Off (Annual)</option>
                <option value="Sick Time Off">Sick Time Off</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Parental Leave">Parental Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Leave Category</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={req.employeeAvatar} alt={req.employeeName} className="w-9 h-9 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{req.employeeName}</div>
                            <div className="text-[11px] text-slate-400">{req.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                        <Badge variant="primary" size="sm">{req.leaveType}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{req.startDate} to {req.endDate}</div>
                        <div className="text-[11px] text-slate-400">{req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                        "{req.reason}"
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => updateLeaveStatus(req.id, 'Approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateLeaveStatus(req.id, 'Rejected')}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Reviewed {req.reviewDate ? `on ${req.reviewDate}` : ''}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit Time Off Request"
        subtitle="Request approval for scheduled leave or vacation"
      >
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Time Off Category
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
                From Date *
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
                To Date *
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
              Description / Handover Notes *
            </label>
            <textarea
              required
              rows={3}
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              placeholder="State reason for leave and key contact in absence..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition"
            >
              Confirm Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

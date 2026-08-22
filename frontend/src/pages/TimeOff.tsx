import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarOff,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Calendar as CalendarIcon,
  List,
  Info,
  Check,
  X,
  Upload,
  Sparkles,
  FileText,
  Clock,
  ChevronDown,
  Paperclip,
  Trash2
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { useAuth } from '../context/AuthContext';
import { LeaveStatus, LeaveType } from '../types';
import { Badge } from '../components/common/Badge';
import { YearCalendar } from '../components/calendar/YearCalendar';
import { triggerSuccessBurst } from '../utils/confetti';

export const TimeOff: React.FC = () => {
  const {
    leaveRequests,
    submitLeaveRequest,
    updateLeaveStatus,
    employees
  } = useHRMS();

  const { user } = useAuth();
  const isManager = user?.role === 'admin' || user?.role === 'hr_officer';
  const currentEmp = employees.find(e => e.employeeId === user?.employeeId) || employees[0];

  const [activeSecondaryTab, setActiveSecondaryTab] = useState<'timeOff' | 'allocation'>('timeOff');
  const [searchQuery, setSearchQuery] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Exact Wireframe Form State for "Time off Type Request"
  const [requestForm, setRequestForm] = useState({
    timeOffType: 'Paid Time off' as 'Paid Time off' | 'Sick Leave' | 'Unpaid Leaves' | 'Casual Leave',
    startDate: '2026-10-09',
    endDate: '2026-10-09',
    reason: '',
    attachmentName: '',
    attachmentSize: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = (file.size / 1024).toFixed(1) + ' KB';
      setRequestForm({
        ...requestForm,
        attachmentName: file.name,
        attachmentSize: sizeStr
      });
    }
  };

  const removeAttachment = () => {
    setRequestForm({ ...requestForm, attachmentName: '', attachmentSize: '' });
  };

  // Calculate working days duration
  const start = new Date(requestForm.startDate);
  const end = new Date(requestForm.endDate);
  const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const calculatedDays = diffDays > 0 ? diffDays : 1;

  // Quota mapping
  const currentQuota = requestForm.timeOffType === 'Paid Time off' ? 24 : requestForm.timeOffType === 'Sick Leave' ? 7 : 0;
  const balanceAfter = Math.max(0, currentQuota - calculatedDays);

  // Strict RBAC: Employees view only their own records; Admins/HR view all
  const requestsToDisplay = isManager
    ? leaveRequests
    : leaveRequests.filter((r) => r.employeeId === user?.employeeId || r.employeeName === user?.name);

  const filteredRequests = requestsToDisplay.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let mappedType: LeaveType = 'Paid Time Off (Annual)';
    if (requestForm.timeOffType === 'Sick Leave') mappedType = 'Sick Time Off';
    if (requestForm.timeOffType === 'Unpaid Leaves') mappedType = 'Unpaid Leave';
    if (requestForm.timeOffType === 'Casual Leave') mappedType = 'Casual Leave';

    await submitLeaveRequest({
      leaveType: mappedType,
      startDate: requestForm.startDate,
      endDate: requestForm.endDate,
      reason: requestForm.reason || `${requestForm.timeOffType} application${requestForm.attachmentName ? ` (Attached: ${requestForm.attachmentName})` : ''}`,
      totalDays: calculatedDays
    });

    triggerSuccessBurst();
    setIsApplyModalOpen(false);
    setRequestForm({
      timeOffType: 'Paid Time off',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: '',
      attachmentName: '',
      attachmentSize: ''
    });
  };

  const handleApprove = async (id: string) => {
    await updateLeaveStatus(id, 'Approved');
    triggerSuccessBurst();
  };

  const handleReject = async (id: string) => {
    await updateLeaveStatus(id, 'Rejected');
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" dot>Approved</Badge>;
      case 'Pending':
        return <Badge variant="warning" dot>Pending</Badge>;
      case 'Rejected':
        return <Badge variant="danger" dot>Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Title & Secondary Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Time Off
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isManager
              ? 'Review workforce leave requests, approvals, and allocation quotas'
              : 'Submit vacation requests and view your annual entitlement calendar'}
          </p>
        </div>
      </div>

      {/* Sub-tab (from Wireframe) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSecondaryTab('timeOff')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeSecondaryTab === 'timeOff'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          Time Off
        </button>

        {isManager && (
          <button
            onClick={() => setActiveSecondaryTab('allocation')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeSecondaryTab === 'allocation'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            Allocation
          </button>
        )}
      </div>

      {/* Top Action Bar matching Wireframe: [NEW (Purple Button)] on Left, [Searchbar] on Right */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider rounded-xl shadow-md shadow-purple-600/20 transition uppercase"
        >
          <Plus className="w-4 h-4" />
          NEW
        </motion.button>

        {isManager && (
          <div className="relative flex-1 max-w-md ml-auto">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Searchbar..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        )}
      </div>

      {/* Leave Quota Overview Banners (Wireframe Display: Paid time Off 24 Days | Sick time off 07 Days) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Paid time Off
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              24 <span className="text-xs font-semibold text-slate-500">Days Available</span>
            </div>
          </div>
          <CalendarOff className="w-7 h-7 text-blue-500/40" />
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Sick time off
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              07 <span className="text-xs font-semibold text-slate-500">Days Available</span>
            </div>
          </div>
          <CheckCircle2 className="w-7 h-7 text-emerald-500/40" />
        </div>
      </div>

      {/* Main Content Area */}
      {isManager ? (
        activeSecondaryTab === 'timeOff' ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Start Date</th>
                    <th className="px-6 py-4">End Date</th>
                    <th className="px-6 py-4">Time off Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Reject & Approve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={req.employeeAvatar} alt={req.employeeName} className="w-8 h-8 rounded-full object-cover shadow-xs" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{req.employeeName}</div>
                            <div className="text-[10px] text-slate-400">{req.department}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {req.startDate}
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {req.endDate}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-1 rounded-lg border border-purple-200 dark:border-purple-800 text-xs">
                          {req.leaveType}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {getStatusBadge(req.status)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReject(req.id)}
                              className="w-8 h-8 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-xs transition"
                              title="Reject Time Off"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleApprove(req.id)}
                              className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs transition"
                              title="Approve Time Off"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-semibold">
                            Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Annual Entitlement Allocations (2026)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500">Annual Paid Time Off</span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">24 Days</div>
                <span className="text-[10px] text-emerald-600 font-semibold">Accrues 2.0 days / month</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500">Medical / Sick Quota</span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">07 Days</div>
                <span className="text-[10px] text-purple-600 font-semibold">Standard full pay quota</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500">Casual Personal Leave</span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">12 Days</div>
                <span className="text-[10px] text-blue-600 font-semibold">Available for personal needs</span>
              </div>
            </div>
          </div>
        )
      ) : (
        <YearCalendar
          year={2026}
          leaveRequests={requestsToDisplay}
          onSelectDate={(dateStr) => {
            setRequestForm((prev) => ({
              ...prev,
              startDate: dateStr,
              endDate: dateStr
            }));
            setIsApplyModalOpen(true);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* HIGH-END "Time off Type Request" Modal (Exact Wireframe Match & Polished UI) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 md:p-7 space-y-5 text-slate-900 dark:text-white z-10 font-sans"
            >
              {/* Header with Title and Close 'X' */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Time off Type Request
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Request approval for scheduled leave or medical absence
                  </p>
                </div>

                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                {/* 1. Employee Row */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Employee
                  </span>
                  <div className="flex items-center gap-2">
                    <img
                      src={user?.avatar || currentEmp.avatar}
                      alt={user?.name || currentEmp.name}
                      className="w-6 h-6 rounded-full object-cover shadow-xs"
                    />
                    <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                      [{user?.name || currentEmp.name}]
                    </span>
                  </div>
                </div>

                {/* 2. Time off Type Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Time off Type
                  </label>
                  <div className="relative">
                    <select
                      value={requestForm.timeOffType}
                      onChange={(e) => setRequestForm({ ...requestForm, timeOffType: e.target.value as any })}
                      className="w-full appearance-none px-4 py-3 text-xs font-bold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-purple-700 dark:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 cursor-pointer transition pr-10"
                    >
                      <option value="Paid Time off">[Paid time off]</option>
                      <option value="Sick Leave">[Sick Leave]</option>
                      <option value="Unpaid Leaves">[Unpaid Leaves]</option>
                      <option value="Casual Leave">[Casual Leave]</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-purple-600 dark:text-purple-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Validity Period: [Start Date] To [End Date] */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Validity Period
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={requestForm.startDate}
                        onChange={(e) => setRequestForm({ ...requestForm, startDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs font-medium rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">To</span>
                      <input
                        type="date"
                        required
                        value={requestForm.endDate}
                        onChange={(e) => setRequestForm({ ...requestForm, endDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs font-medium rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Allocation Row */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    Allocation
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-black font-mono text-purple-700 dark:text-purple-300">
                      {calculatedDays.toString().padStart(2, '0')}.00 Days
                    </span>
                    {currentQuota > 0 && (
                      <span className="text-[10px] text-slate-400 block -mt-0.5">
                        (Remaining after: {balanceAfter} Days)
                      </span>
                    )}
                  </div>
                </div>

                {/* 5. Attachment Row (For sick leave certificate) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Attachment <span className="text-[11px] font-normal text-slate-400">(For sick leave certificate)</span>
                    </label>
                  </div>

                  {!requestForm.attachmentName ? (
                    <label
                      htmlFor="leave-file-input"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/40 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 font-bold text-xs cursor-pointer hover:bg-purple-100/60 dark:hover:bg-purple-900/40 transition group w-fit"
                    >
                      <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                      <span>Upload Document</span>
                      <input
                        id="leave-file-input"
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                        <span className="font-bold text-purple-900 dark:text-purple-200 truncate">
                          {requestForm.attachmentName}
                        </span>
                        <span className="text-[10px] text-slate-400">({requestForm.attachmentSize})</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeAttachment}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Buttons: [Discard] and [Submit] */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                  >
                    Discard
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl shadow-md shadow-purple-600/25 transition"
                  >
                    Submit
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

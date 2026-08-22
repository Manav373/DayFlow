import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  KeyRound,
  Download,
  CheckCircle2,
  AlertCircle,
  Plane,
  User
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { useAuth } from '../context/AuthContext';
import { KioskModal } from '../components/kiosk/KioskModal';
import { Badge } from '../components/common/Badge';

export const Attendance: React.FC = () => {
  const { attendanceRecords, employees, leaveRequests, isPunchedIn, workSeconds } = useHRMS();
  const { user } = useAuth();

  const isManager = user?.role === 'admin' || user?.role === 'hr_officer';

  // Date and filter states initialized to current local date
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const currentMonthStr = useMemo(() => new Date().toISOString().substring(0, 7), []);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [searchQuery, setSearchQuery] = useState('');
  const [showKiosk, setShowKiosk] = useState(false);

  // Format date display
  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handlePrevDay = () => {
    const parts = selectedDate.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const parts = selectedDate.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Resolve current active logged in employee profile
  const currentEmp = useMemo(() => {
    return employees.find(
      (e) => e.employeeId === user?.employeeId || e.loginId === user?.loginId || e.email === user?.email
    ) || employees[0];
  }, [employees, user]);

  // Format seconds to hh:mm
  const formatTimerHm = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
  };

  // =========================================================================
  // EMPLOYEE VIEW: Real-time logs for current employee in selected month
  // =========================================================================
  const employeeMonthRecords = useMemo(() => {
    const empId = currentEmp?.employeeId || user?.employeeId || 'DF-1001';

    // 1. Get database attendance records for this employee
    const dbRecords = attendanceRecords
      .filter((r) => r.employeeId === empId && r.date.startsWith(selectedMonth))
      .map((r) => ({
        id: r.id,
        date: r.date,
        checkIn: r.checkIn || '--',
        checkOut: r.checkOut || '--',
        workHours: r.workHours || (r.checkOut && r.checkOut !== '--' ? '8h 00m' : 'In Progress'),
        extraHours: r.overtime || '0h 0m',
        status: r.status || 'Present'
      }));

    // 2. If viewing current month and employee is currently punched in today, ensure today's live session is included at top
    if (selectedMonth === currentMonthStr && isPunchedIn) {
      const existsToday = dbRecords.find((r) => r.date === todayStr);
      if (!existsToday) {
        dbRecords.unshift({
          id: `live-${todayStr}`,
          date: todayStr,
          checkIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          checkOut: '--',
          workHours: formatTimerHm(workSeconds),
          extraHours: '0h 0m',
          status: 'Present'
        });
      } else if (existsToday.checkOut === '--' || !existsToday.checkOut) {
        existsToday.workHours = formatTimerHm(workSeconds);
      }
    }

    // Sort descending by date
    return dbRecords.sort((a, b) => b.date.localeCompare(a.date));
  }, [attendanceRecords, currentEmp, user, selectedMonth, currentMonthStr, isPunchedIn, todayStr, workSeconds]);

  // Employee Monthly Stats
  const daysPresentCount = employeeMonthRecords.filter((r) => r.status === 'Present' || r.status === 'Late').length;
  const leavesCount = leaveRequests.filter(
    (l) => (l.employeeId === currentEmp?.employeeId || l.employeeName === user?.name) && l.status === 'Approved'
  ).length;
  const totalWorkingDays = 22;

  // =========================================================================
  // ADMIN VIEW: Workforce attendance logs for selected date
  // =========================================================================
  const adminDayRecords = useMemo(() => {
    return employees
      .map((emp) => {
        const att = attendanceRecords.find((a) => a.employeeId === emp.employeeId && a.date === selectedDate);
        const onLeave = leaveRequests.find(
          (l) => l.employeeId === emp.employeeId && l.status === 'Approved' && l.startDate <= selectedDate && l.endDate >= selectedDate
        );

        let status: 'Present' | 'On Leave' | 'Not Checked In' = 'Not Checked In';
        let checkIn = '--';
        let checkOut = '--';
        let workHours = '--';
        let extraHours = '0h 0m';

        if (onLeave) {
          status = 'On Leave';
        } else if (att) {
          status = 'Present';
          checkIn = att.checkIn || '--';
          checkOut = att.checkOut || '--';
          workHours = att.workHours || (att.checkOut && att.checkOut !== '--' ? '8h 00m' : 'In Progress');
          extraHours = att.overtime || '0h 0m';
        } else if (selectedDate === todayStr && emp.attendanceToday === 'Present') {
          status = 'Present';
          checkIn = '09:00 AM';
          checkOut = '--';
          workHours = 'In Progress';
        }

        return {
          id: emp.id,
          employeeId: emp.employeeId,
          name: emp.name,
          avatar: emp.avatar,
          loginId: emp.loginId,
          department: emp.workInfo.department,
          checkIn,
          checkOut,
          workHours,
          extraHours,
          status
        };
      })
      .filter((r) => {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          (r.loginId && r.loginId.toLowerCase().includes(q)) ||
          r.employeeId.toLowerCase().includes(q)
        );
      });
  }, [employees, attendanceRecords, leaveRequests, selectedDate, todayStr, searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Attendance Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isManager
              ? 'Real-time workforce daily attendance and timesheet logs'
              : 'Day-wise attendance and working hours log for the ongoing month'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKiosk(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold rounded-xl hover:bg-purple-100 transition shadow-xs"
          >
            <KeyRound className="w-4 h-4" />
            Office Kiosk Punch
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: FOR ADMIN / HR OFFICER */}
      {/* ========================================================================= */}
      {isManager ? (
        <div className="space-y-4">
          {/* Top Control Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left Nav Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={handlePrevDay}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextDay}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
                  title="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Date Selector */}
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Day View Badge */}
              <span className="px-3 py-2 text-xs font-bold rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Day View
              </span>
            </div>

            {/* Right: Search Bar */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employee, Login ID, department..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* Date Banner */}
          <div className="text-center font-bold text-xs text-slate-600 dark:text-slate-300 bg-purple-50/60 dark:bg-purple-950/30 py-2.5 rounded-xl border border-purple-100 dark:border-purple-900/50 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>{formatDateDisplay(selectedDate)}</span>
          </div>

          {/* Admin Attendances Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Work hours</th>
                    <th className="px-6 py-4">Extra hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adminDayRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        No employees found matching the filter.
                      </td>
                    </tr>
                  ) : (
                    adminDayRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={rec.avatar} alt={rec.name} className="w-9 h-9 rounded-full object-cover shadow-xs ring-2 ring-slate-100 dark:ring-slate-700" />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{rec.name}</div>
                              <div className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-semibold">
                                {rec.loginId || rec.employeeId} • {rec.department}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {rec.status === 'Present' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Present
                            </span>
                          ) : rec.status === 'On Leave' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-[11px] font-bold">
                              <Plane className="w-3 h-3 text-blue-500" />
                              On Leave
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Not Checked In
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {rec.checkIn}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                          {rec.checkOut}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-purple-700 dark:text-purple-300">
                          {rec.workHours}
                        </td>
                        <td className="px-6 py-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {rec.extraHours}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: FOR EMPLOYEES */
        /* ========================================================================= */
        <div className="space-y-4">
          {/* Top Control Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left Nav Controls */}
            <div className="flex items-center gap-2">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Right: Summary Stat Metric Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Days Present</span>
                <span className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-300">{daysPresentCount}</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-center">
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">Approved Leaves</span>
                <span className="text-sm font-black font-mono text-blue-700 dark:text-blue-300">{leavesCount}</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-center">
                <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 block">Working Days</span>
                <span className="text-sm font-black font-mono text-purple-700 dark:text-purple-300">{totalWorkingDays}</span>
              </div>
            </div>
          </div>

          {/* Employee Timesheet Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Work hours</th>
                    <th className="px-6 py-4">Extra hours</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {employeeMonthRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        No punch records found for {selectedMonth}. Click "Clock In Now" on your dashboard to log attendance.
                      </td>
                    </tr>
                  ) : (
                    employeeMonthRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                          {formatDateDisplay(rec.date)}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {rec.checkIn}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                          {rec.checkOut}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-purple-700 dark:text-purple-300">
                          {rec.workHours}
                        </td>
                        <td className="px-6 py-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {rec.extraHours}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Kiosk Punch Modal */}
      <KioskModal isOpen={showKiosk} onClose={() => setShowKiosk(false)} />
    </div>
  );
};

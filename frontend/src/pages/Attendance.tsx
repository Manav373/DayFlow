import React, { useState } from 'react';
import {
  Clock,
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
  UserX,
  KeyRound
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { AttendanceStatus } from '../types';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { KioskModal } from '../components/kiosk/KioskModal';

export const Attendance: React.FC = () => {
  const { attendanceRecords, stats } = useHRMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showKiosk, setShowKiosk] = useState(false);

  const filteredRecords = attendanceRecords.filter((rec) => {
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || rec.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return <Badge variant="success" dot>Present</Badge>;
      case 'Late':
        return <Badge variant="warning" dot>Late Arrival</Badge>;
      case 'Half Day':
        return <Badge variant="info" dot>Half Day</Badge>;
      case 'On Leave':
        return <Badge variant="info" dot>On Leave</Badge>;
      case 'Absent':
        return <Badge variant="danger" dot>Absent</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const handleExportCSV = () => {
    const headers = ['Employee ID,Name,Department,Date,Check In,Check Out,Work Hours,Overtime,Status\n'];
    const rows = filteredRecords.map(r => 
      `${r.employeeId},"${r.employeeName}","${r.department}",${r.date},${r.checkIn},${r.checkOut},"${r.workHours}","${r.overtime}",${r.status}\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Dayflow_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Attendance & Timesheets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor daily check-ins, biometric kiosk logs, and workforce punctuality
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKiosk(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-brand-700 dark:bg-indigo-950/50 dark:text-brand-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold rounded-xl hover:bg-indigo-100 transition"
          >
            <KeyRound className="w-4 h-4" />
            Open Office Kiosk
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          change={`${stats.attendanceRate}% on time`}
          trend="up"
          subtitle="9:00 AM standard threshold"
          icon={CheckCircle}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
        />
        <StatCard
          title="Late Arrivals"
          value={attendanceRecords.filter(r => r.status === 'Late').length}
          change="Logged after 9:15 AM"
          trend="neutral"
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950/50"
        />
        <StatCard
          title="On Scheduled Leave"
          value={stats.onLeaveToday}
          change="Approved leaves"
          trend="neutral"
          icon={Clock}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950/50"
        />
        <StatCard
          title="Unplanned Absent"
          value={0}
          change="0.0% attrition today"
          trend="up"
          subtitle="All accounted for"
          icon={UserX}
          iconColor="text-rose-600"
          iconBg="bg-rose-50 dark:bg-rose-950/50"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by employee name, ID, or department..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="All">All Attendance Types</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="On Leave">On Leave</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      </div>

      {/* Timesheet Records Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Hours Logged</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={record.employeeAvatar} alt={record.employeeName} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{record.employeeName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{record.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    {record.department}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{record.date}</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {record.checkIn}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                    {record.checkOut}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                    {record.workHours}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(record.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <KioskModal isOpen={showKiosk} onClose={() => setShowKiosk(false)} />
    </div>
  );
};

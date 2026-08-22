import React from 'react';
import { motion } from 'framer-motion';
import { LeaveRequest } from '../../types';

interface YearCalendarProps {
  year?: number;
  leaveRequests: LeaveRequest[];
  onSelectDate: (dateStr: string) => void;
}

export const YearCalendar: React.FC<YearCalendarProps> = ({
  year = 2026,
  leaveRequests,
  onSelectDate
}) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const publicHolidays: Record<string, string> = {
    '2026-01-14': 'Kite Festival',
    '2026-01-26': 'Republic Day',
    '2026-03-04': 'Dhuleti',
    '2026-08-15': 'Independence Day',
    '2026-08-28': 'Rakhi',
    '2026-10-02': 'Gandhi Jayanti',
    '2026-11-08': 'Diwali',
    '2026-11-10': 'New Year',
    '2026-11-11': 'Bhai Duj'
  };

  const getDayStatus = (dateStr: string) => {
    if (publicHolidays[dateStr]) {
      return { type: 'holiday', name: publicHolidays[dateStr] };
    }

    const leave = leaveRequests.find(
      (l) => dateStr >= l.startDate && dateStr <= l.endDate
    );

    if (leave) {
      if (leave.status === 'Approved') return { type: 'validated', leave };
      if (leave.status === 'Pending') return { type: 'to_approve', leave };
      if (leave.status === 'Rejected') return { type: 'refused', leave };
    }

    return null;
  };

  const renderMonth = (monthIdx: number) => {
    const firstDayIndex = new Date(year, monthIdx, 1).getDay();
    const totalDaysInMonth = new Date(year, monthIdx + 1, 0).getDate();

    const days = [];

    // Empty spaces before first day
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${monthIdx}-${i}`} className="h-6 w-6" />);
    }

    // Days in month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const monthFormatted = (monthIdx + 1).toString().padStart(2, '0');
      const dayFormatted = d.toString().padStart(2, '0');
      const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;

      const status = getDayStatus(dateStr);

      let badgeClass = 'text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/40';
      if (status?.type === 'validated') {
        badgeClass = 'bg-purple-600 text-white font-bold shadow-xs';
      } else if (status?.type === 'to_approve') {
        badgeClass = 'bg-amber-400 text-amber-950 font-bold';
      } else if (status?.type === 'refused') {
        badgeClass = 'bg-rose-500 text-white font-bold line-through';
      } else if (status?.type === 'holiday') {
        badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-bold';
      }

      days.push(
        <button
          key={dateStr}
          onClick={() => onSelectDate(dateStr)}
          className={`h-6 w-6 rounded-md text-[10px] flex items-center justify-center transition-all ${badgeClass}`}
          title={status ? (status.name || `${status.leave?.leaveType} (${status.leave?.status})`) : dateStr}
        >
          {d}
        </button>
      );
    }

    return (
      <div key={monthIdx} className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="text-xs font-black text-slate-900 dark:text-white mb-2 flex items-center justify-between">
          <span>{monthNames[monthIdx]} {year}</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-slate-400 mb-1">
          {daysOfWeek.map((d, idx) => (
            <span key={idx}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 place-items-center">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* 12 Months Grid (9 cols) */}
      <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, idx) => renderMonth(idx))}
      </div>

      {/* Right Side: Legend & Public Holidays List (3 cols) */}
      <div className="lg:col-span-3 space-y-4">
        {/* Legend */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b pb-1.5">
            Legend
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-purple-600" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Validated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-400" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">To Approve</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-rose-500" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Refused</span>
            </div>
          </div>
        </div>

        {/* Public Holidays */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b pb-1.5">
            Public Holidays ({year})
          </h4>
          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            {Object.entries(publicHolidays).map(([d, name]) => (
              <div key={d} className="pt-1.5 first:pt-0 flex justify-between items-start gap-2">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">{name}</span>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">
                  {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

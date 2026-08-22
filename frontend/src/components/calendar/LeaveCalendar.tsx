import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { LeaveRequest } from '../../types';
import { Badge } from '../common/Badge';

interface LeaveCalendarProps {
  leaveRequests: LeaveRequest[];
  onSelectDate: (dateStr: string) => void;
}

export const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  leaveRequests,
  onSelectDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const holidays: Record<string, string> = {
    '2026-08-15': 'Independence Day',
    '2026-09-07': 'Labor Day'
  };

  const getLeavesForDate = (dateString: string) => {
    return leaveRequests.filter((l) => {
      return dateString >= l.startDate && dateString <= l.endDate;
    });
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for preceding month days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[100px] bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 p-2 opacity-30" />
      );
    }

    // Days in current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const monthFormatted = (month + 1).toString().padStart(2, '0');
      const dayFormatted = d.toString().padStart(2, '0');
      const dateString = `${year}-${monthFormatted}-${dayFormatted}`;

      const dayLeaves = getLeavesForDate(dateString);
      const isHoliday = holidays[dateString];
      const isToday = dateString === '2026-08-22';

      days.push(
        <div
          key={dateString}
          onClick={() => onSelectDate(dateString)}
          className={`min-h-[100px] border border-slate-100 dark:border-slate-800 p-2 transition hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer flex flex-col justify-between ${
            isToday ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : 'bg-white dark:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                isToday
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {d}
            </span>

            {isHoliday && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold truncate max-w-[80px]">
                {isHoliday}
              </span>
            )}
          </div>

          <div className="space-y-1 mt-1">
            {dayLeaves.map((l) => (
              <div
                key={l.id}
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold truncate flex items-center gap-1 ${
                  l.leaveType.includes('Annual') || l.leaveType.includes('Paid')
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    : l.leaveType.includes('Sick')
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
                title={`${l.employeeName} (${l.leaveType}) - ${l.status}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                <span>{l.employeeName.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-soft overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">Workforce leave allocations & schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(2026, 7, 1))}
              className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 text-center bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold text-[11px] py-2.5">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-700/50">
        {renderCalendarDays()}
      </div>

      {/* Legend Footer */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700/80 flex flex-wrap items-center gap-4 text-xs">
        <span className="font-bold text-slate-400 text-[11px] uppercase">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-slate-600 dark:text-slate-300">Paid Time Off / Annual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-600 dark:text-slate-300">Sick Time Off</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-600 dark:text-slate-300">Casual Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-600 dark:text-slate-300">Public Holiday</span>
        </div>
      </div>
    </div>
  );
};

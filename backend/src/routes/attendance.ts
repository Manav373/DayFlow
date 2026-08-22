import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { AttendanceRecord } from '../types/index.js';

export const attendanceRouter = Router();

// Get attendance records
attendanceRouter.get('/', (req: Request, res: Response): void => {
  const { date, status, employeeId } = req.query;
  let result = [...db.attendance];

  if (date) {
    result = result.filter((a) => a.date === date);
  }
  if (status && status !== 'All') {
    result = result.filter((a) => a.status === status);
  }
  if (employeeId) {
    result = result.filter((a) => a.employeeId === employeeId);
  }

  res.json(result);
});

// Quick Punch (Clock In / Clock Out) - Supports Kiosk PIN / Badge or Employee ID
attendanceRouter.post('/punch', (req: Request, res: Response): void => {
  const { employeeId, badgeId, pinCode } = req.body;

  let emp = db.employees.find((e) => {
    if (employeeId && e.employeeId === employeeId) return true;
    if (badgeId && e.hrSettings.badgeId === badgeId) return true;
    if (pinCode && e.hrSettings.pinCode === pinCode) return true;
    return false;
  });

  if (!emp) {
    res.status(404).json({ error: 'Employee not found with provided credentials' });
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const existingRecord = db.attendance.find((a) => a.employeeId === emp.employeeId && a.date === todayStr);

  if (existingRecord) {
    // Punch Out
    existingRecord.checkOut = timeStr;
    existingRecord.workHours = '8h 00m (Completed)';
    emp.attendanceToday = 'Present';

    res.json({
      action: 'check_out',
      time: timeStr,
      employee: emp,
      record: existingRecord
    });
  } else {
    // Punch In
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: emp.employeeId,
      employeeName: emp.name,
      employeeAvatar: emp.avatar,
      department: emp.workInfo.department,
      date: todayStr,
      checkIn: timeStr,
      checkOut: '--:--',
      workHours: '0h 01m (Active)',
      overtime: '0h 00m',
      status: 'Present'
    };

    db.attendance.unshift(newRecord);
    emp.attendanceToday = 'Present';

    res.json({
      action: 'check_in',
      time: timeStr,
      employee: emp,
      record: newRecord
    });
  }
});

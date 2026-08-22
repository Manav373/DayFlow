import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { AttendanceRecord } from '../types/index.js';

export const attendanceRouter = Router();

// GET /api/attendance
attendanceRouter.get('/', (req: Request, res: Response): void => {
  const { employeeId, date } = req.query;

  try {
    let query = 'SELECT * FROM attendance';
    const params: any[] = [];

    if (employeeId && date) {
      query += ' WHERE employeeId = ? AND date = ?';
      params.push(employeeId, date);
    } else if (employeeId) {
      query += ' WHERE employeeId = ?';
      params.push(employeeId);
    } else if (date) {
      query += ' WHERE date = ?';
      params.push(date);
    }

    query += ' ORDER BY date DESC, checkIn DESC';
    const records = db.prepare(query).all(...params);
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: 'Database read error: ' + err.message });
  }
});

// POST /api/attendance/punch (Biometric / Systray Check In / Check Out)
attendanceRouter.post('/punch', (req: Request, res: Response): void => {
  const { employeeId, badgeOrPin, name, department, avatar } = req.body;

  try {
    let empId = employeeId;
    let empName = name || 'Employee';
    let empDept = department || 'General';
    let empAvatar = avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    // If punch by badge or PIN code
    if (badgeOrPin) {
      const allEmps = db.prepare('SELECT * FROM employees').all() as any[];
      const matched = allEmps.find((e) => {
        const hr = JSON.parse(e.hrSettings || '{}');
        return hr.badgeId === badgeOrPin || hr.pinCode === badgeOrPin || e.employeeId === badgeOrPin || e.loginId === badgeOrPin;
      });

      if (!matched) {
        res.status(404).json({ error: 'Invalid Badge ID, PIN Code, or Login ID.' });
        return;
      }

      empId = matched.employeeId;
      empName = matched.name;
      empDept = JSON.parse(matched.workInfo || '{}').department || 'General';
      empAvatar = matched.avatar;
    }

    if (!empId) {
      res.status(400).json({ error: 'Employee identifier is required for punch log.' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    // Check if employee has an open checkIn for today
    const openRecord = db.prepare(`
      SELECT * FROM attendance
      WHERE employeeId = ? AND date = ? AND (checkOut = '--' OR checkOut IS NULL OR checkOut = '')
    `).get(empId, today) as AttendanceRecord | undefined;

    if (!openRecord) {
      // Punch In (Create new active session)
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: empId,
        employeeName: empName,
        employeeAvatar: empAvatar,
        department: empDept,
        date: today,
        checkIn: nowTime,
        checkOut: '--',
        workHours: '0h 0m',
        overtime: '0m',
        status: 'Present'
      };

      db.prepare(`
        INSERT INTO attendance (id, employeeId, employeeName, employeeAvatar, department, date, checkIn, checkOut, workHours, overtime, status)
        VALUES (@id, @employeeId, @employeeName, @employeeAvatar, @department, @date, @checkIn, @checkOut, @workHours, @overtime, @status)
      `).run(newRecord);

      db.prepare('UPDATE employees SET attendanceToday = ? WHERE employeeId = ?').run('Present', empId);

      res.status(201).json({
        action: 'check_in',
        message: `Welcome, ${empName}! Punched IN at ${nowTime}`,
        record: newRecord
      });
    } else {
      // Punch Out (Close active session)
      const checkOutTime = nowTime;
      const hoursLogged = '8h 00m';

      db.prepare(`
        UPDATE attendance SET
          checkOut = ?,
          workHours = ?
        WHERE id = ?
      `).run(checkOutTime, hoursLogged, openRecord.id);

      db.prepare('UPDATE employees SET attendanceToday = ? WHERE employeeId = ?').run('Present', empId);

      const updated = db.prepare('SELECT * FROM attendance WHERE id = ?').get(openRecord.id);

      res.json({
        action: 'check_out',
        message: `Goodbye, ${empName}! Punched OUT at ${checkOutTime}`,
        record: updated
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Database punch logging error: ' + err.message });
  }
});

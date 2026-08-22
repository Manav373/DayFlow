import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { LeaveRequest } from '../types/index.js';

export const leavesRouter = Router();

// GET /api/leaves
leavesRouter.get('/', (req: Request, res: Response): void => {
  const { employeeId } = req.query;

  try {
    let query = 'SELECT * FROM leaves';
    const params: any[] = [];

    if (employeeId) {
      query += ' WHERE employeeId = ?';
      params.push(employeeId);
    }

    query += ' ORDER BY appliedDate DESC';
    const records = db.prepare(query).all(...params);
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: 'Database read error: ' + err.message });
  }
});

// POST /api/leaves (Submit Leave Request)
leavesRouter.post('/', (req: Request, res: Response): void => {
  const { employeeId, employeeName, employeeAvatar, department, leaveType, startDate, endDate, totalDays, reason } = req.body;

  if (!startDate || !endDate || !reason) {
    res.status(400).json({ error: 'Start date, end date, and reason are required.' });
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) {
    res.status(400).json({ error: 'End date must be on or after start date.' });
    return;
  }

  const newLeave: LeaveRequest = {
    id: `lev-${Date.now()}`,
    employeeId: employeeId || 'DF-1001',
    employeeName: employeeName || 'Sarah Jenkins',
    employeeAvatar: employeeAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: department || 'Design',
    leaveType: leaveType || 'Paid Time Off (Annual)',
    startDate,
    endDate,
    totalDays: totalDays || 1,
    reason,
    status: 'Pending',
    appliedDate: new Date().toISOString().split('T')[0]
  };

  try {
    db.prepare(`
      INSERT INTO leaves (id, employeeId, employeeName, employeeAvatar, department, leaveType, startDate, endDate, totalDays, reason, status, appliedDate, reviewedBy, reviewDate)
      VALUES (@id, @employeeId, @employeeName, @employeeAvatar, @department, @leaveType, @startDate, @endDate, @totalDays, @reason, @status, @appliedDate, @reviewedBy, @reviewDate)
    `).run({
      ...newLeave,
      reviewedBy: null,
      reviewDate: null
    });

    res.status(201).json({
      message: 'Time off application submitted successfully.',
      leave: newLeave
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Database insert error: ' + err.message });
  }
});

// PUT /api/leaves/:id/status (Approve / Reject)
leavesRouter.put('/:id/status', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status, reviewedBy } = req.body;

  if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
    res.status(400).json({ error: 'Valid status (Approved, Rejected, Pending) is required.' });
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const info = db.prepare(`
      UPDATE leaves SET
        status = ?,
        reviewedBy = ?,
        reviewDate = ?
      WHERE id = ?
    `).run(status, reviewedBy || 'Administrator', today, id);

    if (info.changes === 0) {
      res.status(404).json({ error: 'Leave request not found.' });
      return;
    }

    const updated = db.prepare('SELECT * FROM leaves WHERE id = ?').get(id);
    res.json({ message: `Leave request status updated to ${status}.`, leave: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Database update error: ' + err.message });
  }
});

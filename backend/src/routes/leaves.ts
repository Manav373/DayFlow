import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { LeaveRequest } from '../types/index.js';

export const leavesRouter = Router();

// Get all leave requests
leavesRouter.get('/', (req: Request, res: Response): void => {
  const { status, employeeId, leaveType } = req.query;
  let result = [...db.leaves];

  if (status && status !== 'All') {
    result = result.filter((l) => l.status === status);
  }
  if (employeeId) {
    result = result.filter((l) => l.employeeId === employeeId);
  }
  if (leaveType && leaveType !== 'All') {
    result = result.filter((l) => l.leaveType === leaveType);
  }

  res.json(result);
});

// Apply for leave
leavesRouter.post('/', (req: Request, res: Response): void => {
  const { employeeId, leaveType, startDate, endDate, totalDays, reason } = req.body;

  const emp = db.employees.find((e) => e.employeeId === employeeId || e.id === employeeId);
  if (!emp) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }

  const newLeave: LeaveRequest = {
    id: `lv-${Date.now()}`,
    employeeId: emp.employeeId,
    employeeName: emp.name,
    employeeAvatar: emp.avatar,
    department: emp.workInfo.department,
    leaveType: leaveType || 'Paid Time Off (Annual)',
    startDate,
    endDate,
    totalDays: totalDays || 1,
    reason: reason || 'Personal time-off',
    status: 'Pending',
    appliedDate: new Date().toISOString().split('T')[0]
  };

  db.leaves.unshift(newLeave);
  res.status(201).json(newLeave);
});

// Approve / Reject leave
leavesRouter.put('/:id/status', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status, reviewedBy } = req.body;

  const leave = db.leaves.find((l) => l.id === id);
  if (!leave) {
    res.status(404).json({ error: 'Leave request not found' });
    return;
  }

  leave.status = status;
  leave.reviewedBy = reviewedBy || 'Admin';
  leave.reviewDate = new Date().toISOString().split('T')[0];

  res.json(leave);
});

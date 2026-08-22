import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';

export const payrollRouter = Router();

// Get payroll list
payrollRouter.get('/', (req: Request, res: Response): void => {
  const { status, employeeId } = req.query;
  let result = [...db.payroll];

  if (status && status !== 'All') {
    result = result.filter((p) => p.status === status);
  }
  if (employeeId) {
    result = result.filter((p) => p.employeeId === employeeId);
  }

  res.json(result);
});

// Update single payroll status
payrollRouter.put('/:id/status', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  const item = db.payroll.find((p) => p.id === id);
  if (!item) {
    res.status(404).json({ error: 'Payroll entry not found' });
    return;
  }

  item.status = status;
  if (status === 'Paid') {
    item.paymentDate = new Date().toISOString().split('T')[0];
  }

  res.json(item);
});

// Disburse all batch
payrollRouter.post('/disburse-all', (_req: Request, res: Response): void => {
  const today = new Date().toISOString().split('T')[0];
  db.payroll.forEach((p) => {
    p.status = 'Paid';
    p.paymentDate = today;
  });

  res.json({ message: 'All batch payrolls marked as Paid', count: db.payroll.length });
});

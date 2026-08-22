import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { PayrollRecord } from '../types/index.js';

export const payrollRouter = Router();

// GET /api/payroll
payrollRouter.get('/', (req: Request, res: Response): void => {
  const { employeeId } = req.query;

  try {
    let query = 'SELECT * FROM payroll';
    const params: any[] = [];

    if (employeeId) {
      query += ' WHERE employeeId = ?';
      params.push(employeeId);
    }

    query += ' ORDER BY paymentDate DESC';
    const records = db.prepare(query).all(...params);
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: 'Database read error: ' + err.message });
  }
});

// PUT /api/payroll/:id/status
payrollRouter.put('/:id/status', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['Paid', 'Processing', 'Pending'].includes(status)) {
    res.status(400).json({ error: 'Valid status (Paid, Processing, Pending) is required.' });
    return;
  }

  try {
    const info = db.prepare('UPDATE payroll SET status = ? WHERE id = ?').run(status, id);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Payroll record not found.' });
      return;
    }
    const updated = db.prepare('SELECT * FROM payroll WHERE id = ?').get(id);
    res.json({ message: `Payroll status updated to ${status}.`, record: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Database update error: ' + err.message });
  }
});

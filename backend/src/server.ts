import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { employeesRouter } from './routes/employees.js';
import { attendanceRouter } from './routes/attendance.js';
import { leavesRouter } from './routes/leaves.js';
import { payrollRouter } from './routes/payroll.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Health
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'DayFlow Unified HRMS API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Register routers
app.use('/api/auth', authRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/leaves', leavesRouter);
app.use('/api/payroll', payrollRouter);

app.listen(PORT, () => {
  console.log(`🚀 DayFlow HRMS API Server running on port ${PORT}`);
});

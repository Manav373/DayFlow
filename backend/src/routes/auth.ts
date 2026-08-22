import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { User, Employee } from '../types/index.js';

export const authRouter = Router();

// Login
authRouter.post('/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || (user.password && user.password !== password)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  // Find linked employee profile if any
  const employee = db.employees.find((e) => e.employeeId === user.employeeId || e.email.toLowerCase() === user.email.toLowerCase());

  res.json({
    token: `token_${user.id}_${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      avatar: user.avatar || employee?.avatar
    },
    employee: employee || null
  });
});

// Register
authRouter.post('/register', (req: Request, res: Response): void => {
  const { name, email, password, role = 'employee' } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    res.status(400).json({ error: 'An account with this email already exists' });
    return;
  }

  const newEmpId = `DF-${Math.floor(1000 + Math.random() * 9000)}`;
  const newUserId = `usr-${Date.now()}`;
  const defaultAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

  const newUser: User = {
    id: newUserId,
    name,
    email,
    password,
    role,
    employeeId: newEmpId,
    avatar: defaultAvatar
  };

  const newEmployee: Employee = {
    id: `emp-${Date.now()}`,
    employeeId: newEmpId,
    name,
    email,
    phone: '+1 (555) 000-0000',
    avatar: defaultAvatar,
    status: 'Active',
    workInfo: {
      department: 'Engineering',
      jobPosition: 'Software Specialist',
      manager: 'Elena Rostova',
      workLocation: 'San Francisco HQ',
      workAddress: '100 Montgomery St, San Francisco, CA',
      workSchedule: 'Standard 40 Hours',
      joinDate: new Date().toISOString().split('T')[0]
    },
    privateInfo: {
      privateEmail: email,
      privatePhone: '+1 (555) 000-0000',
      emergencyContactName: 'Family Contact',
      emergencyContactPhone: '+1 (555) 000-1111',
      bankName: 'National Bank',
      bankAccountNumber: '•••• •••• 1234',
      bankIfscOrRouting: 'NAT0001',
      identificationNumber: 'SSN-000-00-0000',
      address: 'San Francisco, CA'
    },
    hrSettings: {
      badgeId: `BADGE-${Math.floor(1000 + Math.random() * 9000)}`,
      pinCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      role,
      salary: 100000,
      userId: newUserId
    },
    leaveBalance: {
      casual: 12,
      casualUsed: 0,
      sick: 10,
      sickUsed: 0,
      annual: 18,
      annualUsed: 0,
      maternity: 30,
      maternityUsed: 0
    },
    attendanceToday: 'Present'
  };

  db.users.push(newUser);
  db.employees.push(newEmployee);

  res.status(201).json({
    token: `token_${newUser.id}_${Date.now()}`,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      employeeId: newUser.employeeId,
      avatar: newUser.avatar
    },
    employee: newEmployee
  });
});

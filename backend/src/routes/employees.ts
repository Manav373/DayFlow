import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { Employee } from '../types/index.js';

export const employeesRouter = Router();

// Get all employees
employeesRouter.get('/', (req: Request, res: Response): void => {
  const { department, status, search } = req.query;
  let result = [...db.employees];

  if (department && department !== 'All') {
    result = result.filter((e) => e.workInfo.department === department);
  }

  if (status && status !== 'All') {
    result = result.filter((e) => e.status === status);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.workInfo.jobPosition.toLowerCase().includes(q) ||
        e.workInfo.department.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

// Get single employee by ID or employeeId
employeesRouter.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const emp = db.employees.find((e) => e.id === id || e.employeeId === id);
  if (!emp) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.json(emp);
});

// Create new employee
employeesRouter.post('/', (req: Request, res: Response): void => {
  const data = req.body;
  if (!data.name || !data.email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const newEmpId = data.employeeId || `DF-${Math.floor(1000 + Math.random() * 9000)}`;
  const newEmp: Employee = {
    id: `emp-${Date.now()}`,
    employeeId: newEmpId,
    name: data.name,
    email: data.email,
    phone: data.phone || '+1 (555) 000-0000',
    avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: data.status || 'Active',
    workInfo: {
      department: data.workInfo?.department || data.department || 'Engineering',
      jobPosition: data.workInfo?.jobPosition || data.role || data.designation || 'Staff Member',
      manager: data.workInfo?.manager || data.manager || 'Elena Rostova',
      workLocation: data.workInfo?.workLocation || data.location || 'San Francisco HQ',
      workAddress: data.workInfo?.workAddress || '100 Montgomery St, San Francisco, CA',
      workSchedule: data.workInfo?.workSchedule || 'Standard 40 Hours',
      joinDate: data.workInfo?.joinDate || data.joinDate || new Date().toISOString().split('T')[0]
    },
    privateInfo: {
      privateEmail: data.privateInfo?.privateEmail || data.email,
      privatePhone: data.privateInfo?.privatePhone || data.phone || '+1 (555) 000-0000',
      emergencyContactName: data.privateInfo?.emergencyContactName || 'Family Contact',
      emergencyContactPhone: data.privateInfo?.emergencyContactPhone || '+1 (555) 000-1111',
      bankName: data.privateInfo?.bankName || 'National Bank',
      bankAccountNumber: data.privateInfo?.bankAccountNumber || '•••• •••• 1234',
      bankIfscOrRouting: data.privateInfo?.bankIfscOrRouting || 'NAT0001',
      identificationNumber: data.privateInfo?.identificationNumber || 'SSN-000-00-0000',
      address: data.privateInfo?.address || data.location || 'San Francisco, CA'
    },
    hrSettings: {
      badgeId: data.hrSettings?.badgeId || `BADGE-${Math.floor(1000 + Math.random() * 9000)}`,
      pinCode: data.hrSettings?.pinCode || `${Math.floor(1000 + Math.random() * 9000)}`,
      role: data.hrSettings?.role || 'employee',
      salary: data.hrSettings?.salary || data.salary || 100000
    },
    leaveBalance: data.leaveBalance || {
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

  db.employees.unshift(newEmp);
  res.status(201).json(newEmp);
});

// Update employee (tabbed fields)
employeesRouter.put('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const index = db.employees.findIndex((e) => e.id === id || e.employeeId === id);
  if (index === -1) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }

  const existing = db.employees[index];
  const updated: Employee = {
    ...existing,
    ...req.body,
    workInfo: {
      ...existing.workInfo,
      ...(req.body.workInfo || {})
    },
    privateInfo: {
      ...existing.privateInfo,
      ...(req.body.privateInfo || {})
    },
    hrSettings: {
      ...existing.hrSettings,
      ...(req.body.hrSettings || {})
    },
    leaveBalance: {
      ...existing.leaveBalance,
      ...(req.body.leaveBalance || {})
    }
  };

  db.employees[index] = updated;
  res.json(updated);
});

// Delete employee
employeesRouter.delete('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const index = db.employees.findIndex((e) => e.id === id || e.employeeId === id);
  if (index === -1) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }

  db.employees.splice(index, 1);
  res.json({ message: 'Employee deleted successfully' });
});

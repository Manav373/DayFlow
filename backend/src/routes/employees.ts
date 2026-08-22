import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { Employee, User } from '../types/index.js';
import { generateLoginId, generateInitialPassword } from '../utils/idGenerator.js';

export const employeesRouter = Router();

// Helper to parse employee row from SQLite
function parseEmployeeRow(row: any): Employee {
  return {
    ...row,
    workInfo: JSON.parse(row.workInfo || '{}'),
    privateInfo: JSON.parse(row.privateInfo || '{}'),
    resumeInfo: row.resumeInfo ? JSON.parse(row.resumeInfo) : undefined,
    salaryBreakdown: row.salaryBreakdown ? JSON.parse(row.salaryBreakdown) : undefined,
    hrSettings: JSON.parse(row.hrSettings || '{}'),
    leaveBalance: JSON.parse(row.leaveBalance || '{}')
  };
}

// GET /api/employees (List all employees)
employeesRouter.get('/', (_req: Request, res: Response): void => {
  try {
    const rows = db.prepare('SELECT * FROM employees ORDER BY name ASC').all();
    const parsed = rows.map(parseEmployeeRow);
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: 'Database read error: ' + err.message });
  }
});

// GET /api/employees/:id (Get single employee by id, employeeId, or loginId)
employeesRouter.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  try {
    const row = db.prepare(`
      SELECT * FROM employees
      WHERE id = ? OR employeeId = ? OR loginId = ?
    `).get(id, id, id);

    if (!row) {
      res.status(404).json({ error: 'Employee not found.' });
      return;
    }

    res.json(parseEmployeeRow(row));
  } catch (err: any) {
    res.status(500).json({ error: 'Database read error: ' + err.message });
  }
});

// POST /api/employees (Create new employee with formula Login ID & auto-generated credentials)
employeesRouter.post('/', (req: Request, res: Response): void => {
  const {
    name,
    email,
    phone,
    avatar,
    status,
    workInfo,
    privateInfo,
    resumeInfo,
    salaryBreakdown,
    hrSettings,
    leaveBalance
  } = req.body;

  // Comprehensive Validations
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Employee name with at least 2 characters is required.' });
    return;
  }

  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email address is required.' });
    return;
  }

  try {
    // Generate Formula Login ID: [CompanyInitials][Name2+2][Year][Serial4]
    const countRow = db.prepare('SELECT COUNT(*) as count FROM employees').get() as { count: number };
    const currentYear = workInfo?.joinDate ? new Date(workInfo.joinDate).getFullYear() : new Date().getFullYear();
    const loginId = generateLoginId(name, currentYear, countRow.count + 1, 'Odoo India');
    const initialPassword = generateInitialPassword();

    const empIdNum = 1000 + countRow.count + 1;
    const employeeId = `DF-${empIdNum}`;
    const id = `emp-${Date.now()}`;
    const userId = `usr-${Date.now()}`;

    const defaultWorkInfo = {
      department: workInfo?.department || 'Engineering',
      jobPosition: workInfo?.jobPosition || 'Software Engineer',
      manager: workInfo?.manager || 'David Sterling',
      workLocation: workInfo?.workLocation || 'San Francisco HQ',
      workAddress: workInfo?.workAddress || '100 Montgomery St, San Francisco, CA',
      workSchedule: workInfo?.workSchedule || 'Standard 40 Hours (9 AM - 5 PM)',
      joinDate: workInfo?.joinDate || new Date().toISOString().split('T')[0]
    };

    const defaultPrivateInfo = {
      dateOfBirth: privateInfo?.dateOfBirth || '1995-01-01',
      address: privateInfo?.address || '100 Cyber City, Gandhinagar, Gujarat',
      nationality: privateInfo?.nationality || 'Indian',
      privateEmail: privateInfo?.privateEmail || email,
      gender: privateInfo?.gender || 'Female',
      maritalStatus: privateInfo?.maritalStatus || 'Single',
      dateOfJoining: workInfo?.joinDate || new Date().toISOString().split('T')[0],
      bankName: privateInfo?.bankName || 'HDFC Bank Ltd',
      bankAccountNumber: privateInfo?.bankAccountNumber || '987654321098',
      bankIfscOrRouting: privateInfo?.bankIfscOrRouting || 'HDFC0001234',
      panNumber: privateInfo?.panNumber || 'ABCDE1234F',
      uanNumber: privateInfo?.uanNumber || '101234567890',
      empCode: employeeId,
      identificationNumber: privateInfo?.identificationNumber || 'ID-123456',
      privatePhone: privateInfo?.privatePhone || phone,
      emergencyContactName: privateInfo?.emergencyContactName || 'Family Member',
      emergencyContactPhone: privateInfo?.emergencyContactPhone || phone
    };

    const defaultResumeInfo = resumeInfo || {
      about: `${name} is an active team member contributing to ${defaultWorkInfo.department}.`,
      whatILove: 'Solving interesting product challenges and cross-functional team execution.',
      interests: 'Continuous learning, tech blogs, and design systems.',
      skills: ['TypeScript', 'React', 'Problem Solving'],
      certifications: ['Certified Professional']
    };

    const grossMonthly = hrSettings?.salary ? Math.round(hrSettings.salary / 12) : 50000;
    const defaultSalaryBreakdown = salaryBreakdown || {
      wageType: 'Fixed wage',
      monthWage: grossMonthly,
      yearlyWage: grossMonthly * 12,
      workingDaysWeek: 5,
      breakTimeHours: 1,
      basicSalary: Math.round(grossMonthly * 0.5),
      basicPct: 50,
      hra: Math.round(grossMonthly * 0.25),
      hraPct: 50,
      standardAllowance: Math.round(4167 * (grossMonthly / 50000)),
      standardAllowancePct: 16.67,
      performanceBonus: Math.round(2082.5 * (grossMonthly / 50000)),
      performanceBonusPct: 8.33,
      lta: Math.round(2082.5 * (grossMonthly / 50000)),
      ltaPct: 8.33,
      fixedAllowance: Math.max(0, grossMonthly - Math.round(grossMonthly * 0.5) - Math.round(grossMonthly * 0.25) - Math.round(4167 * (grossMonthly / 50000)) - Math.round(2082.5 * (grossMonthly / 50000)) * 2),
      fixedAllowancePct: 11.67,
      pfEmployee: Math.round(grossMonthly * 0.5 * 0.12),
      pfEmployeePct: 12,
      pfEmployer: Math.round(grossMonthly * 0.5 * 0.12),
      pfEmployerPct: 12,
      professionalTax: 200
    };

    const defaultHRSettings = {
      badgeId: hrSettings?.badgeId || `BADGE-${Math.floor(1000 + Math.random() * 9000)}`,
      pinCode: hrSettings?.pinCode || `${empIdNum}`,
      role: hrSettings?.role || 'employee',
      salary: defaultSalaryBreakdown.yearlyWage,
      userId,
      loginId,
      initialPassword
    };

    const defaultLeaveBalance = leaveBalance || {
      casual: 12,
      casualUsed: 0,
      sick: 10,
      sickUsed: 0,
      annual: 18,
      annualUsed: 0,
      maternity: 60,
      maternityUsed: 0
    };

    const newEmployee: Employee = {
      id,
      employeeId,
      loginId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '+1 (555) 000-0000',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: status || 'Active',
      workInfo: defaultWorkInfo,
      privateInfo: defaultPrivateInfo,
      resumeInfo: defaultResumeInfo,
      salaryBreakdown: defaultSalaryBreakdown,
      hrSettings: defaultHRSettings,
      leaveBalance: defaultLeaveBalance,
      attendanceToday: 'Present'
    };

    // Insert Employee into SQLite
    const insertEmpStmt = db.prepare(`
      INSERT INTO employees (id, employeeId, loginId, name, email, phone, avatar, status, workInfo, privateInfo, resumeInfo, salaryBreakdown, hrSettings, leaveBalance, attendanceToday)
      VALUES (@id, @employeeId, @loginId, @name, @email, @phone, @avatar, @status, @workInfo, @privateInfo, @resumeInfo, @salaryBreakdown, @hrSettings, @leaveBalance, @attendanceToday)
    `);

    insertEmpStmt.run({
      id: newEmployee.id,
      employeeId: newEmployee.employeeId,
      loginId: newEmployee.loginId,
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      avatar: newEmployee.avatar,
      status: newEmployee.status,
      workInfo: JSON.stringify(newEmployee.workInfo),
      privateInfo: JSON.stringify(newEmployee.privateInfo),
      resumeInfo: JSON.stringify(newEmployee.resumeInfo),
      salaryBreakdown: JSON.stringify(newEmployee.salaryBreakdown),
      hrSettings: JSON.stringify(newEmployee.hrSettings),
      leaveBalance: JSON.stringify(newEmployee.leaveBalance),
      attendanceToday: newEmployee.attendanceToday
    });

    // Also insert login user record into users table
    const insertUserStmt = db.prepare(`
      INSERT INTO users (id, loginId, email, name, role, password, employeeId, avatar, companyName, companyLogo, phone)
      VALUES (@id, @loginId, @email, @name, @role, @password, @employeeId, @avatar, @companyName, @companyLogo, @phone)
    `);

    insertUserStmt.run({
      id: userId,
      loginId,
      email: newEmployee.email,
      name: newEmployee.name,
      role: newEmployee.hrSettings.role,
      password: initialPassword,
      employeeId,
      avatar: newEmployee.avatar,
      companyName: 'Odoo India',
      companyLogo: null,
      phone: newEmployee.phone
    });

    res.status(201).json({
      message: 'Employee successfully created in database.',
      employee: newEmployee,
      generatedCredentials: {
        loginId,
        tempPassword: initialPassword
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Database insertion error: ' + err.message });
  }
});

// PUT /api/employees/:id (Update employee profile)
employeesRouter.put('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Employee not found.' });
      return;
    }

    const current = parseEmployeeRow(existing);
    const updatedEmployee: Employee = {
      ...current,
      ...updates,
      workInfo: { ...current.workInfo, ...(updates.workInfo || {}) },
      privateInfo: { ...current.privateInfo, ...(updates.privateInfo || {}) },
      resumeInfo: updates.resumeInfo ? { ...current.resumeInfo, ...updates.resumeInfo } : current.resumeInfo,
      salaryBreakdown: updates.salaryBreakdown ? { ...current.salaryBreakdown, ...updates.salaryBreakdown } : current.salaryBreakdown,
      hrSettings: { ...current.hrSettings, ...(updates.hrSettings || {}) }
    };

    db.prepare(`
      UPDATE employees SET
        name = @name,
        email = @email,
        phone = @phone,
        avatar = @avatar,
        status = @status,
        workInfo = @workInfo,
        privateInfo = @privateInfo,
        resumeInfo = @resumeInfo,
        salaryBreakdown = @salaryBreakdown,
        hrSettings = @hrSettings,
        leaveBalance = @leaveBalance,
        attendanceToday = @attendanceToday
      WHERE id = @id
    `).run({
      id: updatedEmployee.id,
      name: updatedEmployee.name,
      email: updatedEmployee.email,
      phone: updatedEmployee.phone,
      avatar: updatedEmployee.avatar,
      status: updatedEmployee.status,
      workInfo: JSON.stringify(updatedEmployee.workInfo),
      privateInfo: JSON.stringify(updatedEmployee.privateInfo),
      resumeInfo: JSON.stringify(updatedEmployee.resumeInfo),
      salaryBreakdown: JSON.stringify(updatedEmployee.salaryBreakdown),
      hrSettings: JSON.stringify(updatedEmployee.hrSettings),
      leaveBalance: JSON.stringify(updatedEmployee.leaveBalance),
      attendanceToday: updatedEmployee.attendanceToday
    });

    res.json({ message: 'Employee updated successfully in database.', employee: updatedEmployee });
  } catch (err: any) {
    res.status(500).json({ error: 'Database update error: ' + err.message });
  }
});

// DELETE /api/employees/:id
employeesRouter.delete('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  try {
    const info = db.prepare('DELETE FROM employees WHERE id = ? OR employeeId = ?').run(id, id);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Employee not found.' });
      return;
    }
    res.json({ message: 'Employee deleted successfully from database.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Database deletion error: ' + err.message });
  }
});

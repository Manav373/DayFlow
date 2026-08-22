import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import {
  User,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  ActivityLog
} from '../types/index.js';

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.resolve(dataDir, 'dayflow.db');
export const db = new Database(dbPath);

// Enable WAL mode for high performance concurrency
db.pragma('journal_mode = WAL');

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      loginId TEXT UNIQUE,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      password TEXT NOT NULL,
      employeeId TEXT,
      avatar TEXT,
      companyName TEXT,
      companyLogo TEXT,
      phone TEXT
    );

    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      employeeId TEXT UNIQUE NOT NULL,
      loginId TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      avatar TEXT,
      status TEXT NOT NULL,
      workInfo TEXT NOT NULL,
      privateInfo TEXT NOT NULL,
      resumeInfo TEXT,
      salaryBreakdown TEXT,
      hrSettings TEXT NOT NULL,
      leaveBalance TEXT NOT NULL,
      attendanceToday TEXT
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      employeeAvatar TEXT,
      department TEXT NOT NULL,
      date TEXT NOT NULL,
      checkIn TEXT NOT NULL,
      checkOut TEXT,
      workHours TEXT,
      overtime TEXT,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leaves (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      employeeAvatar TEXT,
      department TEXT NOT NULL,
      leaveType TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      totalDays INTEGER NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL,
      appliedDate TEXT NOT NULL,
      reviewedBy TEXT,
      reviewDate TEXT
    );

    CREATE TABLE IF NOT EXISTS payroll (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      employeeAvatar TEXT,
      department TEXT NOT NULL,
      designation TEXT NOT NULL,
      basicSalary REAL NOT NULL,
      hra REAL NOT NULL,
      allowances REAL NOT NULL,
      bonus REAL NOT NULL,
      providentFund REAL NOT NULL,
      taxDeduction REAL NOT NULL,
      otherDeductions REAL NOT NULL,
      grossSalary REAL NOT NULL,
      netSalary REAL NOT NULL,
      status TEXT NOT NULL,
      payPeriod TEXT NOT NULL,
      paymentDate TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      user TEXT NOT NULL,
      avatar TEXT,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      time TEXT NOT NULL,
      type TEXT NOT NULL
    );
  `);

  // Seed default data if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  const insertUser = db.prepare(`
    INSERT INTO users (id, loginId, email, name, role, password, employeeId, avatar, companyName, companyLogo, phone)
    VALUES (@id, @loginId, @email, @name, @role, @password, @employeeId, @avatar, @companyName, @companyLogo, @phone)
  `);

  const insertEmployee = db.prepare(`
    INSERT INTO employees (id, employeeId, loginId, name, email, phone, avatar, status, workInfo, privateInfo, resumeInfo, salaryBreakdown, hrSettings, leaveBalance, attendanceToday)
    VALUES (@id, @employeeId, @loginId, @name, @email, @phone, @avatar, @status, @workInfo, @privateInfo, @resumeInfo, @salaryBreakdown, @hrSettings, @leaveBalance, @attendanceToday)
  `);

  const insertAttendance = db.prepare(`
    INSERT INTO attendance (id, employeeId, employeeName, employeeAvatar, department, date, checkIn, checkOut, workHours, overtime, status)
    VALUES (@id, @employeeId, @employeeName, @employeeAvatar, @department, @date, @checkIn, @checkOut, @workHours, @overtime, @status)
  `);

  const insertLeave = db.prepare(`
    INSERT INTO leaves (id, employeeId, employeeName, employeeAvatar, department, leaveType, startDate, endDate, totalDays, reason, status, appliedDate, reviewedBy, reviewDate)
    VALUES (@id, @employeeId, @employeeName, @employeeAvatar, @department, @leaveType, @startDate, @endDate, @totalDays, @reason, @status, @appliedDate, @reviewedBy, @reviewDate)
  `);

  const insertPayroll = db.prepare(`
    INSERT INTO payroll (id, employeeId, employeeName, employeeAvatar, department, designation, basicSalary, hra, allowances, bonus, providentFund, taxDeduction, otherDeductions, grossSalary, netSalary, status, payPeriod, paymentDate)
    VALUES (@id, @employeeId, @employeeName, @employeeAvatar, @department, @designation, @basicSalary, @hra, @allowances, @bonus, @providentFund, @taxDeduction, @otherDeductions, @grossSalary, @netSalary, @status, @payPeriod, @paymentDate)
  `);

  const insertActivity = db.prepare(`
    INSERT INTO activities (id, user, avatar, action, target, time, type)
    VALUES (@id, @user, @avatar, @action, @target, @time, @type)
  `);

  const initialUsers: User[] = [
    {
      id: 'usr-1',
      loginId: 'OIDAST20190003',
      email: 'admin@dayflow.io',
      name: 'David Sterling',
      role: 'admin',
      password: 'password123',
      employeeId: 'DF-1004',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      companyName: 'Odoo India',
      phone: '+91 98765 00001'
    },
    {
      id: 'usr-2',
      loginId: 'OIPRSH20210004',
      email: 'priya.s@dayflow.io',
      name: 'Priya Sharma',
      role: 'hr_officer',
      password: 'password123',
      employeeId: 'DF-1005',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      companyName: 'Odoo India',
      phone: '+91 98765 00002'
    },
    {
      id: 'usr-3',
      loginId: 'OISAJE20220001',
      email: 'sarah.j@dayflow.io',
      name: 'Sarah Jenkins',
      role: 'employee',
      password: 'password123',
      employeeId: 'DF-1001',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      companyName: 'Odoo India',
      phone: '+1 (555) 234-5678'
    },
    {
      id: 'usr-4',
      loginId: 'OIALRI20210002',
      email: 'alex.rivera@dayflow.io',
      name: 'Alex Rivera',
      role: 'employee',
      password: 'password123',
      employeeId: 'DF-1002',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      companyName: 'Odoo India',
      phone: '+1 (555) 345-6789'
    }
  ];

  initialUsers.forEach((u) => insertUser.run({
    ...u,
    companyLogo: u.companyLogo || null
  }));

  const initialEmployees: Employee[] = [
    {
      id: 'emp-1',
      employeeId: 'DF-1001',
      loginId: 'OISAJE20220001',
      name: 'Sarah Jenkins',
      email: 'sarah.j@dayflow.io',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
      workInfo: {
        department: 'Design',
        jobPosition: 'Lead Product Designer',
        manager: 'Marcus Vance',
        workLocation: 'San Francisco HQ',
        workAddress: '100 Montgomery St, San Francisco, CA',
        workSchedule: 'Standard 40 Hours (9 AM - 5 PM)',
        joinDate: '2022-03-15'
      },
      privateInfo: {
        dateOfBirth: '1995-04-12',
        address: '424 Market Street, Apt 5B, San Francisco, CA',
        nationality: 'American',
        privateEmail: 'sarah.jenkins.personal@gmail.com',
        gender: 'Female',
        maritalStatus: 'Single',
        dateOfJoining: '2022-03-15',
        bankName: 'Silicon Valley Bank',
        bankAccountNumber: '987654321098',
        bankIfscOrRouting: 'SVB120934',
        panNumber: 'ABCDE1234F',
        uanNumber: '101234567890',
        empCode: 'DF-1001',
        identificationNumber: 'SSN-984-21-4321',
        privatePhone: '+1 (555) 987-1234',
        emergencyContactName: 'Robert Jenkins (Spouse)',
        emergencyContactPhone: '+1 (555) 987-5678'
      },
      resumeInfo: {
        about: 'Sarah Jenkins is a lead product designer with 8+ years experience building SaaS UI systems.',
        whatILove: 'Solving complex interaction workflows and crafting pixel-perfect design systems.',
        interests: 'Typography, micro-interactions, Figma plugins, and hiking.',
        skills: ['Framer Motion', 'Tailwind CSS', 'Figma', 'Design Systems', 'React'],
        certifications: ['Certified Scrum Master (CSM)', 'UX Master Certificate (NN/g)']
      },
      salaryBreakdown: {
        wageType: 'Fixed wage',
        monthWage: 50000,
        yearlyWage: 600000,
        workingDaysWeek: 5,
        breakTimeHours: 1,
        basicSalary: 25000,
        basicPct: 50,
        hra: 12500,
        hraPct: 50,
        standardAllowance: 4167,
        standardAllowancePct: 16.67,
        performanceBonus: 2082.5,
        performanceBonusPct: 8.33,
        lta: 2082.5,
        ltaPct: 8.33,
        fixedAllowance: 2918,
        fixedAllowancePct: 11.67,
        pfEmployee: 3000,
        pfEmployeePct: 12,
        pfEmployer: 3000,
        pfEmployerPct: 12,
        professionalTax: 200
      },
      hrSettings: {
        badgeId: 'BADGE-8841',
        pinCode: '1001',
        role: 'employee',
        salary: 600000,
        userId: 'usr-3',
        loginId: 'OISAJE20220001'
      },
      leaveBalance: { casual: 12, casualUsed: 3, sick: 10, sickUsed: 1, annual: 18, annualUsed: 5, maternity: 60, maternityUsed: 0 },
      attendanceToday: 'Present'
    },
    {
      id: 'emp-2',
      employeeId: 'DF-1002',
      loginId: 'OIALRI20210002',
      name: 'Alex Rivera',
      email: 'alex.rivera@dayflow.io',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
      workInfo: {
        department: 'Engineering',
        jobPosition: 'Senior Fullstack Engineer',
        manager: 'David Sterling',
        workLocation: 'San Francisco HQ',
        workAddress: '100 Montgomery St, San Francisco, CA',
        workSchedule: 'Standard 40 Hours (9 AM - 5 PM)',
        joinDate: '2021-06-10'
      },
      privateInfo: {
        dateOfBirth: '1990-08-20',
        address: '782 Pine Street, San Francisco, CA',
        nationality: 'American',
        privateEmail: 'alex.rivera.dev@gmail.com',
        gender: 'Male',
        maritalStatus: 'Married',
        dateOfJoining: '2021-06-10',
        bankName: 'Chase Bank',
        bankAccountNumber: '123456789012',
        bankIfscOrRouting: 'CHASUS33',
        panNumber: 'BCDEF2345G',
        uanNumber: '102345678901',
        empCode: 'DF-1002',
        identificationNumber: 'SSN-772-11-9988',
        privatePhone: '+1 (555) 333-8899',
        emergencyContactName: 'Elena Rivera (Spouse)',
        emergencyContactPhone: '+1 (555) 333-8800'
      },
      resumeInfo: {
        about: 'Senior Fullstack Engineer with 10+ years specializing in distributed systems and Node.js.',
        whatILove: 'High-throughput database engines, automated deployments, and mentoring peers.',
        interests: 'Distributed computing, mechanical keyboards, and rock climbing.',
        skills: ['Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'Kubernetes'],
        certifications: ['AWS Certified Solutions Architect', 'CKA Kubernetes']
      },
      salaryBreakdown: {
        wageType: 'Fixed wage',
        monthWage: 55000,
        yearlyWage: 660000,
        workingDaysWeek: 5,
        breakTimeHours: 1,
        basicSalary: 27500,
        basicPct: 50,
        hra: 13750,
        hraPct: 50,
        standardAllowance: 4583,
        standardAllowancePct: 16.67,
        performanceBonus: 2291,
        performanceBonusPct: 8.33,
        lta: 2291,
        ltaPct: 8.33,
        fixedAllowance: 3209,
        fixedAllowancePct: 11.67,
        pfEmployee: 3300,
        pfEmployeePct: 12,
        pfEmployer: 3300,
        pfEmployerPct: 12,
        professionalTax: 200
      },
      hrSettings: {
        badgeId: 'BADGE-3312',
        pinCode: '1002',
        role: 'employee',
        salary: 660000,
        userId: 'usr-4',
        loginId: 'OIALRI20210002'
      },
      leaveBalance: { casual: 12, casualUsed: 1, sick: 10, sickUsed: 2, annual: 18, annualUsed: 2, maternity: 0, maternityUsed: 0 },
      attendanceToday: 'Present'
    },
    {
      id: 'emp-3',
      employeeId: 'DF-1003',
      loginId: 'OIELRO20200001',
      name: 'Elena Rostova',
      email: 'elena.r@dayflow.io',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'On Leave',
      workInfo: {
        department: 'Product',
        jobPosition: 'Director of Product',
        manager: 'David Sterling',
        workLocation: 'San Francisco HQ',
        workAddress: '100 Montgomery St, San Francisco, CA',
        workSchedule: 'Standard 40 Hours (9 AM - 5 PM)',
        joinDate: '2020-01-15'
      },
      privateInfo: {
        dateOfBirth: '1988-11-03',
        address: '120 Broadway, Oakland, CA',
        nationality: 'American',
        privateEmail: 'elena.rostova@gmail.com',
        gender: 'Female',
        maritalStatus: 'Married',
        dateOfJoining: '2020-01-15',
        bankName: 'Bank of America',
        bankAccountNumber: '998877665544',
        bankIfscOrRouting: 'BOFAUS3N',
        panNumber: 'CDEFG3456H',
        uanNumber: '103456789012',
        empCode: 'DF-1003',
        identificationNumber: 'SSN-661-44-2200',
        privatePhone: '+1 (555) 444-1122',
        emergencyContactName: 'Dmitri Rostov (Brother)',
        emergencyContactPhone: '+1 (555) 444-9988'
      },
      resumeInfo: {
        about: 'Director of Product driving user-centric roadmap strategies across HRMS verticals.',
        whatILove: 'Translating customer pain points into intuitive SaaS solutions.',
        interests: 'Product strategy, chess, and classical piano.',
        skills: ['Product Strategy', 'User Research', 'Agile Roadmapping', 'Data Analytics'],
        certifications: ['Pragmatic Institute Certified Product Master']
      },
      salaryBreakdown: {
        wageType: 'Fixed wage',
        monthWage: 65000,
        yearlyWage: 780000,
        workingDaysWeek: 5,
        breakTimeHours: 1,
        basicSalary: 32500,
        basicPct: 50,
        hra: 16250,
        hraPct: 50,
        standardAllowance: 5417,
        standardAllowancePct: 16.67,
        performanceBonus: 2708,
        performanceBonusPct: 8.33,
        lta: 2708,
        ltaPct: 8.33,
        fixedAllowance: 3792,
        fixedAllowancePct: 11.67,
        pfEmployee: 3900,
        pfEmployeePct: 12,
        pfEmployer: 3900,
        pfEmployerPct: 12,
        professionalTax: 200
      },
      hrSettings: {
        badgeId: 'BADGE-5544',
        pinCode: '1003',
        role: 'employee',
        salary: 780000,
        userId: 'usr-5',
        loginId: 'OIELRO20200001'
      },
      leaveBalance: { casual: 12, casualUsed: 4, sick: 10, sickUsed: 3, annual: 18, annualUsed: 8, maternity: 0, maternityUsed: 0 },
      attendanceToday: 'On Leave'
    },
    {
      id: 'emp-4',
      employeeId: 'DF-1004',
      loginId: 'OIDAST20190003',
      name: 'David Sterling',
      email: 'admin@dayflow.io',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
      workInfo: {
        department: 'Executive',
        jobPosition: 'Chief Operations Officer & VP HR',
        manager: 'Board of Directors',
        workLocation: 'San Francisco HQ',
        workAddress: '100 Montgomery St, San Francisco, CA',
        workSchedule: 'Flexible 45 Hours',
        joinDate: '2019-01-01'
      },
      privateInfo: {
        dateOfBirth: '1985-02-14',
        address: '500 Embarcadero, San Francisco, CA',
        nationality: 'American',
        privateEmail: 'david.sterling.private@gmail.com',
        gender: 'Male',
        maritalStatus: 'Married',
        dateOfJoining: '2019-01-01',
        bankName: 'Wells Fargo',
        bankAccountNumber: '556677889900',
        bankIfscOrRouting: 'WFBIUS6S',
        panNumber: 'DEFGH4567J',
        uanNumber: '104567890123',
        empCode: 'DF-1004',
        identificationNumber: 'SSN-112-99-4455',
        privatePhone: '+1 (555) 999-0011',
        emergencyContactName: 'Claire Sterling (Spouse)',
        emergencyContactPhone: '+1 (555) 999-0022'
      },
      resumeInfo: {
        about: 'Executive leader scaling corporate HR operations, workforce planning, and organizational culture.',
        whatILove: 'Building high-performance teams and empowering people to thrive.',
        interests: 'Marathon running, angel investing, and organizational psychology.',
        skills: ['Executive Leadership', 'Workforce Governance', 'Financial Operations', 'Talent Acquisition'],
        certifications: ['SHRM Senior Certified Professional (SHRM-SCP)', 'Executive MBA']
      },
      salaryBreakdown: {
        wageType: 'Fixed wage',
        monthWage: 80000,
        yearlyWage: 960000,
        workingDaysWeek: 5,
        breakTimeHours: 1,
        basicSalary: 40000,
        basicPct: 50,
        hra: 20000,
        hraPct: 50,
        standardAllowance: 6667,
        standardAllowancePct: 16.67,
        performanceBonus: 3333,
        performanceBonusPct: 8.33,
        lta: 3333,
        ltaPct: 8.33,
        fixedAllowance: 4667,
        fixedAllowancePct: 11.67,
        pfEmployee: 4800,
        pfEmployeePct: 12,
        pfEmployer: 4800,
        pfEmployerPct: 12,
        professionalTax: 200
      },
      hrSettings: {
        badgeId: 'BADGE-1000',
        pinCode: '0001',
        role: 'admin',
        salary: 960000,
        userId: 'usr-1',
        loginId: 'OIDAST20190003'
      },
      leaveBalance: { casual: 15, casualUsed: 1, sick: 12, sickUsed: 0, annual: 25, annualUsed: 4, maternity: 0, maternityUsed: 0 },
      attendanceToday: 'Present'
    }
  ];

  initialEmployees.forEach((emp) => {
    insertEmployee.run({
      id: emp.id,
      employeeId: emp.employeeId,
      loginId: emp.loginId,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      avatar: emp.avatar,
      status: emp.status,
      workInfo: JSON.stringify(emp.workInfo),
      privateInfo: JSON.stringify(emp.privateInfo),
      resumeInfo: JSON.stringify(emp.resumeInfo || null),
      salaryBreakdown: JSON.stringify(emp.salaryBreakdown || null),
      hrSettings: JSON.stringify(emp.hrSettings),
      leaveBalance: JSON.stringify(emp.leaveBalance),
      attendanceToday: emp.attendanceToday || 'Present'
    });
  });

  // Seed Attendance Records
  const initialAttendance: AttendanceRecord[] = [
    {
      id: 'att-1',
      employeeId: 'DF-1001',
      employeeName: 'Sarah Jenkins',
      employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      department: 'Design',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:02 AM',
      checkOut: '05:00 PM',
      workHours: '7h 58m',
      overtime: '0m',
      status: 'Present'
    },
    {
      id: 'att-2',
      employeeId: 'DF-1002',
      employeeName: 'Alex Rivera',
      employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      department: 'Engineering',
      date: new Date().toISOString().split('T')[0],
      checkIn: '08:55 AM',
      checkOut: '05:05 PM',
      workHours: '8h 10m',
      overtime: '10m',
      status: 'Present'
    },
    {
      id: 'att-3',
      employeeId: 'DF-1004',
      employeeName: 'David Sterling',
      employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      department: 'Executive',
      date: new Date().toISOString().split('T')[0],
      checkIn: '08:45 AM',
      checkOut: '06:00 PM',
      workHours: '9h 15m',
      overtime: '1h 15m',
      status: 'Present'
    }
  ];

  initialAttendance.forEach((a) => insertAttendance.run(a));

  // Seed Leave Requests
  const initialLeaves: LeaveRequest[] = [
    {
      id: 'lev-1',
      employeeId: 'DF-1003',
      employeeName: 'Elena Rostova',
      employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      department: 'Product',
      leaveType: 'Paid Time Off (Annual)',
      startDate: '2026-10-28',
      endDate: '2026-10-28',
      totalDays: 1,
      reason: 'Attending European Product Summit',
      status: 'Pending',
      appliedDate: '2026-10-20'
    },
    {
      id: 'lev-2',
      employeeId: 'DF-1001',
      employeeName: 'Sarah Jenkins',
      employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      department: 'Design',
      leaveType: 'Paid Time Off (Annual)',
      startDate: '2026-05-13',
      endDate: '2026-05-14',
      totalDays: 2,
      reason: 'Personal vacation',
      status: 'Approved',
      appliedDate: '2026-05-01',
      reviewedBy: 'David Sterling',
      reviewDate: '2026-05-02'
    }
  ];

  initialLeaves.forEach((l) => insertLeave.run({
    ...l,
    reviewedBy: l.reviewedBy || null,
    reviewDate: l.reviewDate || null
  }));

  // Seed Payroll Records
  const initialPayroll: PayrollRecord[] = [
    {
      id: 'pay-1',
      employeeId: 'DF-1001',
      employeeName: 'Sarah Jenkins',
      employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      department: 'Design',
      designation: 'Lead Product Designer',
      basicSalary: 25000,
      hra: 12500,
      allowances: 4167 + 2082.5 + 2082.5 + 2918,
      bonus: 2082.5,
      providentFund: 3000,
      taxDeduction: 200,
      otherDeductions: 0,
      grossSalary: 50000,
      netSalary: 46800,
      status: 'Paid',
      payPeriod: 'October 2026',
      paymentDate: '2026-10-31'
    }
  ];

  initialPayroll.forEach((p) => insertPayroll.run(p));

  // Seed Activity Logs
  const initialActivities: ActivityLog[] = [
    {
      id: 'act-1',
      user: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      action: 'punched in',
      target: 'Live Attendance',
      time: '10 minutes ago',
      type: 'attendance'
    },
    {
      id: 'act-2',
      user: 'David Sterling',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      action: 'approved leave request for',
      target: 'Sarah Jenkins',
      time: '1 hour ago',
      type: 'leave'
    }
  ];

  initialActivities.forEach((act) => insertActivity.run(act));

  console.log('✅ SQLite Database initialized and seeded with initial records.');
}

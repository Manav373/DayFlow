import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, User } from '../types/index.js';

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'David Sterling',
    email: 'admin@dayflow.io',
    password: 'password123',
    role: 'admin',
    employeeId: 'DF-1004',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'Priya Sharma',
    email: 'hr@dayflow.io',
    password: 'password123',
    role: 'hr_officer',
    employeeId: 'DF-1005',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'Sarah Jenkins',
    email: 'sarah@dayflow.io',
    password: 'password123',
    role: 'employee',
    employeeId: 'DF-1001',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-4',
    name: 'Alex Rivera',
    email: 'alex@dayflow.io',
    password: 'password123',
    role: 'employee',
    employeeId: 'DF-1002',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    employeeId: 'DF-1001',
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
      privateEmail: 'sarah.jenkins.personal@gmail.com',
      privatePhone: '+1 (555) 987-1234',
      emergencyContactName: 'Robert Jenkins (Spouse)',
      emergencyContactPhone: '+1 (555) 987-5678',
      bankName: 'Silicon Valley Bank',
      bankAccountNumber: '•••• •••• 4589',
      bankIfscOrRouting: 'SVB120934',
      identificationNumber: 'SSN-984-21-4321',
      address: '424 Market Street, Apt 5B, San Francisco, CA'
    },
    hrSettings: {
      badgeId: 'BADGE-8841',
      pinCode: '1001',
      role: 'employee',
      salary: 135000,
      userId: 'usr-3'
    },
    leaveBalance: { casual: 12, casualUsed: 3, sick: 10, sickUsed: 1, annual: 18, annualUsed: 5, maternity: 60, maternityUsed: 0 },
    attendanceToday: 'Present'
  },
  {
    id: 'emp-2',
    employeeId: 'DF-1002',
    name: 'Alex Rivera',
    email: 'alex.rivera@dayflow.io',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    workInfo: {
      department: 'Engineering',
      jobPosition: 'Senior Fullstack Engineer',
      manager: 'Elena Rostova',
      workLocation: 'Austin Remote Hub',
      workAddress: '500 Congress Ave, Austin, TX',
      workSchedule: 'Flexible 40 Hours',
      joinDate: '2021-08-01'
    },
    privateInfo: {
      privateEmail: 'alex.rivera.dev@gmail.com',
      privatePhone: '+1 (555) 876-5432',
      emergencyContactName: 'Maria Rivera (Mother)',
      emergencyContactPhone: '+1 (555) 876-1122',
      bankName: 'Chase Bank',
      bankAccountNumber: '•••• •••• 7731',
      bankIfscOrRouting: 'CHAS00234',
      identificationNumber: 'SSN-451-88-9012',
      address: '1204 Colorado St, Austin, TX'
    },
    hrSettings: {
      badgeId: 'BADGE-7721',
      pinCode: '1002',
      role: 'employee',
      salary: 145000,
      userId: 'usr-4'
    },
    leaveBalance: { casual: 12, casualUsed: 4, sick: 10, sickUsed: 2, annual: 18, annualUsed: 7, maternity: 30, maternityUsed: 0 },
    attendanceToday: 'Present'
  },
  {
    id: 'emp-3',
    employeeId: 'DF-1004',
    name: 'David Sterling',
    email: 'david.s@dayflow.io',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    workInfo: {
      department: 'Executive',
      jobPosition: 'Chief Executive Officer',
      manager: 'Board of Directors',
      workLocation: 'San Francisco HQ',
      workAddress: '100 Montgomery St, San Francisco, CA',
      workSchedule: 'Executive Full Time',
      joinDate: '2019-06-01'
    },
    privateInfo: {
      privateEmail: 'david.sterling.exec@gmail.com',
      privatePhone: '+1 (555) 999-8877',
      emergencyContactName: 'Catherine Sterling (Spouse)',
      emergencyContactPhone: '+1 (555) 999-1122',
      bankName: 'First Republic / JP Morgan',
      bankAccountNumber: '•••• •••• 9920',
      bankIfscOrRouting: 'FRB009112',
      identificationNumber: 'SSN-112-44-8899',
      address: '88 Pacific Heights, San Francisco, CA'
    },
    hrSettings: {
      badgeId: 'BADGE-0001',
      pinCode: '0001',
      role: 'admin',
      salary: 240000,
      userId: 'usr-1'
    },
    leaveBalance: { casual: 15, casualUsed: 1, sick: 12, sickUsed: 1, annual: 25, annualUsed: 4, maternity: 0, maternityUsed: 0 },
    attendanceToday: 'Present'
  },
  {
    id: 'emp-4',
    employeeId: 'DF-1005',
    name: 'Priya Sharma',
    email: 'priya.s@dayflow.io',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    workInfo: {
      department: 'Human Resources',
      jobPosition: 'Director of People & Culture',
      manager: 'David Sterling',
      workLocation: 'New York Hub',
      workAddress: '350 5th Ave, New York, NY',
      workSchedule: 'Standard 40 Hours',
      joinDate: '2021-04-12'
    },
    privateInfo: {
      privateEmail: 'priya.sharma.ny@gmail.com',
      privatePhone: '+1 (555) 444-3322',
      emergencyContactName: 'Anil Sharma (Brother)',
      emergencyContactPhone: '+1 (555) 444-9988',
      bankName: 'Bank of America',
      bankAccountNumber: '•••• •••• 3341',
      bankIfscOrRouting: 'BOA110022',
      identificationNumber: 'SSN-334-99-1234',
      address: '221 E 44th St, New York, NY'
    },
    hrSettings: {
      badgeId: 'BADGE-0005',
      pinCode: '1005',
      role: 'hr_officer',
      salary: 150000,
      userId: 'usr-2'
    },
    leaveBalance: { casual: 12, casualUsed: 2, sick: 10, sickUsed: 1, annual: 20, annualUsed: 8, maternity: 60, maternityUsed: 0 },
    attendanceToday: 'Present'
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'DF-1001',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Design',
    date: '2026-08-22',
    checkIn: '08:55 AM',
    checkOut: '05:30 PM',
    workHours: '8h 35m',
    overtime: '0h 35m',
    status: 'Present'
  },
  {
    id: 'att-2',
    employeeId: 'DF-1002',
    employeeName: 'Alex Rivera',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    date: '2026-08-22',
    checkIn: '09:02 AM',
    checkOut: '--:--',
    workHours: '5h 15m (Active)',
    overtime: '0h 00m',
    status: 'Present'
  }
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'lv-1',
    employeeId: 'DF-1001',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Design',
    leaveType: 'Paid Time Off (Annual)',
    startDate: '2026-08-28',
    endDate: '2026-08-30',
    totalDays: 3,
    reason: 'Family weekend travel & personal time.',
    status: 'Pending',
    appliedDate: '2026-08-21'
  },
  {
    id: 'lv-2',
    employeeId: 'DF-1002',
    employeeName: 'Alex Rivera',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: '2026-09-04',
    endDate: '2026-09-05',
    totalDays: 2,
    reason: 'Home relocation tasks.',
    status: 'Pending',
    appliedDate: '2026-08-22'
  }
];

export const initialPayrollRecords: PayrollRecord[] = [
  {
    id: 'pay-1',
    employeeId: 'DF-1001',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Design',
    designation: 'Lead Product Designer',
    basicSalary: 8500,
    hra: 1800,
    allowances: 950,
    bonus: 500,
    providentFund: 650,
    taxDeduction: 1400,
    otherDeductions: 100,
    grossSalary: 11750,
    netSalary: 9600,
    status: 'Paid',
    payPeriod: 'August 2026',
    paymentDate: '2026-08-01'
  }
];

class Database {
  users = [...initialUsers];
  employees = [...initialEmployees];
  attendance = [...initialAttendanceRecords];
  leaves = [...initialLeaveRequests];
  payroll = [...initialPayrollRecords];
}

export const db = new Database();

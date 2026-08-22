import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, ActivityLog } from '../types';

export const initialEmployees: Employee[] = [
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
      privateEmail: 'sarah.jenkins.personal@gmail.com',
      privatePhone: '+1 (555) 987-1234',
      emergencyContactName: 'Robert Jenkins (Spouse)',
      emergencyContactPhone: '+1 (555) 987-5678',
      bankName: 'Silicon Valley Bank',
      bankAccountNumber: '•••• •••• 4589',
      bankIfscOrRouting: 'SVB120934',
      identificationNumber: 'SSN-984-21-4321',
      address: '424 Market Street, Apt 5B, San Francisco, CA',
      dateOfBirth: '1992-05-14',
      gender: 'Female'
    },
    hrSettings: {
      badgeId: 'BADGE-8841',
      pinCode: '1001',
      role: 'employee',
      salary: 135000,
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
      address: '1204 Colorado St, Austin, TX',
      dateOfBirth: '1990-11-20',
      gender: 'Male'
    },
    hrSettings: {
      badgeId: 'BADGE-7721',
      pinCode: '1002',
      role: 'employee',
      salary: 145000,
      userId: 'usr-4',
      loginId: 'OIALRI20210002'
    },
    leaveBalance: { casual: 12, casualUsed: 4, sick: 10, sickUsed: 2, annual: 18, annualUsed: 7, maternity: 30, maternityUsed: 0 },
    attendanceToday: 'Present'
  },
  {
    id: 'emp-3',
    employeeId: 'DF-1004',
    loginId: 'OIDAST20190003',
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
      address: '88 Pacific Heights, San Francisco, CA',
      dateOfBirth: '1984-03-10',
      gender: 'Male'
    },
    hrSettings: {
      badgeId: 'BADGE-0001',
      pinCode: '0001',
      role: 'admin',
      salary: 240000,
      userId: 'usr-1',
      loginId: 'OIDAST20190003'
    },
    leaveBalance: { casual: 15, casualUsed: 1, sick: 12, sickUsed: 1, annual: 25, annualUsed: 4, maternity: 0, maternityUsed: 0 },
    attendanceToday: 'Present'
  },
  {
    id: 'emp-4',
    employeeId: 'DF-1005',
    loginId: 'OIPRSH20210004',
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
      address: '221 E 44th St, New York, NY',
      dateOfBirth: '1989-08-22',
      gender: 'Female'
    },
    hrSettings: {
      badgeId: 'BADGE-0005',
      pinCode: '1005',
      role: 'hr_officer',
      salary: 150000,
      userId: 'usr-2',
      loginId: 'OIPRSH20210004'
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
    startDate: '2026-08-25',
    endDate: '2026-08-28',
    totalDays: 4,
    reason: 'Family vacation & recharge.',
    status: 'Approved',
    appliedDate: '2026-08-15',
    reviewedBy: 'Priya Sharma',
    reviewDate: '2026-08-16'
  },
  {
    id: 'lv-2',
    employeeId: 'DF-1002',
    employeeName: 'Alex Rivera',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: '2026-08-28',
    endDate: '2026-08-29',
    totalDays: 2,
    reason: 'Personal appointments & moving.',
    status: 'Pending',
    appliedDate: '2026-08-21'
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
  },
  {
    id: 'pay-2',
    employeeId: 'DF-1002',
    employeeName: 'Alex Rivera',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Senior Fullstack Engineer',
    basicSalary: 9200,
    hra: 1900,
    allowances: 980,
    bonus: 800,
    providentFund: 720,
    taxDeduction: 1600,
    otherDeductions: 120,
    grossSalary: 12880,
    netSalary: 10440,
    status: 'Paid',
    payPeriod: 'August 2026',
    paymentDate: '2026-08-01'
  }
];

export const initialActivities: ActivityLog[] = [
  {
    id: 'act-1',
    user: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    action: 'requested',
    target: '4 days of Paid Time Off',
    time: '10 mins ago',
    type: 'leave'
  },
  {
    id: 'act-2',
    user: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    action: 'punched in at',
    target: '09:02 AM (Austin Hub)',
    time: '2 hours ago',
    type: 'attendance'
  }
];

export const departmentsSummary = [
  { name: 'Engineering', headcount: 34, lead: 'Elena Rostova', budget: 4800000 },
  { name: 'Design', headcount: 12, lead: 'Marcus Vance', budget: 1620000 },
  { name: 'Product', headcount: 9, lead: 'Chloe Dupont', budget: 1260000 },
  { name: 'Human Resources', headcount: 6, lead: 'Priya Sharma', budget: 900000 },
  { name: 'Finance', headcount: 5, lead: 'Amara Okafor', budget: 600000 },
  { name: 'Executive', headcount: 4, lead: 'David Sterling', budget: 1200000 }
];

export const monthlyAttendanceTrends = [
  { month: 'Mar', present: 96, late: 3, absent: 1 },
  { month: 'Apr', present: 94, late: 4, absent: 2 },
  { month: 'May', present: 97, late: 2, absent: 1 },
  { month: 'Jun', vitality: 93, present: 93, late: 5, absent: 2 },
  { month: 'Jul', present: 95, late: 3, absent: 2 },
  { month: 'Aug', present: 96, late: 3, absent: 1 },
];

export const departmentDistributionData = [
  { name: 'Engineering', value: 34 },
  { name: 'Design', value: 12 },
  { name: 'Product', value: 9 },
  { name: 'HR', value: 6 },
  { name: 'Finance', value: 5 },
  { name: 'Sales & Ops', value: 14 },
];

export const payrollExpenditureData = [
  { month: 'Mar', total: 540000, taxes: 112000, bonus: 35000 },
  { month: 'Apr', total: 550000, taxes: 115000, bonus: 40000 },
  { month: 'May', total: 565000, taxes: 118000, bonus: 42000 },
  { month: 'Jun', total: 575000, taxes: 120000, bonus: 50000 },
  { month: 'Jul', total: 580000, taxes: 122000, bonus: 45000 },
  { month: 'Aug', total: 595000, taxes: 125000, bonus: 60000 },
];

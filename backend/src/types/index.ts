export type UserRole = 'admin' | 'hr_officer' | 'employee';

export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Inactive';

export type AttendanceStatus = 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent';

export type LeaveType =
  | 'Paid Time Off (Annual)'
  | 'Sick Time Off'
  | 'Casual Leave'
  | 'Parental Leave'
  | 'Unpaid Leave';

export type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';

export type PayrollStatus = 'Paid' | 'Processing' | 'Pending';

export interface WorkInfo {
  department: string;
  jobPosition: string;
  manager: string;
  workLocation: string;
  workAddress: string;
  workSchedule: string;
  joinDate: string;
}

export interface PrivateInfo {
  dateOfBirth?: string;
  address: string;
  nationality?: string;
  privateEmail: string;
  gender?: string;
  maritalStatus?: string;
  dateOfJoining?: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscOrRouting: string;
  panNumber?: string;
  uanNumber?: string;
  empCode?: string;
  identificationNumber?: string;
  privatePhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface ResumeInfo {
  about: string;
  whatILove: string;
  interests: string;
  skills: string[];
  certifications: string[];
}

export interface SalaryBreakdown {
  wageType: 'Fixed wage';
  monthWage: number;
  yearlyWage: number;
  workingDaysWeek: number;
  breakTimeHours: number;
  basicSalary: number;
  basicPct: number;
  hra: number;
  hraPct: number;
  standardAllowance: number;
  standardAllowancePct: number;
  performanceBonus: number;
  performanceBonusPct: number;
  lta: number;
  ltaPct: number;
  fixedAllowance: number;
  fixedAllowancePct: number;
  pfEmployee: number;
  pfEmployeePct: number;
  pfEmployer: number;
  pfEmployerPct: number;
  professionalTax: number;
}

export interface HRSettings {
  badgeId: string;
  pinCode: string;
  role: UserRole;
  salary: number;
  userId?: string;
  loginId?: string;
  initialPassword?: string;
}

export interface LeaveBalance {
  casual: number;
  casualUsed: number;
  sick: number;
  sickUsed: number;
  annual: number;
  annualUsed: number;
  maternity: number;
  maternityUsed: number;
}

export interface Employee {
  id: string;
  employeeId: string;
  loginId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: EmployeeStatus;
  workInfo: WorkInfo;
  privateInfo: PrivateInfo;
  resumeInfo?: ResumeInfo;
  salaryBreakdown?: SalaryBreakdown;
  hrSettings: HRSettings;
  leaveBalance: LeaveBalance;
  attendanceToday?: AttendanceStatus;
}

export interface User {
  id: string;
  loginId?: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
  employeeId?: string;
  avatar?: string;
  companyName?: string;
  companyLogo?: string;
  phone?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  overtime: string;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  designation: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  bonus: number;
  providentFund: number;
  taxDeduction: number;
  otherDeductions: number;
  grossSalary: number;
  netSalary: number;
  status: PayrollStatus;
  payPeriod: string;
  paymentDate: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  type: 'attendance' | 'leave' | 'payroll' | 'employee';
}

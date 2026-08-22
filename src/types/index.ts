export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Inactive';

export type AttendanceStatus = 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent';

export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Annual Leave' | 'Paternity/Maternity' | 'Unpaid Leave';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export type PayrollStatus = 'Paid' | 'Processing' | 'Pending';

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
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  designation: string;
  status: EmployeeStatus;
  joinDate: string;
  phone: string;
  location: string;
  salary: number;
  manager: string;
  attendanceToday?: AttendanceStatus;
  leaveBalance: LeaveBalance;
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
  type: 'leave' | 'attendance' | 'payroll' | 'employee' | 'system';
}

export interface DepartmentSummary {
  name: string;
  headcount: number;
  lead: string;
  budget: number;
  color: string;
}

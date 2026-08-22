import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  ActivityLog,
  AttendanceStatus,
  LeaveStatus,
  PayrollStatus
} from '../types';
import {
  initialEmployees,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialPayrollRecords,
  initialActivities
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { generateLoginId, generateInitialPassword } from '../utils/idGenerator';

interface HRMSContextType {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payrollRecords: PayrollRecord[];
  activities: ActivityLog[];
  isPunchedIn: boolean;
  workSeconds: number;
  togglePunch: (badgeOrPin?: string) => Promise<void>;
  addEmployee: (emp: Partial<Employee>) => Promise<Employee>;
  updateEmployee: (id: string, emp: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  submitLeaveRequest: (req: { leaveType: any; startDate: string; endDate: string; reason: string; totalDays: number }) => Promise<void>;
  updateLeaveStatus: (requestId: string, newStatus: LeaveStatus) => Promise<void>;
  updatePayrollStatus: (payrollId: string, newStatus: PayrollStatus) => Promise<void>;
  stats: {
    totalEmployees: number;
    presentToday: number;
    onLeaveToday: number;
    pendingLeaves: number;
    payrollProcessing: number;
    attendanceRate: number;
  };
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

export const HRMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('dayflow_employees_v3');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('dayflow_attendance_v3');
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('dayflow_leaves_v3');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('dayflow_payroll_v3');
    return saved ? JSON.parse(saved) : initialPayrollRecords;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('dayflow_activities_v3');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [isPunchedIn, setIsPunchedIn] = useState<boolean>(true);
  const [workSeconds, setWorkSeconds] = useState<number>(28500);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dayflow_employees_v3', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('dayflow_attendance_v3', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('dayflow_leaves_v3', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('dayflow_payroll_v3', JSON.stringify(payrollRecords));
  }, [payrollRecords]);

  // Shift timer
  useEffect(() => {
    let interval: any;
    if (isPunchedIn) {
      interval = setInterval(() => {
        setWorkSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn]);

  const togglePunch = async (badgeOrPin?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const empId = user?.employeeId || 'DF-1001';
    const activeEmp = employees.find(e => e.employeeId === empId) || employees[0];

    try {
      await fetch('/api/attendance/punch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: activeEmp.employeeId,
          badgeId: badgeOrPin,
          pinCode: badgeOrPin
        })
      });
    } catch (e) {
      // client fallback
    }

    if (isPunchedIn) {
      setIsPunchedIn(false);
      const hours = Math.floor(workSeconds / 3600);
      const mins = Math.floor((workSeconds % 3600) / 60);
      const formatted = `${hours}h ${mins}m`;

      setAttendanceRecords((prev) =>
        prev.map((rec) =>
          rec.employeeId === activeEmp.employeeId && rec.date === new Date().toISOString().split('T')[0]
            ? { ...rec, checkOut: timeStr, workHours: formatted }
            : rec
        )
      );

      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          user: activeEmp.name,
          avatar: activeEmp.avatar,
          action: 'punched out at',
          target: `${timeStr} (${formatted} worked)`,
          time: 'Just now',
          type: 'attendance'
        },
        ...prev
      ]);
    } else {
      setIsPunchedIn(true);
      setWorkSeconds(0);

      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: activeEmp.employeeId,
        employeeName: activeEmp.name,
        employeeAvatar: activeEmp.avatar,
        department: activeEmp.workInfo.department,
        date: new Date().toISOString().split('T')[0],
        checkIn: timeStr,
        checkOut: '--:--',
        workHours: '0h 01m (Active)',
        overtime: '0h 00m',
        status: 'Present'
      };

      setAttendanceRecords((prev) => [newRecord, ...prev.filter(r => !(r.employeeId === activeEmp.employeeId && r.date === newRecord.date))]);

      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          user: activeEmp.name,
          avatar: activeEmp.avatar,
          action: 'punched in at',
          target: timeStr,
          time: 'Just now',
          type: 'attendance'
        },
        ...prev
      ]);
    }
  };

  const addEmployee = async (empData: Partial<Employee>): Promise<Employee> => {
    const fullName = empData.name || 'New Team Member';
    const joinYear = empData.workInfo?.joinDate ? new Date(empData.workInfo.joinDate).getFullYear() : new Date().getFullYear();
    const serialNum = employees.length + 1;
    const company = user?.companyName || 'Odoo India';

    // System-generated Login ID: [OI][JODO][2022][0001]
    const calculatedLoginId = empData.loginId || generateLoginId(fullName, joinYear, serialNum, company);
    const initialTempPassword = generateInitialPassword();

    let created: Employee;
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...empData,
          loginId: calculatedLoginId,
          initialPassword: initialTempPassword
        })
      });
      if (res.ok) {
        created = await res.json();
        setEmployees((prev) => [created, ...prev]);
        return created;
      }
    } catch (e) {
      // fallback
    }

    const newEmpId = empData.employeeId || `DF-${Math.floor(1000 + Math.random() * 9000)}`;
    created = {
      id: `emp-${Date.now()}`,
      employeeId: newEmpId,
      loginId: calculatedLoginId,
      name: fullName,
      email: empData.email || 'employee@dayflow.io',
      phone: empData.phone || '+1 (555) 000-0000',
      avatar: empData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: empData.status || 'Active',
      workInfo: {
        department: empData.workInfo?.department || 'Engineering',
        jobPosition: empData.workInfo?.jobPosition || 'Software Engineer',
        manager: empData.workInfo?.manager || 'Elena Rostova',
        workLocation: empData.workInfo?.workLocation || 'San Francisco HQ',
        workAddress: empData.workInfo?.workAddress || '100 Montgomery St, San Francisco, CA',
        workSchedule: empData.workInfo?.workSchedule || 'Standard 40 Hours',
        joinDate: empData.workInfo?.joinDate || new Date().toISOString().split('T')[0]
      },
      privateInfo: {
        privateEmail: empData.privateInfo?.privateEmail || empData.email || '',
        privatePhone: empData.privateInfo?.privatePhone || empData.phone || '',
        emergencyContactName: empData.privateInfo?.emergencyContactName || 'Family Contact',
        emergencyContactPhone: empData.privateInfo?.emergencyContactPhone || '',
        bankName: empData.privateInfo?.bankName || 'National Bank',
        bankAccountNumber: empData.privateInfo?.bankAccountNumber || '•••• •••• 0000',
        bankIfscOrRouting: empData.privateInfo?.bankIfscOrRouting || 'NAT0001',
        identificationNumber: empData.privateInfo?.identificationNumber || 'SSN-000-00-0000',
        address: empData.privateInfo?.address || 'San Francisco, CA'
      },
      hrSettings: {
        badgeId: empData.hrSettings?.badgeId || `BADGE-${Math.floor(1000 + Math.random() * 9000)}`,
        pinCode: empData.hrSettings?.pinCode || `${Math.floor(1000 + Math.random() * 9000)}`,
        role: empData.hrSettings?.role || 'employee',
        salary: empData.hrSettings?.salary || 100000,
        loginId: calculatedLoginId,
        initialPassword: initialTempPassword
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

    setEmployees((prev) => [created, ...prev]);
    return created;
  };

  const updateEmployee = async (id: string, empData: Partial<Employee>): Promise<Employee> => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empData)
      });
      if (res.ok) {
        const updated = await res.json();
        setEmployees((prev) => prev.map((e) => (e.id === id || e.employeeId === id ? updated : e)));
        return updated;
      }
    } catch (e) {
      // fallback
    }

    let updated: Employee | undefined;
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id || e.employeeId === id) {
          updated = {
            ...e,
            ...empData,
            workInfo: { ...e.workInfo, ...(empData.workInfo || {}) },
            privateInfo: { ...e.privateInfo, ...(empData.privateInfo || {}) },
            hrSettings: { ...e.hrSettings, ...(empData.hrSettings || {}) }
          };
          return updated;
        }
        return e;
      })
    );
    return updated || (empData as Employee);
  };

  const deleteEmployee = async (id: string) => {
    try {
      await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setEmployees((prev) => prev.filter((e) => e.id !== id && e.employeeId !== id));
  };

  const submitLeaveRequest = async (req: { leaveType: any; startDate: string; endDate: string; reason: string; totalDays: number }) => {
    const empId = user?.employeeId || 'DF-1001';
    const activeEmp = employees.find(e => e.employeeId === empId) || employees[0];

    const newLeave: LeaveRequest = {
      id: `lv-${Date.now()}`,
      employeeId: activeEmp.employeeId,
      employeeName: activeEmp.name,
      employeeAvatar: activeEmp.avatar,
      department: activeEmp.workInfo.department,
      leaveType: req.leaveType,
      startDate: req.startDate,
      endDate: req.endDate,
      totalDays: req.totalDays,
      reason: req.reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests((prev) => [newLeave, ...prev]);
  };

  const updateLeaveStatus = async (requestId: string, newStatus: LeaveStatus) => {
    try {
      await fetch(`/api/leaves/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reviewedBy: user?.name || 'Admin' })
      });
    } catch (e) {}

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: newStatus, reviewedBy: user?.name || 'Admin', reviewDate: new Date().toISOString().split('T')[0] }
          : r
      )
    );
  };

  const updatePayrollStatus = async (payrollId: string, newStatus: PayrollStatus) => {
    setPayrollRecords((prev) =>
      prev.map((p) =>
        p.id === payrollId
          ? {
              ...p,
              status: newStatus,
              paymentDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : p.paymentDate
            }
          : p
      )
    );
  };

  const totalEmployees = employees.length;
  const presentToday = attendanceRecords.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const onLeaveToday = attendanceRecords.filter((a) => a.status === 'On Leave').length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  const payrollProcessing = payrollRecords.filter((p) => p.status === 'Processing').length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 96;

  return (
    <HRMSContext.Provider
      value={{
        employees,
        attendanceRecords,
        leaveRequests,
        payrollRecords,
        activities,
        isPunchedIn,
        workSeconds,
        togglePunch,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        submitLeaveRequest,
        updateLeaveStatus,
        updatePayrollStatus,
        stats: {
          totalEmployees,
          presentToday,
          onLeaveToday,
          pendingLeaves,
          payrollProcessing,
          attendanceRate
        }
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const ctx = useContext(HRMSContext);
  if (!ctx) throw new Error('useHRMS must be used within HRMSProvider');
  return ctx;
};

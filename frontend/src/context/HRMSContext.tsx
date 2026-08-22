import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { api } from '../services/api';

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
  refreshAllData: () => Promise<void>;
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
  const currentEmpId = user?.employeeId || 'DF-1001';

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

  const [activities, setActivities] = useState<ActivityLog[]>(initialActivities);

  // Per-Employee Isolated Punch Status & Stopwatch
  const [isPunchedIn, setIsPunchedIn] = useState<boolean>(() => {
    return localStorage.getItem(`dayflow_punched_in_${currentEmpId}`) === 'true';
  });

  const [workSeconds, setWorkSeconds] = useState<number>(() => {
    return Number(localStorage.getItem(`dayflow_work_seconds_${currentEmpId}`) || 0);
  });

  // Fetch all live data from SQLite backend API
  const refreshAllData = useCallback(async () => {
    try {
      const [empsData, attData, leavesData, payData] = await Promise.allSettled([
        api.getEmployees(),
        api.getAttendance(),
        api.getLeaves(),
        api.getPayroll()
      ]);

      if (empsData.status === 'fulfilled' && Array.isArray(empsData.value) && empsData.value.length > 0) {
        setEmployees(empsData.value);
        localStorage.setItem('dayflow_employees_v3', JSON.stringify(empsData.value));
      }
      if (attData.status === 'fulfilled' && Array.isArray(attData.value) && attData.value.length > 0) {
        setAttendanceRecords(attData.value);
        localStorage.setItem('dayflow_attendance_v3', JSON.stringify(attData.value));
      }
      if (leavesData.status === 'fulfilled' && Array.isArray(leavesData.value) && leavesData.value.length > 0) {
        setLeaveRequests(leavesData.value);
        localStorage.setItem('dayflow_leaves_v3', JSON.stringify(leavesData.value));
      }
      if (payData.status === 'fulfilled' && Array.isArray(payData.value) && payData.value.length > 0) {
        setPayrollRecords(payData.value);
        localStorage.setItem('dayflow_payroll_v3', JSON.stringify(payData.value));
      }
    } catch (err) {
      console.warn('Failed to fetch data from SQLite API:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Synchronize Punch status & seconds per active employee when switching accounts
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const userTodayRecord = attendanceRecords.find(
      (r) => r.employeeId === currentEmpId && r.date === today && (r.checkOut === '--' || !r.checkOut)
    );

    const isEmpPunchedIn = !!userTodayRecord || localStorage.getItem(`dayflow_punched_in_${currentEmpId}`) === 'true';
    setIsPunchedIn(isEmpPunchedIn);

    const savedSecs = Number(localStorage.getItem(`dayflow_work_seconds_${currentEmpId}`) || 0);
    setWorkSeconds(savedSecs);
  }, [currentEmpId, attendanceRecords]);

  // Live timer for currently active punched-in employee
  useEffect(() => {
    let interval: any;
    if (isPunchedIn) {
      interval = setInterval(() => {
        setWorkSeconds((prev) => {
          const next = prev + 1;
          localStorage.setItem(`dayflow_work_seconds_${currentEmpId}`, next.toString());
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn, currentEmpId]);

  const addActivity = (action: string, target: string, type: 'attendance' | 'leave' | 'payroll' | 'employee') => {
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: user?.name || 'Administrator',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      action,
      target,
      time: 'Just now',
      type
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  const togglePunch = async (badgeOrPin?: string) => {
    const nextState = !isPunchedIn;
    setIsPunchedIn(nextState);
    localStorage.setItem(`dayflow_punched_in_${currentEmpId}`, nextState.toString());

    if (nextState) {
      addActivity('checked IN at', new Date().toLocaleTimeString(), 'attendance');
    } else {
      addActivity('checked OUT at', new Date().toLocaleTimeString(), 'attendance');
    }

    try {
      await api.punchAttendance({
        employeeId: currentEmpId,
        badgeOrPin,
        name: user?.name,
        avatar: user?.avatar
      });
      await refreshAllData();
    } catch (err) {
      console.warn('Backend punch sync:', err);
    }
  };

  const addEmployee = async (empData: Partial<Employee>): Promise<Employee> => {
    try {
      const result = await api.createEmployee(empData);
      addActivity('provisioned employee profile for', result.employee.name, 'employee');
      await refreshAllData();
      return result.employee;
    } catch (err) {
      console.warn('API error creating employee, creating locally:', err);
      const newEmp = empData as Employee;
      setEmployees((prev) => [newEmp, ...prev]);
      return newEmp;
    }
  };

  const updateEmployee = async (id: string, empData: Partial<Employee>): Promise<Employee> => {
    try {
      const result = await api.updateEmployee(id, empData);
      addActivity('updated employee profile for', result.employee.name, 'employee');
      await refreshAllData();
      return result.employee;
    } catch (err) {
      console.warn('API error updating employee:', err);
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...empData } : e)));
      return empData as Employee;
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    try {
      await api.deleteEmployee(id);
      addActivity('removed employee record with ID', id, 'employee');
      await refreshAllData();
    } catch (err) {
      console.warn('API error deleting employee:', err);
      setEmployees((prev) => prev.filter((e) => e.id !== id && e.employeeId !== id));
    }
  };

  const submitLeaveRequest = async (req: {
    leaveType: any;
    startDate: string;
    endDate: string;
    reason: string;
    totalDays: number;
  }) => {
    try {
      await api.submitLeave({
        employeeId: currentEmpId,
        employeeName: user?.name,
        employeeAvatar: user?.avatar,
        department: 'General',
        leaveType: req.leaveType,
        startDate: req.startDate,
        endDate: req.endDate,
        totalDays: req.totalDays,
        reason: req.reason
      });
      addActivity('submitted time off request for', req.leaveType, 'leave');
      await refreshAllData();
    } catch (err) {
      console.warn('API error submitting leave:', err);
    }
  };

  const updateLeaveStatus = async (requestId: string, newStatus: LeaveStatus) => {
    try {
      await api.updateLeaveStatus(requestId, newStatus, user?.name || 'Administrator');
      addActivity(`${newStatus.toLowerCase()} time off request for`, requestId, 'leave');
      await refreshAllData();
    } catch (err) {
      console.warn('API error updating leave status:', err);
      setLeaveRequests((prev) =>
        prev.map((l) => (l.id === requestId ? { ...l, status: newStatus } : l))
      );
    }
  };

  const updatePayrollStatus = async (payrollId: string, newStatus: PayrollStatus) => {
    try {
      await api.updatePayrollStatus(payrollId, newStatus);
      addActivity(`updated payroll record status to ${newStatus} for`, payrollId, 'payroll');
      await refreshAllData();
    } catch (err) {
      console.warn('API error updating payroll status:', err);
      setPayrollRecords((prev) =>
        prev.map((p) => (p.id === payrollId ? { ...p, status: newStatus } : p))
      );
    }
  };

  const presentCount = attendanceRecords.filter((r) => r.status === 'Present').length;
  const onLeaveCount = leaveRequests.filter((l) => l.status === 'Approved').length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'Pending').length;
  const payrollProcessingCount = payrollRecords.filter((p) => p.status === 'Processing').length;

  const stats = {
    totalEmployees: employees.length,
    presentToday: presentCount || employees.filter((e) => e.attendanceToday === 'Present').length,
    onLeaveToday: onLeaveCount || employees.filter((e) => e.attendanceToday === 'On Leave').length,
    pendingLeaves: pendingLeavesCount,
    payrollProcessing: payrollProcessingCount,
    attendanceRate: employees.length > 0 ? Math.round((presentCount / employees.length) * 100) : 96
  };

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
        refreshAllData,
        stats
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};

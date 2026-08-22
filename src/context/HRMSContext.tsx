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

interface HRMSContextType {
  role: 'admin' | 'employee';
  setRole: (role: 'admin' | 'employee') => void;
  currentUser: Employee;
  setCurrentUser: (emp: Employee) => void;
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payrollRecords: PayrollRecord[];
  activities: ActivityLog[];
  isPunchedIn: boolean;
  punchInTime: string | null;
  workSeconds: number;
  togglePunch: () => void;
  addEmployee: (employee: Omit<Employee, 'id' | 'leaveBalance'>) => void;
  submitLeaveRequest: (req: { leaveType: any; startDate: string; endDate: string; reason: string; totalDays: number }) => void;
  updateLeaveStatus: (requestId: string, newStatus: LeaveStatus) => void;
  updatePayrollStatus: (payrollId: string, newStatus: PayrollStatus) => void;
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
  const [role, setRole] = useState<'admin' | 'employee'>('admin');
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('dayflow_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [currentUser, setCurrentUser] = useState<Employee>(() => employees[0] || initialEmployees[0]);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('dayflow_attendance');
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('dayflow_leaves');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('dayflow_payroll');
    return saved ? JSON.parse(saved) : initialPayrollRecords;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('dayflow_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [isPunchedIn, setIsPunchedIn] = useState<boolean>(true);
  const [punchInTime, setPunchInTime] = useState<string | null>('08:55 AM');
  const [workSeconds, setWorkSeconds] = useState<number>(28500); // 7h 55m

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dayflow_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('dayflow_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('dayflow_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('dayflow_payroll', JSON.stringify(payrollRecords));
  }, [payrollRecords]);

  // Work timer tick
  useEffect(() => {
    let interval: any;
    if (isPunchedIn) {
      interval = setInterval(() => {
        setWorkSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn]);

  const togglePunch = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isPunchedIn) {
      // Punch Out
      setIsPunchedIn(false);
      const hours = Math.floor(workSeconds / 3600);
      const mins = Math.floor((workSeconds % 3600) / 60);
      const formattedDuration = `${hours}h ${mins}m`;

      setAttendanceRecords((prev) =>
        prev.map((rec) =>
          rec.employeeId === currentUser.employeeId && rec.date === new Date().toISOString().split('T')[0]
            ? { ...rec, checkOut: timeString, workHours: formattedDuration }
            : rec
        )
      );

      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          avatar: currentUser.avatar,
          action: 'punched out at',
          target: `${timeString} (${formattedDuration} worked)`,
          time: 'Just now',
          type: 'attendance'
        },
        ...prev
      ]);
    } else {
      // Punch In
      setIsPunchedIn(true);
      setPunchInTime(timeString);
      setWorkSeconds(0);

      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        employeeAvatar: currentUser.avatar,
        department: currentUser.department,
        date: new Date().toISOString().split('T')[0],
        checkIn: timeString,
        checkOut: '--:--',
        workHours: '0h 01m (Active)',
        overtime: '0h 00m',
        status: 'Present'
      };

      setAttendanceRecords((prev) => [newRecord, ...prev.filter(r => !(r.employeeId === currentUser.employeeId && r.date === newRecord.date))]);

      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          avatar: currentUser.avatar,
          action: 'punched in at',
          target: `${timeString}`,
          time: 'Just now',
          type: 'attendance'
        },
        ...prev
      ]);
    }
  };

  const addEmployee = (empData: Omit<Employee, 'id' | 'leaveBalance'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
      leaveBalance: {
        casual: 12,
        casualUsed: 0,
        sick: 10,
        sickUsed: 0,
        annual: 18,
        annualUsed: 0,
        maternity: 30,
        maternityUsed: 0
      }
    };
    setEmployees((prev) => [newEmp, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        action: 'added new team member',
        target: `${newEmp.name} (${newEmp.department})`,
        time: 'Just now',
        type: 'employee'
      },
      ...prev
    ]);
  };

  const submitLeaveRequest = (req: { leaveType: any; startDate: string; endDate: string; reason: string; totalDays: number }) => {
    const newLeave: LeaveRequest = {
      id: `lv-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      department: currentUser.department,
      leaveType: req.leaveType,
      startDate: req.startDate,
      endDate: req.endDate,
      totalDays: req.totalDays,
      reason: req.reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests((prev) => [newLeave, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: currentUser.name,
        avatar: currentUser.avatar,
        action: 'applied for leave',
        target: `${req.totalDays} days (${req.leaveType})`,
        time: 'Just now',
        type: 'leave'
      },
      ...prev
    ]);
  };

  const updateLeaveStatus = (requestId: string, newStatus: LeaveStatus) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: newStatus, reviewedBy: currentUser.name, reviewDate: new Date().toISOString().split('T')[0] }
          : r
      )
    );

    const targetReq = leaveRequests.find(r => r.id === requestId);
    if (targetReq) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          avatar: currentUser.avatar,
          action: `${newStatus.toLowerCase()} leave request for`,
          target: `${targetReq.employeeName} (${targetReq.totalDays} days)`,
          time: 'Just now',
          type: 'leave'
        },
        ...prev
      ]);
    }
  };

  const updatePayrollStatus = (payrollId: string, newStatus: PayrollStatus) => {
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
  const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 95;

  return (
    <HRMSContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        employees,
        attendanceRecords,
        leaveRequests,
        payrollRecords,
        activities,
        isPunchedIn,
        punchInTime,
        workSeconds,
        togglePunch,
        addEmployee,
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
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};

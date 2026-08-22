import {
  Employee,
  User,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  LeaveStatus,
  PayrollStatus
} from '../types';

const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('dayflow_token');
  }

  // Robust XHR request engine that is immune to browser extension monkeypatching bugs
  private request<T>(endpoint: string, options: { method?: string; body?: any; headers?: Record<string, string> } = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      const url = `${API_BASE_URL}${endpoint}`;
      const method = options.method || 'GET';
      const token = this.getToken();

      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      if (options.headers) {
        Object.entries(options.headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
      }

      xhr.onload = () => {
        try {
          const parsed = JSON.parse(xhr.responseText || '{}');
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(parsed as T);
          } else {
            reject(new Error(parsed.error || `HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        } catch (e) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({} as T);
          } else {
            reject(new Error(`Server response error (${xhr.status})`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error: unable to reach API server at ' + API_BASE_URL));
      };

      if (options.body) {
        xhr.send(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      } else {
        xhr.send();
      }
    });
  }

  // Auth APIs
  async login(loginIdOrEmail: string, password: string): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: { loginIdOrEmail, password }
    });
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    companyName?: string;
    companyLogo?: string;
    phone?: string;
  }): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: data
    });
  }

  async changePassword(data: {
    userId?: string;
    loginId?: string;
    currentPassword?: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: data
    });
  }

  // Employees APIs
  async getEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>('/employees');
  }

  async getEmployeeById(id: string): Promise<Employee> {
    return this.request<Employee>(`/employees/${id}`);
  }

  async createEmployee(employeeData: Partial<Employee>): Promise<{
    message: string;
    employee: Employee;
    generatedCredentials: { loginId: string; tempPassword: string };
  }> {
    return this.request<{
      message: string;
      employee: Employee;
      generatedCredentials: { loginId: string; tempPassword: string };
    }>('/employees', {
      method: 'POST',
      body: employeeData
    });
  }

  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<{
    message: string;
    employee: Employee;
  }> {
    return this.request<{ message: string; employee: Employee }>(`/employees/${id}`, {
      method: 'PUT',
      body: employeeData
    });
  }

  async deleteEmployee(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/employees/${id}`, {
      method: 'DELETE'
    });
  }

  // Attendance APIs
  async getAttendance(query?: { employeeId?: string; date?: string }): Promise<AttendanceRecord[]> {
    const params = new URLSearchParams();
    if (query?.employeeId) params.append('employeeId', query.employeeId);
    if (query?.date) params.append('date', query.date);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<AttendanceRecord[]>(`/attendance${queryString}`);
  }

  async punchAttendance(data: {
    employeeId?: string;
    badgeOrPin?: string;
    name?: string;
    department?: string;
    avatar?: string;
  }): Promise<{ action: string; message: string; record: AttendanceRecord }> {
    return this.request<{ action: string; message: string; record: AttendanceRecord }>('/attendance/punch', {
      method: 'POST',
      body: data
    });
  }

  // Leaves APIs
  async getLeaves(query?: { employeeId?: string }): Promise<LeaveRequest[]> {
    const params = new URLSearchParams();
    if (query?.employeeId) params.append('employeeId', query.employeeId);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<LeaveRequest[]>(`/leaves${queryString}`);
  }

  async submitLeave(leaveData: {
    employeeId?: string;
    employeeName?: string;
    employeeAvatar?: string;
    department?: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
  }): Promise<{ message: string; leave: LeaveRequest }> {
    return this.request<{ message: string; leave: LeaveRequest }>('/leaves', {
      method: 'POST',
      body: leaveData
    });
  }

  async updateLeaveStatus(
    id: string,
    status: LeaveStatus,
    reviewedBy?: string
  ): Promise<{ message: string; leave: LeaveRequest }> {
    return this.request<{ message: string; leave: LeaveRequest }>(`/leaves/${id}/status`, {
      method: 'PUT',
      body: { status, reviewedBy }
    });
  }

  // Payroll APIs
  async getPayroll(query?: { employeeId?: string }): Promise<PayrollRecord[]> {
    const params = new URLSearchParams();
    if (query?.employeeId) params.append('employeeId', query.employeeId);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<PayrollRecord[]>(`/payroll${queryString}`);
  }

  async updatePayrollStatus(
    id: string,
    status: PayrollStatus
  ): Promise<{ message: string; record: PayrollRecord }> {
    return this.request<{ message: string; record: PayrollRecord }>(`/payroll/${id}/status`, {
      method: 'PUT',
      body: { status }
    });
  }
}

export const api = new ApiService();

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HRMSProvider } from './context/HRMSContext';
import { AppLayout } from './components/layout/AppLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployeeDirectory } from './pages/EmployeeDirectory';
import { Attendance } from './pages/Attendance';
import { TimeOff } from './pages/TimeOff';
import { Payroll } from './pages/Payroll';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <HRMSProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="employee-portal" element={<EmployeeDashboard />} />
            <Route path="directory" element={<EmployeeDirectory />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="time-off" element={<TimeOff />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HRMSProvider>
  );
};

export default App;

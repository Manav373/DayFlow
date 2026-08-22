import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRMSProvider } from './context/HRMSContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployeeDirectory } from './pages/EmployeeDirectory';
import { EmployeeDetail } from './pages/EmployeeDetail';
import { Attendance } from './pages/Attendance';
import { TimeOff } from './pages/TimeOff';
import { Payroll } from './pages/Payroll';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <HRMSProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<ProtectedLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="employee-portal" element={<EmployeeDashboard />} />
              <Route path="directory" element={<EmployeeDirectory />} />
              <Route path="employee/:id" element={<EmployeeDetail />} />
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
    </AuthProvider>
  );
};

export default App;

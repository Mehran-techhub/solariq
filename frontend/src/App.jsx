import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';
import GuestRoute from './components/routing/GuestRoute';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Prediction from './pages/Prediction';
import Simulation from './pages/Simulation';
import Reports from './pages/Reports';
import Weather from './pages/Weather';
import Settings from './pages/Settings';
import Maintenance from './pages/Maintenance';
import Notifications from './pages/Notifications';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminActivity from './pages/admin/AdminActivity';
import AdminSystem from './pages/admin/AdminSystem';
import AdminSolarRecords from './pages/admin/AdminSolarRecords';
import AdminPredictions from './pages/admin/AdminPredictions';
import AdminReportsList from './pages/admin/AdminReportsList';
import AdminWeatherData from './pages/admin/AdminWeatherData';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<GuestRoute><Landing /></GuestRoute>} path="/" />
          <Route element={<GuestRoute><Login /></GuestRoute>} path="/login" />
          <Route element={<GuestRoute><Register /></GuestRoute>} path="/register" />

          {/* User routes */}
          <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/activity" element={<AdminActivity />} />
            <Route path="/admin/system" element={<AdminSystem />} />
            <Route path="/admin/solar-records" element={<AdminSolarRecords />} />
            <Route path="/admin/predictions" element={<AdminPredictions />} />
            <Route path="/admin/reports" element={<AdminReportsList />} />
            <Route path="/admin/weather" element={<AdminWeatherData />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
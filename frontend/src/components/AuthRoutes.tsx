import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

export default function AdminRoutes() {
  const { token, role } = useAuth();

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role !== 'ADMIN') {
    // Logged in, but NOT an admin
    return <Navigate to="/dashboard" replace />; // Send to their dashboard
  }

  // Logged in AND is an admin
  return <Outlet />;
}
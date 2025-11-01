import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

export default function ProtectedRoutes() {
  const { token } = useAuth();

  if (!token) {
    // If no token exists, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If a token exists, render the child component (e.g., Dashboard)
  return <Outlet />;
}
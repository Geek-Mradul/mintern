import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout and Pages
import Layout from './components/layout/Layout.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ProtectedRoutes from './components/ProtectedRoutes.tsx';
import MyApplications from './pages/MyApplications.tsx';
import Profile from './pages/Profile.tsx';
import AdminRoutes from './components/AdminRoutes.tsx'; // 1. Import
import AdminDashboard from './pages/AdminDashboard.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Protected routes (for normal users) */}
        <Route element={<ProtectedRoutes />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-applications" element={<MyApplications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Protected routes (for ADMINS only) */}
        <Route element={<AdminRoutes />}> {/* 3. Add this */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>

      </Route>
    </Routes>
  );
}
export default App;
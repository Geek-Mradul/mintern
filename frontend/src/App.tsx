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

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}> {/* 2. Wrap */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-applications" element={<MyApplications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
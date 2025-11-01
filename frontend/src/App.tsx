import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout and Pages
import Layout from './components/layout/Layout.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ProtectedRoutes from './components/ProtectedRoutes.tsx';

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
          {/* Add other protected routes here */}
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
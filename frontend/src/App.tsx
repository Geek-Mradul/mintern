import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout and Pages
import Layout from './components/layout/Layout.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Dashboard from './pages/Dashboard.tsx';

function App() {
  return (
    <Routes>
      {/* All pages will now use the Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* Add more routes here as needed */}
      </Route>
    </Routes>
  );
}

export default App;
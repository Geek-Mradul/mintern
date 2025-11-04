import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx'; // 1. Import

export default function Navbar() {
  const { token, role, setToken } = useAuth(); // 2. Get token and role

  // Basic logout handler
  const handleLogout = () => {
    setToken(null);
    // We can add navigate('/') here if needed
  };

  return (
    <nav style={{ padding: '1rem', background: '#eee', display: 'flex', alignItems: 'center' }}>
      <div style={{ flexGrow: 1 }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Mintern</Link>
        <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/my-applications" style={{ marginRight: '1rem' }}>My Applications</Link>
        <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>

        {/* 3. Conditional Admin Link */}
        {role === 'ADMIN' && (
          <Link to="/admin/dashboard" style={{ marginRight: '1rem', color: 'red' }}>Admin</Link>
        )}
      </div>

      {/* 4. Conditional Login/Logout */}
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}
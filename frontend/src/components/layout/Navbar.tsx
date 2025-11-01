import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Mintern</Link>
      <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
      <Link to="/signup" style={{ marginRight: '1rem' }}>Signup</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}
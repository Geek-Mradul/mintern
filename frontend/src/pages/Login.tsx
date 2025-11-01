import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import './AuthForms.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken } = useAuth(); // Get the setToken function
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Send data to the backend login route
      const response = await apiClient.post('/auth/login', { email, password }); // 

      // On success, get the token from the response
      const { token } = response.data;

      // Save the token in our context (which saves to localStorage)
      setToken(token); // 

      // Redirect to the dashboard
      navigate('/dashboard');

    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
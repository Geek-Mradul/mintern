import { useState, useEffect } from 'react';
import apiClient from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

// Define types for our stats
interface Stats {
  userCount: number;
  projectCount: number;
  appCount: number;
}
interface CategoryStat {
  name: string;
  count: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch both endpoints
        const statsRes = await apiClient.get('/analytics/stats', { headers });
        const catRes = await apiClient.get('/analytics/categories', { headers });

        setStats(statsRes.data);
        setCategoryData(catRes.data);
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  if (isLoading) return <p>Loading analytics...</p>;
  if (!stats) return <p>Could not load data.</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Stat Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>{stats.userCount}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.projectCount}</h3>
          <p>Total Projects</p>
        </div>
        <div className="stat-card">
          <h3>{stats.appCount}</h3>
          <p>Total Applications</p>
        </div>
      </div>

      {/* Category Chart */}
      <h3>Projects by Category</h3>
      <div className="chart-container" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
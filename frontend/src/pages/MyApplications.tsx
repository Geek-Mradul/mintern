import { useState, useEffect } from 'react';
import apiClient from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import './MyApplications.css';

// Define the types
interface ApplicationProject {
  id: string;
  title: string;
  category: string | null;
}

interface Application {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  project: ApplicationProject;
}

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        // Fetch from the /applications/me endpoint 
        const response = await apiClient.get('/applications/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(response.data.applications);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  if (isLoading) {
    return <p>Loading your applications...</p>;
  }

  return (
    <div>
      <h2>My Applications</h2>
      <div className="application-list">
        {applications.length > 0 ? (
          applications.map(app => (
            <div key={app.id} className="application-item">
              <div className="application-item-info">
                <h4>{app.project.title}</h4>
                <p>Category: {app.project.category || 'N/A'}</p>
                <p>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
              {/* Visual Status Indicator */}
              <span className={`status status-${app.status}`}>
                {app.status}
              </span>
            </div>
          ))
        ) : (
          <p>You have not applied to any projects yet.</p>
        )}
      </div>
    </div>
  );
}
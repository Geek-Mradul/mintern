import { useState, useEffect } from 'react';
import apiClient from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import CreateProjectForm from '../components/projects/CreateProjectForm.tsx';
import ProjectCard from '../components/projects/ProjectCard.tsx';
import './Home.css'; // Reuse project grid styles

// Define the Project type
interface Project {
  id: string;
  title: string;
  description: string;
  category: string | null;
  author: {
    name: string;
    role: string;
  };
}

export default function Dashboard() {
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const fetchMyProjects = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await apiClient.get('/projects/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch user projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, [token]);

  return (
    <div>
      <h2>My Dashboard</h2>

      {/* 1. Project Creation Form */}
      <CreateProjectForm onProjectCreated={fetchMyProjects} />

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. My Posted Projects List */}
      <h3>My Posted Projects</h3>
      {isLoading ? (
        <p>Loading your projects...</p>
      ) : (
        <div className="project-grid">
          {myProjects.length > 0 ? (
            myProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <p>You have not posted any projects yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
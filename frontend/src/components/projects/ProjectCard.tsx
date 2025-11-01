import './ProjectCard.css';
import { useAuth } from '../../context/AuthContext.tsx';
import apiClient from '../../api/axios.ts';
import { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string | null;
  // author may be absent in some API responses, make fields optional
  author?: {
    name?: string;
    role?: string;
  } | null;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { token } = useAuth(); // 3. Get token
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState('');

  const handleApply = async () => {
    if (!token) {
      alert('Please log in to apply.');
      return;
    }

    setIsApplying(true);
    setApplyError('');

    try {
      await apiClient.post(
        `/projects/${project.id}/apply`, // 
        {}, // No body needed
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Application successful!');
    } catch (err: any) {
      setApplyError(err.response?.data?.message || 'Failed to apply.');
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="card-footer">
        <span>Category: {project.category || 'N/A'}</span>
        <span>
          By: {project.author?.name ?? 'Unknown'} {project.author?.role === 'EXTERNAL' && '(External)'}
        </span>
      </div>

      {/* 4. Add this section */}
      <div className="card-actions">
        <button 
          className="apply-button"
          onClick={handleApply}
          disabled={isApplying}
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </button>
        {applyError && <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'right', margin: '0.5rem 0 0 0' }}>{applyError}</p>}
      </div>
    </div>
  );
}

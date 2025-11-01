import { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/axios.ts';
import ProjectCard from '../components/projects/ProjectCard.tsx';
import './Home.css'; // Import the CSS

// Define the Project type again (we can move this to a shared file later)
interface Project {
  id: string;
  title: string;
  description: string;
  category: string | null;
  author: {
    name: string;
    role: string;
  };
  // Add any other fields you fetch
}

export default function Home() {
  // --- State ---
  // Stores the master list of projects
  const [projects, setProjects] = useState<Project[]>([]);
  // Stores loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Stores the user's search and filter inputs
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // --- Data Fetching ---
  useEffect(() => {
    // Start your backend server (npm run dev)
    // Then run this frontend (npm run dev)
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/projects');
        setProjects(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch projects. Is the backend server running?');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []); // Empty array means this runs once on component mount

  // --- Filtering Logic ---
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Check if search term matches title or description
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Check if category matches (and ignore filter if 'All' is selected)
      const matchesCategory = !categoryFilter || project.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchTerm, categoryFilter]);

  // --- Render Logic ---
  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  // Get unique categories for the filter dropdown
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];

  return (
    <div>
      <h2>Project Feed</h2>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat!}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Project Grid */}
      <div className="project-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
}
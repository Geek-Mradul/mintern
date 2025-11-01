import { useState } from 'react';
import apiClient from '../../api/axios.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import '../../pages/AuthForms.css'; // We can reuse the form styles

// Define a prop to refetch projects after one is created
interface CreateProjectFormProps {
  onProjectCreated: () => void;
}

export default function CreateProjectForm({ onProjectCreated }: CreateProjectFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // For success messages
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description) {
      setError('Title and description are required.');
      return;
    }

    try {
      await apiClient.post(
        '/projects', // 
        { title, description, category },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token
          },
        }
      );

      setSuccess('Project created successfully!'); // 
      // Clear the form
      setTitle('');
      setDescription('');
      setCategory('');
      // Tell the parent (Dashboard) to refetch projects
      onProjectCreated(); // 

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} style={{ margin: '0 0 2rem 0' }}>
      <h3>Post a New Project</h3>
      {error && <p className="error-message">{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          placeholder="e.g., Web Development"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <button type="submit">Post Project</button>
    </form>
  );
}
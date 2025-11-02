import { useState, useEffect } from 'react';
import apiClient from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import './Profile.css';
import '../pages/AuthForms.css'; // Reuse form styles

// Define types
interface UserProfile {
  email: string;
  name: string;
  bio: string | null;
  skills: string[];
  role: string;
}

// (We can create shared types file later)
interface Project {
  id: string;
  title: string;
  description: string;
}

interface Application {
  id: string;
  status: string;
  project: { title: string };
}

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the edit form
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all data on load
  useEffect(() => {
    const fetchAllData = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch profile
        const profileRes = await apiClient.get('/users/me', { headers });
        setProfile(profileRes.data);
        setEditBio(profileRes.data.bio || '');
        setEditSkills(profileRes.data.skills.join(', ')); // Join array for text input

        // 2. Fetch posted projects
        const projectsRes = await apiClient.get('/projects/me', { headers });
        setProjects(projectsRes.data);

        // 3. Fetch applications
        const appsRes = await apiClient.get('/applications/me', { headers });
        setApplications(appsRes.data.applications);

      } catch (err) {
        console.error(err);
        setError('Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [token]);

  // Handle the profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const skillsArray = editSkills.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await apiClient.put(
        '/users/me',
        { bio: editBio, skills: skillsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (!profile) return <p>Could not load profile.</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{profile.name}</h2>
        <div className="profile-info">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Bio:</strong> {profile.bio || 'No bio set.'}</p>
          <div><strong>Skills:</strong>
            {profile.skills.length > 0 ? (
              <ul className="skills-list">
                {profile.skills.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            ) : ' No skills set.'}
          </div>
        </div>

        <button onClick={() => setIsEditing(!isEditing)} style={{ marginTop: '1rem' }}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form className="auth-form" onSubmit={handleProfileUpdate}>
          <h3>Edit Your Profile</h3>
          {error && <p className="error-message">{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills (comma separated)</label>
            <input
              type="text"
              id="skills"
              value={editSkills}
              onChange={(e) => setEditSkills(e.target.value)}
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      )}

      {/* Profile Lists */}
      <div className="profile-lists">
        <h3>My Posted Projects</h3>
        {projects.length > 0 ? (
          <ul>
            {projects.map(p => <li key={p.id}>{p.title}</li>)}
          </ul>
        ) : <p>You have not posted any projects.</p>}

        <h3>My Applications</h3>
        {applications.length > 0 ? (
          <ul>
            {applications.map(app => (
              <li key={app.id}>
                {app.project.title} - <strong>{app.status}</strong>
              </li>
            ))}
          </ul>
        ) : <p>You have not applied to any projects.</p>}
      </div>
    </div>
  );
}
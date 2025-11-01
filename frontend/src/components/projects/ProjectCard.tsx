import './ProjectCard.css';

// Define the shape of the project data
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

// Define the props for the component
interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="card-footer">
        <span>Category: {project.category || 'N/A'}</span>
        <span>By: {project.author.name} {project.author.role === 'EXTERNAL' && '(External)'}</span>
      </div>
    </div>
  );
}
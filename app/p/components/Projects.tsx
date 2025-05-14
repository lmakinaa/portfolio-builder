import { useState } from 'react';
import { Github as GitHub, ExternalLink, Code } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import ProjectCard from './ProjectCard';
import { Portfolio, Project } from '@/app/types';

const Projects = ({ projects }: Portfolio) => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const { isDarkMode } = useTheme();

  return (
    <section 
      id="projects" 
      className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? 'bg-[#0f1621]' : 'bg-gray-100'
      }`}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">
          <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Projects
          </span>
        </h2>
        <p className={`text-center mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          A collection of projects that showcase my skills and experience in software development.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index} 
              project={project} 
              index={index}
              isActive={activeProject === index}
              onClick={() => setActiveProject(activeProject === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
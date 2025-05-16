import { Github as GitHub, ExternalLink } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Project } from '@/app/types';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isActive, onClick }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-xl overflow-hidden group cursor-pointer transform transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800' 
          : 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg'
      } ${isActive ? 'lg:row-span-2' : ''}`}
      onClick={onClick}
    >
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {project.title}
        </h3>
        
        <div className="mb-4">
          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isActive ? project.description : `${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}`}
          </p>
          
          {isActive && (
            <div className="mt-4">
              <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          {project.repo && (
            <a 
              href={project.repo} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center text-sm font-medium ${
                isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <GitHub size={16} className="mr-1" />
              Code
            </a>
          )}
          
          {project.demo && (
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center text-sm font-medium ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} className="mr-1" />
              Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
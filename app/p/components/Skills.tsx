import { Code, Database, Server, Layers, Terminal, GitBranch, Activity, Lock } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { skills } from '@/app/data/skills';
import { motion } from 'framer-motion';

const SkillIcon = ({ name }: { name: string }) => {
  const icons = {
    frontend: <Code size={24} />,
    backend: <Server size={24} />,
    database: <Database size={24} />,
    devops: <Terminal size={24} />,
    architecture: <Layers size={24} />,
    version: <GitBranch size={24} />,
    monitoring: <Activity size={24} />,
    security: <Lock size={24} />
  };
  
  const iconKey = name.toLowerCase() as keyof typeof icons;
  return icons[iconKey] || <Code size={24} />;
};

const Skills = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <section 
      id="skills" 
      className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? 'bg-[#121826]' : 'bg-white'
      }`}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">
          <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Skills & Technologies
          </span>
        </h2>
        <p className={`text-center mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          A comprehensive overview of my technical expertise and the technologies I work with.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 rounded-xl ${
                isDarkMode 
                  ? 'bg-gray-900 border border-gray-800' 
                  : 'bg-white shadow-md'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg mr-3 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <SkillIcon name={category.name} />
                </div>
                <h3 className="text-xl font-bold">{category.name}</h3>
              </div>
              
              <ul className="space-y-2">
                {category.items.map((skill, skillIndex) => (
                  <li 
                    key={skillIndex} 
                    className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Skills;
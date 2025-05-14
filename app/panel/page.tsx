'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Mail, Briefcase } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  repo: string;
  demo: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'messages' | 'projects'>('messages');
  const [messages, setMessages] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement authentication check
    const fetchData = async () => {
      try {
        if (activeTab === 'messages') {
          // TODO: Replace with actual API call
          const mockMessages: Contact[] = [
            {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              message: 'This is a test message',
              created_at: new Date().toISOString(),
            },
          ];
          setMessages(mockMessages);
        } else {
          // TODO: Replace with actual API call
          const mockProjects: Project[] = [
            {
              id: '1',
              title: 'Sample Project',
              description: 'This is a sample project description',
              technologies: ['React', 'TypeScript', 'Tailwind'],
              repo: 'https://github.com',
              demo: 'https://example.com',
              role: 'Full Stack Developer',
            },
          ];
          setProjects(mockProjects);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleSignOut = async () => {
    // TODO: Implement sign out logic
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121826] text-gray-900 dark:text-white">
      <nav className="px-4 py-4 bg-white dark:bg-gray-900 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'messages'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Projects
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : activeTab === 'messages' ? (
          <div className="grid gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className="p-6 rounded-lg bg-white dark:bg-gray-900 dark:border dark:border-gray-800 shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{message.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {message.email}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {message.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-lg bg-white dark:bg-gray-900 dark:border dark:border-gray-800 shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-600"
                    >
                      Repository
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-600"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
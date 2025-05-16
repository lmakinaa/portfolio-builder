'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Mail, Briefcase, Trash, Edit, Check, X, Save, Clipboard, Link } from 'lucide-react';

// Updated interface to match our backend schema
interface Message {
  id: string;
  senderEmail: string;
  subject: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  technologies: string[];
}

interface Skill {
  id: string;
  category: string;
  items: string[];
}

interface PortfolioData {
  title: string;
  position: string;
  description: string;
  projects: Project[];
  skills: Skill[];
}

// Helper function to extract JWT payload
const parseJwt = (token: string) => {
  try {
    // Make sure the token has the expected structure (header.payload.signature)
    if (!token || token.split('.').length !== 3) {
      console.error('Invalid token format');
      return null;
    }
    
    // Properly decode the base64 payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return null;
  }
};

// Helper function to check if cookie exists
const isCookiePresent = () => {
  if (typeof window !== 'undefined') {
    return !!document.cookie.split('; ').find(row => row.startsWith('token='));
  }
  return false;
};

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'messages' | 'portfolio' | 'projects'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    title: "",
    position: "",
    description: "",
    projects: [],
    skills: [],
  });
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: "",
    description: "",
    technologies: [],
  });
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    category: "",
    items: [],
  });
  const [newTechnology, setNewTechnology] = useState("");
  const [newSkillItem, setNewSkillItem] = useState("");

  // Add editing states for projects and skills
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Helper function for API calls with authentication
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // No need to manually add auth header as cookie will be sent automatically
  const headers: any = {
    'Content-Type': 'application/json',
    'x-user-id': userId,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensures cookies are sent with the request
  });

  if (response.status === 401) {
    // Token expired or invalid
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Authentication failed');
  }

  return response;
};

  // Extract userId from JWT token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Find the token cookie
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        
        if (!tokenCookie) {
          console.log('No token cookie found');
          return;
        }
        
        const token = tokenCookie.split('=')[1];
        console.log('Token found in cookie:', token ? 'Token exists' : 'Token is empty');
        
        if (!token) return;
        
        const payload = parseJwt(token);
        console.log('JWT payload:', payload);
        
        if (payload && payload.userId) {
          console.log('Setting userId:', payload.userId);
          setUserId(payload.userId);
        } else {
          console.error('userId not found in token payload');
        }
      } catch (error) {
        console.error('Error extracting userId from token:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Check for authentication cookie
    if (!isCookiePresent()) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (activeTab === 'messages') {
          // Fetch messages from API
          const response = await fetchWithAuth('/api/message');
          
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
          } else {
            console.error('Failed to fetch messages');
          }
        } else if (activeTab === 'portfolio' || activeTab === 'projects') {
          // Always fetch portfolio data for both portfolio and projects tabs
          const response = await fetchWithAuth('/api/portfolio');
          
          if (response.ok) {
            const portfolioResponse = await response.json();
            
            // Fetch projects
            const projectsResponse = await fetchWithAuth('/api/project');
            const projects = projectsResponse.ok ? await projectsResponse.json() : [];
            
            // For portfolio tab, also fetch skills
            let skills = [];
            if (activeTab === 'portfolio') {
              const skillsResponse = await fetchWithAuth('/api/skills');
              skills = skillsResponse.ok ? await skillsResponse.json() : [];
            } else {
              // Preserve existing skills if we're just on the projects tab
              skills = portfolioData.skills;
            }
            
            setPortfolioData({
              title: portfolioResponse.title || '',
              position: portfolioResponse.position || '',
              description: portfolioResponse.description || '',
              projects: projects || [],
              skills: skills || [],
            });
          } else {
            console.error('Failed to fetch portfolio data');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, router]);

  const handleCopyPortfolioLink = async () => {
    if (!userId) return;
    
    const portfolioUrl = `${window.location.origin}/p/${userId}`;
    
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopySuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSignOut = async () => {
    // Remove token cookie
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.push('/login');
  };

  // Message management
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewingMessage, setIsViewingMessage] = useState(false);

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewingMessage(true);
  };

  const handleCloseMessageView = () => {
    setSelectedMessage(null);
    setIsViewingMessage(false);
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const response = await fetchWithAuth(`/api/message/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the message from the state
        setMessages(messages.filter(message => message.id !== id));
        
        // Close the detail view if this message was being viewed
        if (selectedMessage?.id === id) {
          handleCloseMessageView();
        }
      } else {
        console.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Portfolio management
  const handlePortfolioSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Update portfolio info
      const portfolioResponse = await fetchWithAuth('/api/portfolio', {
        method: 'POST',
        body: JSON.stringify({
          title: portfolioData.title,
          position: portfolioData.position,
          description: portfolioData.description,
        }),
      });

      if (!portfolioResponse.ok) {
        throw new Error('Failed to update portfolio');
      }

      // Update projects
      for (const project of portfolioData.projects) {
        if (project.id.startsWith('new-')) {
          // Create new project
          await fetchWithAuth('/api/project', {
            method: 'POST',
            body: JSON.stringify({
              ...project,
              id: undefined, // Remove the temporary ID
            }),
          });
        } else {
          // Update existing project
          await fetchWithAuth(`/api/project/${project.id}`, {
            method: 'PUT',
            body: JSON.stringify(project),
          });
        }
      }

      // Update skills
      for (const skill of portfolioData.skills) {
        if (skill.id.startsWith('new-')) {
          // Create new skill
          await fetchWithAuth('/api/skills', {
            method: 'POST',
            body: JSON.stringify({
              ...skill,
              id: undefined, // Remove the temporary ID
            }),
          });
        } else {
          // Update existing skill
          await fetchWithAuth(`/api/skills/${skill.id}`, {
            method: 'PUT',
            body: JSON.stringify(skill),
          });
        }
      }

      alert('Portfolio saved successfully!');
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('Failed to save portfolio. Please try again.');
    }
  };

  const handleAddProject = async () => {
    if (newProject.title && newProject.description) {
      try {
        // Create project via API
        const response = await fetchWithAuth('/api/project', {
          method: 'POST',
          body: JSON.stringify({
            ...newProject
          }),
        });
        
        if (response.ok) {
          // Get the newly created project from the response
          const createdProject = await response.json();
          
          // Update local state with the new project
          setPortfolioData({
            ...portfolioData,
            projects: [...portfolioData.projects, createdProject],
          });
          
          // Reset the form
          setNewProject({ title: "", description: "", technologies: [] });
          setNewTechnology("");
        } else {
          console.error('Failed to create project');
          alert('Failed to create project. Please try again.');
        }
      } catch (error) {
        console.error('Error creating project:', error);
        alert('Failed to create project. Please try again.');
      }
    } else {
      alert('Please provide a title and description for the project');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.category && newSkill.items.length > 0) {
      setPortfolioData({
        ...portfolioData,
        skills: [...portfolioData.skills, { 
          ...newSkill, 
          id: `new-${Date.now().toString()}` 
        }],
      });
      setNewSkill({ category: "", items: [] });
      setNewSkillItem("");
    }
  };

  const handleAddTechnology = () => {
    if (newTechnology) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, newTechnology],
      });
      setNewTechnology("");
    }
  };

  const handleAddSkillItem = () => {
    if (newSkillItem) {
      setNewSkill({
        ...newSkill,
        items: [...newSkill.items, newSkillItem],
      });
      setNewSkillItem("");
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (id: string) => {
    try {
      // Only make API call for existing projects (not temporary ones)
      if (!id.startsWith('new-')) {
        const response = await fetchWithAuth(`/api/project/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          console.error('Failed to delete project from API');
          alert('Failed to delete project. Please try again.');
          return;
        }
      }
      
      // Update local state
      setPortfolioData({
        ...portfolioData,
        projects: portfolioData.projects.filter(project => project.id !== id)
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  // Handle skill deletion
  const handleDeleteSkill = async (id: string) => {
    try {
      // Only make API call for existing skills (not temporary ones)
      if (!id.startsWith('new-')) {
        const response = await fetchWithAuth(`/api/skills/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          console.error('Failed to delete skill from API');
          alert('Failed to delete skill. Please try again.');
          return;
        }
      }
      
      // Update local state
      setPortfolioData({
        ...portfolioData,
        skills: portfolioData.skills.filter(skill => skill.id !== id)
      });
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill. Please try again.');
    }
  };

  // Start editing a project
  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setEditingProject({...project});
  };

  // Save edited project
  const handleSaveEditedProject = async () => {
    if (!editingProject) return;
    
    try {
      // Only make API call for existing projects (not temporary ones)
      if (!editingProjectId?.startsWith('new-')) {
        const response = await fetchWithAuth(`/api/project/${editingProjectId}`, {
          method: 'PUT',
          body: JSON.stringify(editingProject),
        });
        
        if (!response.ok) {
          console.error('Failed to update project');
          alert('Failed to update project. Please try again.');
          return;
        }
      }
      
      // Update local state
      setPortfolioData({
        ...portfolioData,
        projects: portfolioData.projects.map(project => 
          project.id === editingProjectId ? editingProject : project
        )
      });
      
      // Clear editing state
      setEditingProjectId(null);
      setEditingProject(null);
      
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  };

  // Start editing a skill
  const handleEditSkill = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setEditingSkill({...skill});
  };

  // Save edited skill
  const handleSaveEditedSkill = async () => {
    if (!editingSkill) return;
    
    try {
      // Only make API call for existing skills (not temporary ones)
      if (!editingSkillId?.startsWith('new-')) {
        const response = await fetchWithAuth(`/api/skills/${editingSkillId}`, {
          method: 'PUT',
          body: JSON.stringify(editingSkill),
        });
        
        if (!response.ok) {
          console.error('Failed to update skill');
          alert('Failed to update skill. Please try again.');
          return;
        }
      }
      
      // Update local state
      setPortfolioData({
        ...portfolioData,
        skills: portfolioData.skills.map(skill => 
          skill.id === editingSkillId ? editingSkill : skill
        )
      });
      
      // Clear editing state
      setEditingSkillId(null);
      setEditingSkill(null);
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Failed to update skill. Please try again.');
    }
  };

  // Add item to editing skill
  const handleAddItemToEditingSkill = (item: string) => {
    if (!editingSkill || !item) return;
    
    setEditingSkill({
      ...editingSkill,
      items: [...editingSkill.items, item]
    });
    setNewSkillItem("");
  };

  // Remove item from editing skill
  const handleRemoveItemFromEditingSkill = (itemIndex: number) => {
    if (!editingSkill) return;
    
    setEditingSkill({
      ...editingSkill,
      items: editingSkill.items.filter((_, index) => index !== itemIndex)
    });
  };

  // Add technology to editing project
  const handleAddTechToEditingProject = (tech: string) => {
    if (!editingProject || !tech) return;
    
    setEditingProject({
      ...editingProject,
      technologies: [...editingProject.technologies, tech]
    });
    setNewTechnology("");
  };

  // Remove technology from editing project
  const handleRemoveTechFromEditingProject = (techIndex: number) => {
    if (!editingProject) return;
    
    setEditingProject({
      ...editingProject,
      technologies: editingProject.technologies.filter((_, index) => index !== techIndex)
    });
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
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'portfolio'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Portfolio & Skills
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Edit className="w-4 h-4 mr-2" />
            Projects
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : activeTab === 'messages' ? (
          <>
            {isViewingMessage && selectedMessage ? (
              <div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      From: {selectedMessage.senderEmail}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      title="Delete message"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCloseMessageView}
                      className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {messages.length === 0 ? (
                  <div className="p-6 rounded-lg bg-white dark:bg-gray-900 dark:border dark:border-gray-800 shadow text-center">
                    <p className="text-gray-500 dark:text-gray-400">No messages found</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className="p-6 rounded-lg bg-white dark:bg-gray-900 dark:border dark:border-gray-800 shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{message.subject}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {message.senderEmail}
                          </p>
                        </div>
                        <div className="flex space-x-2 items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleViewMessage(message)}
                            className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                            title="View message"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete message"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        ) : activeTab === 'portfolio' ? (
          <div className="space-y-8">
            {/* Portfolio Information */}
            <div className="p-6 rounded-lg bg-white dark:bg-gray-900 dark:border dark:border-gray-800 shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Portfolio Information</h2>
                {userId && (
                  <div className="relative">
                    <button
                      onClick={handleCopyPortfolioLink}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        copySuccess
                          ? 'bg-green-600 text-white'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Link className="w-4 h-4 mr-2" />
                          Copy Portfolio Link
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handlePortfolioSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={portfolioData.title}
                    onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., John Doe's Portfolio"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    id="position"
                    type="text"
                    value={portfolioData.position}
                    onChange={(e) => setPortfolioData({ ...portfolioData, position: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={portfolioData.description}
                    onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
                    placeholder="Write a brief description about yourself..."
                  />
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Skills</h3>
                  <div className="space-y-4">
                    {portfolioData.skills.map((skill) => (
                      <div key={skill.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {editingSkillId === skill.id ? (
                          // Editing mode
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <input
                                type="text"
                                value={editingSkill?.category || ""}
                                onChange={(e) => setEditingSkill({...editingSkill!, category: e.target.value})}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleSaveEditedSkill}
                                  className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                                  title="Save"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingSkillId(null);
                                    setEditingSkill(null);
                                  }}
                                  className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {editingSkill?.items.map((item, index) => (
                                <div key={index} className="flex items-center px-2 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                  {item}
                                  <button
                                    onClick={() => handleRemoveItemFromEditingSkill(index)}
                                    className="ml-1 text-red-500 hover:text-red-700"
                                    title="Remove item"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newSkillItem}
                                onChange={(e) => setNewSkillItem(e.target.value)}
                                placeholder="New Skill Item"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddItemToEditingSkill(newSkillItem)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{skill.category}</h4>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditSkill(skill)}
                                  className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                                  title="Edit skill"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSkill(skill.id)}
                                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                  title="Delete skill"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {skill.items.map((item, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                      placeholder="Skill Category"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={newSkillItem}
                      onChange={(e) => setNewSkillItem(e.target.value)}
                      placeholder="Skill Item"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkillItem}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Add Item
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Add Category
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Portfolio
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="p-6 rounded-lg bg-white dark:bg-gray-900 dark:border dark:border-gray-800 shadow">
              <h2 className="text-xl font-semibold mb-6">Projects</h2>
              
              <div className="space-y-4">
                {portfolioData.projects.map((project) => (
                  <div key={project.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {editingProjectId === project.id ? (
                      // Editing mode
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <input
                            type="text"
                            value={editingProject?.title || ""}
                            onChange={(e) => setEditingProject({...editingProject!, title: e.target.value})}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEditedProject}
                              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingProjectId(null);
                                setEditingProject(null);
                              }}
                              className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <textarea
                          value={editingProject?.description || ""}
                          onChange={(e) => setEditingProject({...editingProject!, description: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
                        />
                        
                        <div className="flex flex-wrap gap-2">
                          {editingProject?.technologies.map((tech, index) => (
                            <div key={index} className="flex items-center px-2 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {tech}
                              <button
                                onClick={() => handleRemoveTechFromEditingProject(index)}
                                className="ml-1 text-red-500 hover:text-red-700"
                                title="Remove technology"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTechnology}
                            onChange={(e) => setNewTechnology(e.target.value)}
                            placeholder="New Technology"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTechToEditingProject(newTechnology)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        
                        <div className="flex gap-4">
                          <input
                            type="text"
                            value={editingProject?.githubUrl || ""}
                            onChange={(e) => setEditingProject({...editingProject!, githubUrl: e.target.value})}
                            placeholder="GitHub URL"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            value={editingProject?.demoUrl || ""}
                            onChange={(e) => setEditingProject({...editingProject!, demoUrl: e.target.value})}
                            placeholder="Demo URL"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{project.title}</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProject(project)}
                              className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                              title="Edit project"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete project"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-500 hover:text-indigo-600"
                            >
                              GitHub
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-500 hover:text-indigo-600"
                            >
                              Demo
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="text-lg font-medium">Add New Project</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Project Title"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Technology"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechnology}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Tech
                  </button>
                </div>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Project Description"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newProject.githubUrl || ""}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="GitHub URL"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={newProject.demoUrl || ""}
                    onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                    placeholder="Demo URL"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Project
                  </button>
                </div>
                
                {newProject.technologies.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {newProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
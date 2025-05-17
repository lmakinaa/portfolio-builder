export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  role: string;
}

interface SkillsCategory {
  category: string;
  items: string[];
}

export interface Portfolio {
  userId: string;
  title: string;
  position: string;
  description: string;
  projects: Project[];
  skills: SkillsCategory[];
  email: string;
  github: string;
  linkedin: string;
  phone: string;
}

export interface ContactEntrie {
  sender_email: string;
  subject: string;
  message: string;
}
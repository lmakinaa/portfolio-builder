export interface Project {
  title: string;
  description: string;
  technologies: string[];
  repo: string;
  demo: string;
  role: string;
}

interface SkillsSection {
  title: string;
  icon: string;
  skills: string[];
}

export interface Portfolio {
  title: string;
  position: string;
  summary: string;
  projects: Project[];
  skills: SkillsSection[];
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
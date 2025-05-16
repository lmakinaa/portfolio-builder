import { Project } from '@/app/types';

export const projects: Project[] = [
  {
    title: "Trencsendence - Gaming & Social Platform",
    description: "A web platform that combines gaming and social interaction features. Users can play real-time games, chat, and build a community through social features.",
    technologies: ["React", "Django", "PostgreSQL", "Redis", "Pytest"],
    repo: "https://github.com/kvrasx/Trencsendence",
    demo: "https://138.68.80.6:4433/",
    role: "Team Project"
  },
  {
    title: "Submissions Manager",
    description: "A web application designed to streamline the process of managing and reviewing CV submissions. The system automates sorting, tagging, and provides efficient review workflows.",
    technologies: ["React", "FastAPI", "SQLAlchemy"],
    repo: "https://github.com/lmakinaa/submissions-manager",
    demo: "http://138.68.80.6:8080",
    role: "Solo Project"
  },
  {
    title: "Inception - Docker Infrastructure",
    description: "A comprehensive Docker infrastructure with a backups managing application. Includes monitoring tools like Prometheus and Grafana for system observability.",
    technologies: ["Docker", "Redis", "Prometheus", "Grafana", "Flask", "React"],
    repo: "https://github.com/lmakinaa/inception",
    demo: "",
    role: "Solo Project"
  },
  {
    title: "C++ Web Server",
    description: "A robust, single-threaded C++ web server implementation featuring HTTP protocol handling, IO multiplexing, and CGI implementation. Built with a focus on performance and clean code.",
    technologies: ["C++", "HTTP", "IO multiplexing", "Unit testing", "CGI"],
    repo: "https://github.com/lmakinaa/web-server",
    demo: "",
    role: "Solo Project"
  }
];
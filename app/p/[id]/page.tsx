"use client";

import ProfilePage from '../components/PortfolioPage';
import { projects } from '@/app/data/projects';
import { Portfolio } from '@/app/types';

const testData: Portfolio = {
  title: "Lmakina",
  position: "Software Engineer",
  summary: "I build scalable, performant applications with modern architectures. \
            Specializing in full-stack development, my expertise includes React, \
            Django, FastAPI, and microservices architecture.",
  projects: projects, // assuming 'projects' matches the Portfolio type
  skills: [],
  email: "lmakina@example.com",
  linkedin: "https://linkedin.com/in/lmakina",
  github: "https://github.com/lmakinaa",
  phone: "null"
};

export default function Page() {

  return (
    <ProfilePage {...testData} />
  );
}

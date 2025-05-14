"use client";

import { useState, useEffect } from 'react';
import Header from '@/app/p/components/Header';
import Hero from '@/app/p/components/Hero';
import Projects from '@/app/p/components/Projects';
import Skills from '@/app/p/components/Skills';
import Contact from '@/app/p/components/Contact';
import Footer from '@/app/p/components/Footer';
import { useTheme } from '@/app/contexts/ThemeContext';
import {projects} from '@/app/data/projects';
import {Portfolio} from '@/app/types/index'


export default function PortfolioPage(portfolioData: Portfolio) {
  const [activeSection, setActiveSection] = useState('hero');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'projects', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;

        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#121826] text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Header activeSection={activeSection} title={portfolioData.title} />
      <main>
        <Hero {...portfolioData} />
        <Projects {...portfolioData} />
        <Skills />
        <Contact {...portfolioData} />
      </main>
      <Footer />
    </div>
  );
}


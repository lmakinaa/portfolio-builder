'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown, Github as GitHub, ExternalLink } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface HeroProps {
  title: string;
  position: string;
  summary: string;
  // customStyles?: {
  //   primaryColor?: string;
  //   secondaryColor?: string;
  //   fontFamily?: string;
  // };
}

export default function Hero({ title, position, summary }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      heroRef.current.style.setProperty('--mouse-x', `${x}px`);
      heroRef.current.style.setProperty('--mouse-y', `${y}px`);
    };
    
    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      window.scrollTo({
        top: projectsSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: isDarkMode 
          ? 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.08), transparent 800px)' 
          : 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.12), transparent 800px)'
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
          <span className="block">Hi, I&apos;m {title}</span>
          <span className="block mt-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
            {position}
          </span>
        </h1>
        
        <p className={`text-lg md:text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {summary}
        </p>
        
        <div className="flex justify-center space-x-4 mb-12">
          <a 
            href="https://github.com/lmakinaa" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center py-2 px-4 rounded-lg transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            <GitHub className="mr-2" size={18} />
            GitHub
          </a>
          <button 
            onClick={scrollToProjects}
            className="flex items-center py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300"
          >
            View Projects
            <ExternalLink className="ml-2" size={18} />
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={scrollToProjects}
          className={`p-2 rounded-full ${
            isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
          }`}
          aria-label="Scroll down"
        >
          <ArrowDown size={20} />
        </button>
      </div>
    </section>
  );
}
"use client";

import { useState, useEffect } from 'react';
import Header from '@/app/p/components/Header';
import Hero from '@/app/p/components/Hero';
import Projects from '@/app/p/components/Projects';
import Skills from '@/app/p/components/Skills';
import Contact from '@/app/p/components/Contact';
import Footer from '@/app/p/components/Footer';
import { useTheme } from '@/app/contexts/ThemeContext';
import {Portfolio} from '@/app/types/index'
import { useRouter } from 'next/navigation';
import WhatsAppBubble from './WhatsappBubble';


function PortfolioPageComponent(portfolioData: Portfolio) {
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
        <Hero title={portfolioData.title} description={portfolioData.description} github={portfolioData.github} position={portfolioData.position} />
        <Projects {...portfolioData} />
        <Skills skills={portfolioData.skills} />
        <Contact {...portfolioData} />
      </main>
      <Footer />
      {portfolioData.phone && <WhatsAppBubble phoneNumber={portfolioData.phone} />}
    </div>
  );
}

export default function PortfolioPage({userId}:{userId: string}) {
  const [portfolioData, setPortfolioData] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio', {
          headers: {
            'x-user-id': userId
          }
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/404');
            return null;
          }
          throw new Error(`Failed to fetch portfolio: ${response.status}`);
        }
        
        const data = await response.json();
        setPortfolioData({ ...data});
        setError(null);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchPortfolio();
    }
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error || !portfolioData) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p>{error || 'Portfolio not found'}</p>
      </div>
    );
  }
  
  return <PortfolioPageComponent {...portfolioData} />;
}
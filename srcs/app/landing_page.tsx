"use client";

import { useTheme } from '@/app/contexts/ThemeContext';
import { Moon, Sun, ArrowRight, Code, Palette, Layout, Rocket, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#121826] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-[#121826]/90 backdrop-blur-sm border-b border-gray-800' : 'bg-white/90 backdrop-blur-sm shadow-sm'}`} >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              PortfolioBuilder
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Create Your Professional
            <span className="block mt-2 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Portfolio in Minutes
            </span>
          </h1>
          <p className={`text-xl mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Showcase your work, skills, and experience with our easy-to-use portfolio builder.
            No coding required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admin"
              className="px-8 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center"
            >
              Start Building <ArrowRight className="ml-2" size={20} />
            </Link>
            <a
              href="#features"
              className={`px-8 py-3 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-100'
              } transition-colors`}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 ${isDarkMode ? 'bg-[#0f1621]' : 'bg-white'}`}>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Code size={24} />,
                title: 'No Coding Required',
                description: 'Build your portfolio with our intuitive drag-and-drop interface.',
              },
              {
                icon: <Palette size={24} />,
                title: 'Customizable Design',
                description: 'Choose from various themes and customize colors to match your style.',
              },
              {
                icon: <Layout size={24} />,
                title: 'Responsive Layout',
                description: 'Your portfolio looks great on all devices, from mobile to desktop.',
              },
              {
                icon: <Shield size={24} />,
                title: 'Secure Admin Panel',
                description: 'Manage your content securely through the admin dashboard.',
              },
              {
                icon: <Users size={24} />,
                title: 'Contact Management',
                description: 'Handle inquiries and messages through a built-in contact system.',
              },
              {
                icon: <Rocket size={24} />,
                title: 'Quick Deploy',
                description: 'Deploy your portfolio with one click and share it with the world.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl ${
                  isDarkMode
                    ? 'bg-gray-900 border border-gray-800'
                    : 'bg-white shadow-lg'
                }`}
              >
                <div className={`p-3 rounded-lg inline-block mb-4 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-indigo-100'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Build Your Portfolio?
          </h2>
          <p className={`mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of professionals who have created stunning portfolios with our platform.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Get Started Now <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 ${isDarkMode ? 'bg-[#0a0f18] border-t border-gray-800' : 'bg-gray-50 border-t border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © {new Date().getFullYear()} PortfolioBuilder. All rights reserved.
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Built with Next + TypeScript + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? `${isDarkMode ? 'bg-[#121826]/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm shadow-sm'}` 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Lamkina
              </span>
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            {['hero', 'projects', 'skills', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeSection === section
                    ? 'text-indigo-500'
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-800/30 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun size={18} className="text-gray-300" />
              ) : (
                <Moon size={18} className="text-gray-700" />
              )}
            </button>
          </nav>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full hover:bg-gray-800/30 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun size={18} className="text-gray-300" />
              ) : (
                <Moon size={18} className="text-gray-700" />
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-800/30 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={24} className={isDarkMode ? "text-white" : "text-gray-900"} />
              ) : (
                <Menu size={24} className={isDarkMode ? "text-white" : "text-gray-900"} />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={`md:hidden fixed inset-0 z-40 ${isDarkMode ? 'bg-[#121826]' : 'bg-white'}`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {['hero', 'projects', 'skills', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-lg font-medium transition-colors duration-300 ${
                  activeSection === section
                    ? 'text-indigo-500'
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
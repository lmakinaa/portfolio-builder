import { useState } from 'react';
import { Send, Mail, Github as GitHub, Linkedin } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { motion } from 'framer-motion';

const Contact = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thanks for your message! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1500);
  };
  
  return (
    <section 
      id="contact"
      className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? 'bg-[#0f1621]' : 'bg-gray-100'
      }`}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">
          <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Get In Touch
          </span>
        </h2>
        <p className={`text-center mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Have a question or want to work together? Feel free to reach out.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Send Me a Message
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label 
                  htmlFor="name" 
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                    isDarkMode 
                      ? 'bg-gray-900 border border-gray-700 text-white' 
                      : 'bg-white border border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor="email" 
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                    isDarkMode 
                      ? 'bg-gray-900 border border-gray-700 text-white' 
                      : 'bg-white border border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor="message" 
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                    isDarkMode 
                      ? 'bg-gray-900 border border-gray-700 text-white' 
                      : 'bg-white border border-gray-300 text-gray-900'
                  }`}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                  isSubmitting 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white transition-colors duration-300`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
              
              {submitMessage && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                  {submitMessage}
                </div>
              )}
            </form>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Contact Information
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className={`p-2 rounded-lg mr-4 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Email</h4>
                  <a 
                    href="mailto:contact@example.com" 
                    className={`text-sm ${
                      isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                    }`}
                  >
                    contact@example.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`p-2 rounded-lg mr-4 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <GitHub size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">GitHub</h4>
                  <a 
                    href="https://github.com/lmakinaa" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-sm ${
                      isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                    }`}
                  >
                    github.com/lmakinaa
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`p-2 rounded-lg mr-4 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <Linkedin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">LinkedIn</h4>
                  <a 
                    href="#" 
                    className={`text-sm ${
                      isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                    }`}
                  >
                    linkedin.com/in/lamkina
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Available For
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Full-time Positions</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Freelance Projects</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Technical Consulting</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
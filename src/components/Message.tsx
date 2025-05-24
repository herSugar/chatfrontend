import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Hi, I'm Pitu.";
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const tabs = ['Home', 'Setup', 'Plans', 'About', 'FAQ', 'Book Demo'];
  const [activeTab, setActiveTab] = useState('Home');

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing animation
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    } else {
      const subtitleTimeout = setTimeout(() => setShowSubtitle(true), 500);
      const buttonsTimeout = setTimeout(() => setShowButtons(true), 1000);
      return () => {
        clearTimeout(subtitleTimeout);
        clearTimeout(buttonsTimeout);
      };
    }
  }, [currentIndex]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Navbar */}
      <div 
        ref={navRef}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="text-xl font-bold text-indigo-600">PituAI</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`py-2 relative text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-500'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transition-all ${
                      isScrolled ? 'opacity-100' : 'opacity-0'
                    }`}></span>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`block w-full text-left px-4 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hero Section (with padding for fixed navbar) */}
      <div className="pt-16 flex-1 bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col items-center justify-center p-4 text-center">
        {/* ... rest of your existing hero section content ... */}
        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-8 border-4 border-indigo-400">
          <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-4xl">🤖</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 h-16">
            {typedText}
            <span className="animate-pulse">|</span>
          </h1>

          {showSubtitle && (
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 animate-fadeIn">
              An AI chatbot for pharmacists
            </p>
          )}

          {showButtons && (
            <div className="flex justify-center mb-12 animate-fadeIn">
              <div className="relative group">
                <div className="absolute -inset-2 bg-white rounded-lg opacity-0 
                    group-hover:opacity-30 blur-md group-hover:blur-lg 
                    transition-all duration-500 scale-95 group-hover:scale-100" />
                <button
                  onClick={() => navigate('/chat')}
                  className="relative px-8 py-3 bg-white text-indigo-800 rounded-lg font-bold hover:bg-opacity-90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 z-10"
                >
                  Learn More
                </button>
              </div>
            </div>
          )}

          <div className="text-indigo-200 flex flex-col items-center animate-bounce mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <span className="text-sm mt-2">Scroll or click to explore the experience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
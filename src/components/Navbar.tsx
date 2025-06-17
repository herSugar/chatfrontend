import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  transparentOnTop?: boolean;
  disableScrollEffect?: boolean;
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ 
  transparentOnTop = true, 
  disableScrollEffect = false,
  children 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const location = useLocation();

  const tabs = [
    { name: 'Home', path: '/', section: 'landing' },
    { name: 'Chat', path: '/login', section: null },
    { name: 'About', path: '/', section: 'about' },
    { name: 'FAQ', path: '/', section: 'faq' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleTabClick = (tab: { name: string; path: string; section: string | null }) => {
    setActiveTab(tab.name);
    
    if (tab.section && location.pathname === '/') {
      // If we're on homepage and clicking a section, scroll to it
      scrollToSection(tab.section);
    } else if (tab.section && location.pathname !== '/') {
      // If we're not on homepage, navigate to homepage with hash
      window.location.href = `/#${tab.section}`;
    }
    // For Chat, it will use the Link component normally
  };

  useEffect(() => {
    if (disableScrollEffect || !transparentOnTop) {
      setIsScrolled(true);
      return;
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparentOnTop, disableScrollEffect]);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-transparent backdrop-blur-sm border-b border-white/30' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-500">
            BALI<span className="text-orange-500">PITU</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {tabs.map((tab) => (
              tab.name === 'Chat' ? (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`py-2 relative text-sm font-medium transition-colors group ${
                    activeTab === tab.name
                      ? 'text-orange-500'
                      : 'text-gray-500 hover:text-orange-400'
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  <span className="absolute top-0 left-0 w-full h-0.5 bg-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                  {tab.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </Link>
              ) : (
                <button
                  key={tab.name}
                  className={`py-2 relative text-sm font-medium transition-colors group ${
                    activeTab === tab.name
                      ? 'text-orange-500'
                      : 'text-gray-500 hover:text-orange-400'
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  <span className="absolute top-0 left-0 w-full h-0.5 bg-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                  {tab.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </button>
              )
            ))}
            
            {/* Children elements (like sidebar toggle button) */}
            {children}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {children}
            <button
              className="text-white focus:outline-none ml-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm">
          {tabs.map((tab) => (
            tab.name === 'Chat' ? (
              <Link
                key={tab.name}
                to={tab.path}
                className={`block w-full text-left px-4 py-3 text-sm font-medium ${
                  activeTab === tab.name
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setActiveTab(tab.name);
                  setMobileMenuOpen(false);
                }}
              >
                {tab.name}
              </Link>
            ) : (
              <button
                key={tab.name}
                className={`block w-full text-left px-4 py-3 text-sm font-medium ${
                  activeTab === tab.name
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  handleTabClick(tab);
                  setMobileMenuOpen(false);
                }}
              >
                {tab.name}
              </button>
            )
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Navbar from '../components/Navbar';
import logoImage from '../assets/images/logos.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Hi, I'm Pitu.";
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Constants for better maintainability
  const TYPING_SPEED = 100;
  const SUBTITLE_DELAY = 500;
  const BUTTONS_DELAY = 1000;

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Save theme preference
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Typing animation effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, TYPING_SPEED);

      return () => clearTimeout(timeout);
    } else {
      const subtitleTimeout = setTimeout(() => {
        setShowSubtitle(true);
      }, SUBTITLE_DELAY);
      
      const buttonsTimeout = setTimeout(() => {
        setShowButtons(true);
      }, BUTTONS_DELAY);

      return () => {
        clearTimeout(subtitleTimeout);
        clearTimeout(buttonsTimeout);
      };
    }
  }, [currentIndex]);

  // Theme-based styles
  const themeStyles = {
    light: {
      containerBg: 'bg-gray-100',
      gradientBg: 'bg-gradient-to-br from-orange-300 to-white',
      floatingElements: {
        primary: 'bg-orange-200/30',
        secondary: 'bg-black/10',
        tertiary: 'bg-orange-300/25',
        quaternary: 'bg-black/5'
      },
      grid: 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
      dots: 'bg-orange-400/30',
      mainBox: 'bg-white border-orange-300 shadow-xl',
      logoContainer: 'bg-gradient-to-br from-white to-orange-100 border-orange-200',
      logoShadow: 'bg-gradient-to-br from-transparent to-orange-300/20',
      heading: 'text-gray-800',
      cursor: 'text-orange-500',
      subtitle: 'text-orange-600',
      arrow: 'text-orange-500'
    },
    dark: {
      containerBg: 'bg-black',
      gradientBg: 'bg-gradient-to-br from-black via-gray-900 to-gray-800',
      floatingElements: {
        primary: 'bg-orange-500/20',
        secondary: 'bg-orange-400/30',
        tertiary: 'bg-orange-300/25',
        quaternary: 'bg-orange-600/15'
      },
      grid: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
      dots: 'bg-orange-400/40',
      mainBox: 'backdrop-blur-sm bg-black/70 border-orange-500/30 shadow-2xl',
      logoContainer: 'bg-gradient-to-br from-gray-800 to-orange-500 border-orange-400/50',
      logoShadow: 'bg-gradient-to-br from-transparent to-orange-600/30',
      heading: 'text-orange-400 drop-shadow-lg',
      cursor: '',
      subtitle: 'text-orange-200 drop-shadow-md',
      arrow: 'text-orange-400 drop-shadow-lg'
    }
  };

  const currentTheme = isDarkMode ? themeStyles.dark : themeStyles.light;

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.containerBg} transition-colors duration-500`}>
      <Navbar />
      
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-20 right-4 z-50 p-3 rounded-full transition-all duration-300 ${
          isDarkMode 
            ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400' 
            : 'bg-orange-200 hover:bg-orange-300 text-orange-700'
        } backdrop-blur-sm shadow-lg hover:shadow-2xl transform hover:scale-110`}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      
      <div className={`flex-1 relative ${currentTheme.gradientBg} flex flex-col items-center justify-center p-4 text-center overflow-hidden transition-all duration-500`}>
        
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-20 left-10 w-20 h-20 ${currentTheme.floatingElements.primary} rounded-full animate-bounce`} style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className={`absolute top-40 right-20 w-16 h-16 ${currentTheme.floatingElements.secondary} rounded-lg rotate-45 animate-pulse`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute bottom-40 left-20 w-12 h-12 ${currentTheme.floatingElements.tertiary} rounded-full animate-bounce`} style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
          <div className={`absolute bottom-20 right-10 w-24 h-24 ${currentTheme.floatingElements.quaternary} rounded-full animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
          
          <div className={`absolute inset-0 ${isDarkMode ? 'opacity-30' : 'opacity-15'}`}>
            <div className="absolute inset-0" style={{
              backgroundImage: currentTheme.grid,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>
          
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${currentTheme.dots} rounded-full animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        {/* Main content box */}
        <div className={`relative z-10 ${currentTheme.mainBox} rounded-3xl p-8 border-2 max-w-4xl mx-auto transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}>
          
          {/* Logo container */}
          <div className="relative mb-8">
            <div className={`w-32 h-32 mx-auto rounded-full ${currentTheme.logoContainer} flex items-center justify-center border-4 shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
              <div className={`absolute inset-0 rounded-full ${currentTheme.logoShadow} transform translate-x-2 translate-y-2 -z-10`}></div>
              <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="Pitu Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-6"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-orange-300 rounded-full transform -translate-x-1/2 translate-y-6"></div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h1 className={`text-5xl md:text-6xl font-bold ${currentTheme.heading} mb-6 h-16 transition-colors duration-500`}>
              {typedText}
              <span className={`${currentTheme.cursor} animate-pulse`}>|</span>
            </h1>

            {showSubtitle && (
              <p 
                className={`text-xl md:text-2xl ${currentTheme.subtitle} mb-8 transform transition-all duration-1000 ease-out`}
                style={{
                  animation: 'slideInFromBottom 0.8s ease-out forwards'
                }}
              >
                An AI chatbot for Your Travel
              </p>
            )}

            {showButtons && (
              <div 
                className={`flex flex-col items-center justify-center ${isDarkMode ? 'mb-12' : 'mb-8'}`}
                style={{
                  animation: 'slideInFromBottom 0.8s ease-out 0.3s both'
                }}
              >
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${currentTheme.arrow} animate-bounce`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{
                      animationDuration: '1.5s'
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>

                <div className="relative group">
                  {isDarkMode ? (
                    <>
                      <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-orange-700 rounded-lg opacity-0 
                          group-hover:opacity-30 blur-md group-hover:blur-lg 
                          transition-all duration-500 scale-95 group-hover:scale-100" />
                      
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/50 to-orange-700/50 rounded-lg opacity-20 animate-pulse"></div>
                    </>
                  ) : (
                    <div className="absolute -inset-1 bg-orange-500/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  
                  <button
                    onClick={() => navigate('/login')}
                    className={`relative px-12 py-4 bg-orange-600 text-white rounded-lg font-bold 
                               hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-2xl 
                               transform hover:scale-110 hover:-translate-y-2 z-10
                               border-2 ${isDarkMode ? 'border-transparent hover:border-orange-400/30 group-hover:shadow-orange-400/25' : 'border-orange-500/30'}
                               ${isDarkMode ? 'hover:-translate-y-2' : 'hover:-translate-y-1'}`}
                    style={isDarkMode ? {
                      animation: 'buttonPulse 2s ease-in-out infinite'
                    } : {}}
                    onMouseEnter={(e) => {
                      if (isDarkMode) {
                        e.currentTarget.style.animation = 'none';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isDarkMode) {
                        e.currentTarget.style.animation = 'buttonPulse 2s ease-in-out infinite';
                      }
                    }}
                  >
                    <span className="relative z-10">Chat Now</span>
                    
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400/0 to-orange-500/0 
                                    group-hover:from-orange-400/${isDarkMode ? '20' : '10'} group-hover:to-orange-500/${isDarkMode ? '20' : '10'} transition-all duration-300`}></div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buttonPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(251, 146, 60, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
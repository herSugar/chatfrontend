import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeWrapper';
import Navbar from '../components/Navbar';
import lightLogoImage from '../assets/images/logos.png'; // Your current light logo
import darkLogoImage from '../assets/images/logop.png'; // Your new dark logo

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { themeStyles, isDarkMode } = useTheme(); // Get isDarkMode from theme context
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const fullText = "Hi, I'm Pitu.";
  const TYPING_SPEED = 100;
  const SUBTITLE_DELAY = 500;
  const BUTTONS_DELAY = 1000;

  // Choose logo based on theme
  const currentLogo = isDarkMode ? darkLogoImage : lightLogoImage;
  const logoAlt = isDarkMode ? "Pitu Dark Logo" : "Pitu Light Logo";

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

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <Navbar />

      <div className="flex-1 relative flex flex-col items-center justify-center p-4 text-center overflow-hidden transition-all duration-500">
        <div className={`relative z-10 ${themeStyles.mainBox} rounded-3xl p-8 border-2 max-w-4xl mx-auto transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}>
          
          <div className="relative mb-8">
            <div className={`w-32 h-32 mx-auto rounded-full ${themeStyles.logoContainer} flex items-center justify-center border-4 shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
              <div className={`absolute inset-0 rounded-full ${themeStyles.logoShadow} transform translate-x-2 translate-y-2 -z-10`}></div>
              <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                <img 
                  loading="lazy"
                  src={currentLogo} 
                  alt={logoAlt}
                  className="w-full h-full object-cover rounded-full transition-all duration-500"
                  key={isDarkMode ? 'dark-logo' : 'light-logo'} // Key for smooth transition
                />
              </div>
            </div>

            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-orange-400 rounded-full transform -translate-x-1/2 -translate-y-6"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-orange-500 rounded-full transform -translate-x-1/2 translate-y-6"></div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h1 className={`text-5xl md:text-6xl font-bold ${themeStyles.heading} mb-6 h-16 transition-colors duration-500`}>
              {typedText}
              <span className={`${themeStyles.cursor} animate-pulse`}>|</span>
            </h1>

            {showSubtitle && (
              <p className={`text-xl md:text-2xl ${themeStyles.subheading} mb-8 transform transition-all duration-1000 ease-out animate-slide-in`}>
                An AI chatbot for Your Travel
              </p>
            )}

            {showButtons && (
              <div className="flex flex-col items-center justify-center mb-8 animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${themeStyles.arrow} animate-bounce`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ animationDuration: '1.5s' }}
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
                  <div className={`${themeStyles.buttonGlow}`} />
                  
                  <button
                    onClick={() => navigate('/login')}
                    className={`relative px-12 py-4 ${themeStyles.button} rounded-lg font-bold 
                               transition-all duration-300 shadow-lg hover:shadow-2xl 
                               transform hover:scale-110 hover:-translate-y-2 z-10 border-2`}
                  >
                    <span className="relative z-10">Chat Now</span>
                    <div className={`absolute inset-0 rounded-lg ${themeStyles.buttonOverlay} transition-all duration-300`}></div>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import logoImage from '../assets/images/logos.png';


const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Hi, I'm Pitu.";
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    } else {
      const subtitleTimeout = setTimeout(() => {
        setShowSubtitle(true);
      }, 500);
      
      const buttonsTimeout = setTimeout(() => {
        setShowButtons(true);
      }, 1000);

      return () => {
        clearTimeout(subtitleTimeout);
        clearTimeout(buttonsTimeout);
      };
    }
  }, [currentIndex]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Hero Section with 3D Background */}
      <div className="flex-1 relative bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
        
        {/* Animated 3D Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400/20 rounded-lg rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-300/15 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-300/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>
          
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        {/* Glassmorphism Card Container */}
        <div className="relative z-10 backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl max-w-4xl mx-auto">
          
          {/* Logo with 3D Effect */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-white to-indigo-100 flex items-center justify-center border-4 border-white/20 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              {/* 3D Shadow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-indigo-900/20 transform translate-x-2 translate-y-2 -z-10"></div>
                <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                  <img 
                    src={logoImage} 
                    alt="Pitu Logo" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
            </div>
            
             {/* Orbiting Elements */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-6"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1/2 translate-y-6"></div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 h-16 drop-shadow-lg">
              {typedText}
              <span className="animate-pulse">|</span>
            </h1>

            {showSubtitle && (
              <p 
                className="text-xl md:text-2xl text-indigo-100 mb-8 drop-shadow-md transform transition-all duration-1000 ease-out"
                style={{
                  animation: 'slideInFromBottom 0.8s ease-out forwards'
                }}
              >
                An AI chatbot for Your Travel
              </p>
            )}

            {showButtons && (
              <div 
                className="flex flex-col items-center justify-center mb-12"
                style={{
                  animation: 'slideInFromBottom 0.8s ease-out 0.3s both'
                }}
              >
                {/* Bouncing Arrow Above Button */}
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white animate-bounce drop-shadow-lg"
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

                {/* Enhanced Button */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg opacity-0 
                      group-hover:opacity-30 blur-md group-hover:blur-lg 
                      transition-all duration-500 scale-95 group-hover:scale-100" />
                  
                  {/* Button Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-lg opacity-20 animate-pulse"></div>
                  
                  <button
                    onClick={() => navigate('/login')}
                    className="relative px-12 py-4 bg-white text-indigo-800 rounded-lg font-bold 
                               hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-2xl 
                             transform hover:scale-110 hover:-translate-y-2 z-10
                             border-2 border-transparent hover:border-white/20
                             group-hover:shadow-blue-400/25"
                    style={{
                      animation: 'buttonPulse 2s ease-in-out infinite'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.animation = 'none';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.animation = 'buttonPulse 2s ease-in-out infinite';
                    }}
                  >
                    <span className="relative z-10">Chat Now</span>
                    
                    {/* Button inner glow */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-100/0 to-purple-100/0 
                                    group-hover:from-blue-100/20 group-hover:to-purple-100/20 transition-all duration-300"></div>
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
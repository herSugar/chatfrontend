import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import logoImage from '../assets/images/logos.png';
import logoImageDark from '../assets/images/logop.png'; // Add your dark mode logo
import { useTheme } from '../components/ThemeWrapper'; // Import your theme hook

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const { themeStyles, isDarkMode } = useTheme(); // Get both themeStyles and isDarkMode

  useEffect(() => {
    // Trigger animations on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Cycle through features for highlight effect
    const featureTimer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(featureTimer);
    };
  }, []);

  const features = [
    {
      title: "Intelligent Travel Planning",
      description: "Get personalized itineraries based on your preferences, budget, and travel style.",
      icon: "🗺️"
    },
    {
      title: "Real-time Assistance",
      description: "24/7 support for booking changes, local recommendations, and travel emergencies.",
      icon: "🚀"
    },
    {
      title: "Cultural Insights",
      description: "Learn about local customs, traditions, and hidden gems from AI-powered research.",
      icon: "🏛️"
    },
    {
      title: "Smart Budgeting",
      description: "Track expenses and get cost-effective suggestions for your entire journey.",
      icon: "💰"
    }
  ];

  // Select logo based on theme
  const currentLogo = isDarkMode ? logoImageDark : logoImage;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content - No hardcoded background, using theme */}
      <div
        className="flex-1 relative flex flex-col items-center justify-center p-4 transition-colors duration-500"
        style={{ backgroundColor: themeStyles.containerBg }}
      >

        
        {/* Main Content Container */}
        <div className="relative z-30 w-full max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className={`${themeStyles.card} rounded-3xl p-8 border shadow-2xl transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Logo with Enhanced 3D Effect using theme colors */}
            <div className="relative mb-8 flex justify-center">
              <div className={`w-40 h-40 mx-auto rounded-full ${themeStyles.logoContainer} flex items-center justify-center border-4 shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
                {/* Multiple 3D Shadow Effects using theme colors */}
                <div className={`absolute inset-0 rounded-full ${themeStyles.logoShadow} transform translate-x-4 translate-y-4 -z-20`}></div>
                <div className={`absolute inset-0 rounded-full ${themeStyles.logoShadow} opacity-50 transform translate-x-2 translate-y-2 -z-10`}></div>
                <div className="w-40 h-40 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                  <img 
                    src={currentLogo} 
                    alt="Pitu Logo" 
                    className="w-full h-full object-cover rounded-full transition-all duration-500"
                    key={isDarkMode ? 'dark-logo' : 'light-logo'} // Force re-render on theme change
                  />
                </div>
              </div>
              
              {/* Orbiting Elements with theme colors */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s' }}>
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-orange-400 rounded-full transform -translate-x-1/2 -translate-y-12"></div>
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-orange-500 rounded-full transform -translate-x-1/2 translate-y-12"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
                <div className="absolute top-1/2 right-0 w-3 h-3 bg-orange-300 rounded-full transform translate-x-12 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 w-4 h-4 bg-orange-600 rounded-full transform -translate-x-12 -translate-y-1/2"></div>
              </div>
            </div>

            <div className="text-center max-w-3xl mx-auto">
              <h1 className={`text-4xl md:text-5xl font-bold ${themeStyles.heading} mb-6 drop-shadow-lg`}>
                About Pitu
              </h1>
              <p className={`text-xl md:text-2xl ${themeStyles.subheading} mb-8 drop-shadow-md`}>
                Your AI-Powered Travel Companion
              </p>
              <p className={`text-lg ${themeStyles.text} leading-relaxed drop-shadow-sm`}>
                Pitu revolutionizes the way you travel by combining artificial intelligence with deep travel expertise. 
                We understand that every journey is unique, and our AI adapts to your personal preferences, budget, 
                and travel style to create unforgettable experiences.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className={`grid md:grid-cols-2 gap-6 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`${themeStyles.card} rounded-2xl p-6 border shadow-xl 
                           transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
                           ${activeFeature === index ? 'ring-2 ring-orange-400/50' : ''}
                           hover:-translate-y-2`}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 transform transition-transform duration-300 hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-bold ${themeStyles.heading} mb-3 drop-shadow-md`}>
                    {feature.title}
                  </h3>
                  <p className={`${themeStyles.text} leading-relaxed drop-shadow-sm`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className={`${themeStyles.card} rounded-3xl p-8 border shadow-2xl transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className={`text-3xl md:text-4xl font-bold ${themeStyles.heading} mb-6 drop-shadow-lg`}>
                Our Mission
              </h2>
              <p className={`text-lg ${themeStyles.text} leading-relaxed mb-8 drop-shadow-sm`}>
                At Pitu, we believe that travel should be accessible, personalized, and stress-free. Our mission is to 
                democratize travel planning by providing intelligent, AI-driven assistance that helps you discover new 
                destinations, optimize your itineraries, and create memories that last a lifetime.
              </p>
              
              {/* Call to Action */}
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-0 
                      group-hover:opacity-30 blur-md group-hover:blur-lg 
                      transition-all duration-500 scale-95 group-hover:scale-100" />
                  
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/50 to-orange-600/50 rounded-lg opacity-20 animate-pulse"></div>
                  
                  <button
                    onClick={() => navigate('/login')}
                    className={`relative px-10 py-3 ${themeStyles.button} rounded-lg font-bold 
                             transition-all duration-300 shadow-lg hover:shadow-2xl 
                             transform hover:scale-110 hover:-translate-y-2 z-10
                             border-2 border-transparent hover:border-orange-400/20
                             group-hover:shadow-orange-400/25`}
                  >
                    <span className="relative z-10">Start Your Journey</span>
                    
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-100/0 to-orange-200/0 
                                    group-hover:from-orange-100/20 group-hover:to-orange-200/20 transition-all duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
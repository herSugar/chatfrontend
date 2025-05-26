import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import logoImage from '../assets/images/logos.png';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Hero Section with 3D Background */}
      <div className="flex-1 relative bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col items-center justify-center p-4 overflow-hidden">
        
        {/* Animated 3D Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400/20 rounded-lg rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-300/15 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-300/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 left-10 w-8 h-8 bg-cyan-400/15 rounded-lg rotate-12 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-32 right-1/4 w-14 h-14 bg-pink-400/10 rounded-full animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3.5s' }}></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>
          
          {/* Floating Particles */}
          {[...Array(25)].map((_, i) => (
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

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className={`backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Logo with Enhanced 3D Effect */}
            <div className="relative mb-8 flex justify-center">
              <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-white to-indigo-100 flex items-center justify-center border-4 border-white/20 shadow-2xl transform hover:scale-110 transition-transform duration-300">
                {/* Multiple 3D Shadow Effects */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-indigo-900/30 transform translate-x-4 translate-y-4 -z-20"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-purple-900/20 transform translate-x-2 translate-y-2 -z-10"></div>
                <div className="w-40 h-40 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                  <img 
                    src={logoImage} 
                    alt="Pitu Logo" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              
              {/* Orbiting Elements with Different Speeds */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s' }}>
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-12"></div>
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-purple-400 rounded-full transform -translate-x-1/2 translate-y-12"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
                <div className="absolute top-1/2 right-0 w-3 h-3 bg-cyan-400 rounded-full transform translate-x-12 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 w-4 h-4 bg-pink-400 rounded-full transform -translate-x-12 -translate-y-1/2"></div>
              </div>
            </div>

            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                About Pitu
              </h1>
              <p className="text-xl md:text-2xl text-indigo-100 mb-8 drop-shadow-md">
                Your AI-Powered Travel Companion
              </p>
              <p className="text-lg text-indigo-200 leading-relaxed drop-shadow-sm">
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
                className={`backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl 
                           transform transition-all duration-500 hover:scale-105 hover:bg-white/10
                           ${activeFeature === index ? 'ring-2 ring-blue-400/50 bg-white/10' : ''}
                           hover:shadow-2xl hover:-translate-y-2`}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 transform transition-transform duration-300 hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md">
                    {feature.title}
                  </h3>
                  <p className="text-indigo-200 leading-relaxed drop-shadow-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className={`backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
                Our Mission
              </h2>
              <p className="text-lg text-indigo-200 leading-relaxed mb-8 drop-shadow-sm">
                At Pitu, we believe that travel should be accessible, personalized, and stress-free. Our mission is to 
                democratize travel planning by providing intelligent, AI-driven assistance that helps you discover new 
                destinations, optimize your itineraries, and create memories that last a lifetime.
              </p>
              
              {/* Call to Action */}
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg opacity-0 
                      group-hover:opacity-30 blur-md group-hover:blur-lg 
                      transition-all duration-500 scale-95 group-hover:scale-100" />
                  
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-lg opacity-20 animate-pulse"></div>
                  
                  <button
                    onClick={() => navigate('/login')}
                    className="relative px-10 py-3 bg-white text-indigo-800 rounded-lg font-bold 
                             hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-2xl 
                             transform hover:scale-110 hover:-translate-y-2 z-10
                             border-2 border-transparent hover:border-white/20
                             group-hover:shadow-blue-400/25"
                  >
                    <span className="relative z-10">Start Your Journey</span>
                    
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-100/0 to-purple-100/0 
                                    group-hover:from-blue-100/20 group-hover:to-purple-100/20 transition-all duration-300"></div>
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
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

// Theme context for sharing theme state across components
interface ThemeContextType {
  themeStyles: any;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeWrapper');
  }
  return context;
};

// Individual Bubble Component
interface BubbleProps {
  size: number;
  left: number;
  animationDuration: number;
  delay: number;
  className: string;
}

const Bubble: React.FC<BubbleProps> = ({ size, left, animationDuration, delay, className }) => {
  return (
    <div
      className={`absolute rounded-full ${className} animate-bubble`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        bottom: '-20px',
        animationDuration: `${animationDuration}s`,
        animationDelay: `${delay}s`,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite'
      }}
    />
  );
};

// Floating Bubbles Component
interface FloatingBubblesProps {
  bubbleCount?: number;
  isDarkMode: boolean;
}

const FloatingBubbles: React.FC<FloatingBubblesProps> = ({ bubbleCount = 15, isDarkMode }) => {
  const [bubbles, setBubbles] = React.useState<Array<{
    id: number;
    size: number;
    left: number;
    animationDuration: number;
    delay: number;
    opacity: number;
  }>>([]);

  React.useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = Array.from({ length: bubbleCount }, (_, i) => ({
        id: i,
        size: Math.random() * 80 + 30, // 30-110px for larger variety
        left: Math.random() * 100,
        animationDuration: Math.random() * 15 + 10, // 10-25 seconds for slower movement
        delay: Math.random() * 8,
        opacity: Math.random() * 0.4 + 0.1 // 0.1-0.5 for subtle appearance
      }));
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, [bubbleCount]);

  const bubbleClass = isDarkMode ? 'bg-orange-400/20' : 'bg-orange-500/30';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          size={bubble.size}
          left={bubble.left}
          animationDuration={bubble.animationDuration}
          delay={bubble.delay}
          className={bubbleClass}
        />
      ))}
    </div>
  );
};

// Theme Toggle Button Component
interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 ${
        isDarkMode 
          ? 'bg-gray-800 hover:bg-gray-700 text-orange-400' 
          : 'bg-white hover:bg-orange-50 text-orange-600'
      } border-2 ${
        isDarkMode ? 'border-gray-600' : 'border-orange-200'
      }`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300" />
      )}
    </button>
  );
};

interface ThemeWrapperProps {
  children: React.ReactNode;
  showBubbles?: boolean;
  bubbleCount?: number;
  showToggle?: boolean;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ 
  children, 
  showBubbles = true,
  bubbleCount = 15,
  showToggle = true
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null); // Start with null
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Load theme preference from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          setIsDarkMode(true);
        } else if (savedTheme === 'light') {
          setIsDarkMode(false);
        } else {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDarkMode(prefersDark);
        }
      } else {
        // Fallback if localStorage is not available
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Fallback to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    } finally {
      setIsLoading(false); // Set loading to false after theme is determined
    }
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    if (isDarkMode !== null) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Show loading screen while determining theme
  if (isLoading || isDarkMode === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  // Theme styles based on mode
  const getThemeStyles = (darkMode: boolean) => ({
    // Container and background styles - Updated for space black
    containerBg: darkMode ? 'bg-gray-950' : 'bg-gray-100',
    gradientBg: darkMode 
      ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950' 
      : 'bg-gradient-to-br from-orange-300 to-white',
    
    // Floating elements for background decoration
    floatingElements: {
      primary: darkMode ? 'bg-orange-400/20' : 'bg-orange-200/30',
      secondary: darkMode ? 'bg-white/10' : 'bg-black/10',
      tertiary: darkMode ? 'bg-orange-500/15' : 'bg-orange-300/25',
      quaternary: darkMode ? 'bg-white/5' : 'bg-black/5'
    },
    
    // Grid and particle effects
    grid: darkMode 
      ? 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)'
      : 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
    dots: darkMode ? 'bg-orange-400/20' : 'bg-orange-400/30',
    
    // Card and container styles
    mainBox: darkMode 
      ? 'bg-gray-800 border-orange-400/30 shadow-2xl' 
      : 'bg-white border-orange-300 shadow-xl',
    card: darkMode 
      ? 'backdrop-blur-sm bg-gray-800/90 border-orange-400/30 shadow-lg' 
      : 'backdrop-blur-sm bg-white/90 border-orange-200/50 shadow-lg',
    
    // Logo and image containers
    logoContainer: darkMode 
      ? 'bg-gradient-to-br from-gray-700 to-black border-orange-400/40' 
      : 'bg-gradient-to-br from-white to-orange-100 border-orange-200',
    logoShadow: darkMode 
      ? 'bg-gradient-to-br from-transparent to-orange-400/30' 
      : 'bg-gradient-to-br from-transparent to-orange-300/20',
    
    // Text colors
    heading: darkMode ? 'text-white' : 'text-gray-800',
    subheading: darkMode ? 'text-orange-400' : 'text-orange-600',
    text: darkMode ? 'text-gray-300' : 'text-gray-700',
    mutedText: darkMode ? 'text-gray-400' : 'text-gray-500',
    
    // Interactive elements
    button: darkMode 
      ? 'bg-orange-600 hover:bg-orange-500 text-white border-orange-500/30' 
      : 'bg-orange-600 hover:bg-orange-700 text-white border-orange-500/30',
    buttonSecondary: darkMode 
      ? 'bg-orange-400/20 hover:bg-orange-400/30 text-orange-400 border-orange-400/40' 
      : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300',
    
    // Special elements
    cursor: darkMode ? 'text-orange-400' : 'text-orange-500',
    arrow: darkMode ? 'text-orange-400' : 'text-orange-500',
    
    // Button overlays and glows
    buttonOverlay: darkMode 
      ? 'bg-gradient-to-r from-orange-400/0 to-orange-300/0 group-hover:from-orange-400/20 group-hover:to-orange-300/20' 
      : 'bg-gradient-to-r from-orange-100/0 to-orange-200/0 group-hover:from-orange-100/20 group-hover:to-orange-200/20',
    buttonGlow: darkMode 
      ? 'absolute -inset-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg opacity-0 group-hover:opacity-40 blur-md group-hover:blur-lg transition-all duration-500 scale-95 group-hover:scale-100'
      : 'absolute -inset-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-0 group-hover:opacity-30 blur-md group-hover:blur-lg transition-all duration-500 scale-95 group-hover:scale-100'
  });

  const themeStyles = getThemeStyles(isDarkMode);

  const contextValue = {
    themeStyles,
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={`min-h-screen transition-colors duration-500 ${themeStyles.containerBg}`}>
        {/* Space background overlay for dark mode */}
        {isDarkMode && (
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-950/10 to-purple-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950" />
          </div>
        )}

        {/* Theme Toggle Button */}
        {showToggle && <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}

        {/* Floating Bubbles - Fixed background */}
        {showBubbles && <FloatingBubbles bubbleCount={bubbleCount} isDarkMode={isDarkMode} />}

        {/* Global animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
          {/* Floating geometric shapes */}
          <div 
            className={`absolute top-20 left-10 w-20 h-20 ${themeStyles.floatingElements.primary} rounded-full animate-bounce`} 
            style={{ animationDelay: '0s', animationDuration: '3s' }}
          />
          <div 
            className={`absolute top-40 right-20 w-16 h-16 ${themeStyles.floatingElements.secondary} rounded-lg rotate-45 animate-pulse`} 
            style={{ animationDelay: '1s' }}
          />
          <div 
            className={`absolute bottom-40 left-20 w-12 h-12 ${themeStyles.floatingElements.tertiary} rounded-full animate-bounce`} 
            style={{ animationDelay: '2s', animationDuration: '4s' }}
          />
          <div 
            className={`absolute bottom-20 right-10 w-24 h-24 ${themeStyles.floatingElements.quaternary} rounded-full animate-pulse`} 
            style={{ animationDelay: '0.5s' }}
          />
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-15">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: themeStyles.grid,
                backgroundSize: '50px 50px',
                animation: 'gridMove 20s linear infinite'
              }}
            />
          </div>
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${themeStyles.dots} rounded-full animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Content wrapper with relative positioning */}
        <div className="relative z-20">
          {children}
        </div>

        {/* Global styles for animations */}
        <style>{`
          .bg-gradient-radial {
            background: radial-gradient(circle at center, var(--tw-gradient-stops));
          }

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

          @keyframes bubble {
            0% {
              opacity: 0;
              transform: translateY(0) translateX(0) scale(0.3);
            }
            10% {
              opacity: 0.6;
              transform: translateY(-10vh) translateX(0) scale(1);
            }
            90% {
              opacity: 0.3;
              transform: translateY(-90vh) translateX(5px) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-100vh) translateX(10px) scale(0.8);
            }
          }

          @keyframes bubbleFloat {
            0%, 100% {
              transform: translateX(0);
            }
            33% {
              transform: translateX(5px);
            }
            66% {
              transform: translateX(-3px);
            }
          }

          .animate-slide-in {
            animation: slideInFromBottom 0.8s ease-out forwards;
          }

          .animate-button-pulse {
            animation: buttonPulse 2s ease-in-out infinite;
          }

          .animate-bubble {
            animation: bubble linear infinite, bubbleFloat 6s ease-in-out infinite;
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeWrapper;
import React from 'react';
import LandingPage from '../components/LandingPage';
import FAQSection from '../components/FAQComponent';
import AboutPage from '../components/About';

const HomePage: React.FC = () => {
  return (
    <div className="scroll-smooth">
      <LandingPage />
      <AboutPage />
      <FAQSection />
    </div>
  );
};

export default HomePage;
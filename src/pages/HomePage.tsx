// import React from 'react';
// import LandingPage from '../components/LandingPage';
// import FAQSection from '../components/FAQComponent';
// import AboutPage from '../components/About';

// const HomePage: React.FC = () => {
//   return (
//     <div className="scroll-smooth">
//       <LandingPage />
//       <AboutPage />
//       <FAQSection />
//     </div>
//   );
// };

// export default HomePage;

// pages/HomePage.tsx
import React from 'react';
// import { ThemeWrapper } from '../components/ThemeWrapper';
import LandingPage from '../components/LandingPage';
import AboutPage from '../components/About'; // or About
import FAQSection from '../components/FAQComponent';

const HomePage: React.FC = () => {
  return (
      <main className="scroll-smooth">
        <section id="landing">
          <LandingPage />
        </section>
        <section id="about">
          <AboutPage />
        </section>
        <section id="faq">
          <FAQSection />
        </section>
      </main>
  );
};

export default HomePage;
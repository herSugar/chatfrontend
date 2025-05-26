import React, { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQComponent: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Get Started');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Sample FAQ data
  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'What is Bali Pitu?',
      answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      category: 'Get Started'
    },
    {
      id: '2',
      question: 'How do I sign up?',
      answer: 'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like',
      category: 'Get Started'
    },
    {
      id: '3',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers.',
      category: 'Payments'
    },
    {
      id: '4',
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings.',
      category: 'Payments'
    }
  ];

  // Get unique categories
  const categories: string[] = [...new Set(faqData.map(item => item.category))];

  // Filter items by active category
  const filteredItems: FAQItem[] = faqData.filter(item => item.category === activeCategory);

  const toggleItem = (id: string): void => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <>
      {/* Add custom animations to global CSS */}
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        .grid-animate {
          animation: gridMove 20s linear infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 relative overflow-hidden">
        {/* Same Animated 3D Background Elements as Landing Page */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Geometric Shapes */}
          <div 
            className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" 
            style={{ animationDelay: '0s', animationDuration: '3s' }}
          />
          <div 
            className="absolute top-40 right-20 w-16 h-16 bg-blue-400/20 rounded-lg rotate-45 animate-pulse" 
            style={{ animationDelay: '1s' }}
          />
          <div 
            className="absolute bottom-40 left-20 w-12 h-12 bg-purple-300/15 rounded-full animate-bounce" 
            style={{ animationDelay: '2s', animationDuration: '4s' }}
          />
          <div 
            className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-300/10 rounded-full animate-pulse" 
            style={{ animationDelay: '0.5s' }}
          />
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute inset-0 grid-animate" 
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />
          </div>
          
          {/* Floating Particles */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* FAQ Content Container */}
        <div className="relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
            
            <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-8 pb-4 overflow-x-auto">
              {categories.map((category: string) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setExpandedItem(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* FAQ items */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-6 drop-shadow-md">
                {activeCategory}
              </h2>
              
              {filteredItems.length === 0 ? (
                <p className="text-white/70">No questions in this category yet.</p>
              ) : (
                filteredItems.map((item: FAQItem) => (
                  <div 
                    key={item.id} 
                    className="overflow-hidden rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="flex justify-between items-center w-full text-left p-5 hover:bg-white/5 transition-colors duration-200"
                    >
                      <h3 className="text-lg font-medium text-white">{item.question}</h3>
                      <span 
                        className={`text-white text-xl transition-transform duration-300 ${
                          expandedItem === item.id ? 'rotate-180' : 'rotate-0'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    
                    <div 
                      className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedItem === item.id 
                          ? 'max-h-96 opacity-100 pb-5' 
                          : 'max-h-0 opacity-0 pb-0'
                      }`}
                    >
                      <div className="text-white/80">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQComponent;
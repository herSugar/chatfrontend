import React, { useState } from 'react';
import { useTheme } from '../components/ThemeWrapper'; // Import your theme hook

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQComponent: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Get Started');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { themeStyles } = useTheme(); // Use your theme context

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
    <div className="min-h-screen relative">
      {/* FAQ Content Container */}
      <div className="relative z-30 py-20 px-4">
        <div className={`max-w-4xl mx-auto ${themeStyles.card} rounded-3xl p-8 border shadow-2xl`}>
          
          <h1 className={`text-4xl font-bold ${themeStyles.heading} mb-8 text-center drop-shadow-lg`}>
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
                    ? `${themeStyles.button} shadow-lg`
                    : `${themeStyles.buttonSecondary} hover:shadow-md`
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* FAQ items */}
          <div className="space-y-4">
            <h2 className={`text-2xl font-semibold ${themeStyles.subheading} mb-6 drop-shadow-md`}>
              {activeCategory}
            </h2>
            
            {filteredItems.length === 0 ? (
              <p className={`${themeStyles.mutedText}`}>No questions in this category yet.</p>
            ) : (
              filteredItems.map((item: FAQItem) => (
                <div 
                  key={item.id} 
                  className={`overflow-hidden rounded-xl ${themeStyles.card} border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`flex justify-between items-center w-full text-left p-5 hover:bg-orange-100/10 transition-colors duration-200 group`}
                  >
                    <h3 className={`text-lg font-medium ${themeStyles.heading} group-hover:text-orange-500 transition-colors duration-200`}>
                      {item.question}
                    </h3>
                    <span 
                      className={`${themeStyles.text} text-xl transition-all duration-300 group-hover:text-orange-500 ${
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
                    <div className={`${themeStyles.text} border-t border-orange-200/20 pt-3`}>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Additional Help Section */}
          <div className={`mt-12 p-6 ${themeStyles.card} rounded-2xl border text-center`}>
            <h3 className={`text-xl font-semibold ${themeStyles.heading} mb-3`}>
              Still have questions?
            </h3>
            <p className={`${themeStyles.text} mb-4`}>
              Can't find the answer you're looking for? Please get in touch with our support team.
            </p>
            <button className={`${themeStyles.button} px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;
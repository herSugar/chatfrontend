import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">RAG Chatbot Wisata Bali</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <p className="text-lg text-gray-700 mb-6">
            Temukan informasi lengkap tentang wisata Bali dengan chatbot pintar kami. 
            Sistem akan menjawab berdasarkan pengetahuan terbaru tentang destinasi, 
            kuliner, dan budaya Bali.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <FeatureCard 
              icon="🌴" 
              title="Destinasi Wisata" 
              description="Rekomendasi tempat wisata terbaik di Bali"
            />
            <FeatureCard 
              icon="🍛" 
              title="Kuliner Khas" 
              description="Temukan makanan khas Bali yang wajib dicoba"
            />
            <FeatureCard 
              icon="🛕" 
              title="Budaya & Tradisi" 
              description="Pelajari budaya unik dan tradisi Bali"
            />
          </div>
          
          <button
            onClick={() => navigate('/chat')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all shadow-md hover:shadow-lg"
          >
            Mulai Bertanya Sekarang
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Dikembangkan oleh Hot Mom Hunter</p>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ 
  icon, 
  title, 
  description 
}) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="font-semibold text-blue-700 mb-1">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default LandingPage;
import React from 'react';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'community' | 'spiritual' | 'gamification' | 'ai' | 'mobile';
}

interface MascotInfo {
  name: string;
  type: string;
  description: string;
}

const features: Feature[] = [
  {
    id: "gamification",
    name: "Système XP Gamifié",
    description: "Gagnez des points d'expérience en participant activement à la communauté. Chaque action positive vous fait progresser et débloque de nouvelles fonctionnalités.",
    icon: "🎮",
    category: "gamification"
  },
  {
    id: "blog-system",
    name: "Système de Blog Communautaire",
    description: "Partagez vos réflexions, expériences et conseils avec la communauté à travers notre plateforme de blog intégrée.",
    icon: "📝",
    category: "community"
  },
  {
    id: "prayer-reminder",
    name: "Rappels de Prière Intelligents",
    description: "Recevez des notifications personnalisées pour les heures de prière, adaptées à votre localisation et vos préférences d'horaires de travail.",
    icon: "🕌",
    category: "spiritual"
  },
  {
    id: "mosque-finder",
    name: "Trouve ta Mosquée",
    description: "Localisez facilement les mosquées près de chez vous avec notre système de géolocalisation intégré.",
    icon: "📍",
    category: "spiritual"
  },
  {
    id: "ai-bot",
    name: "Agent IA Personnalisé",
    description: "Notre bot intelligent vous accompagne avec des conseils du jour, des réponses à vos questions et du contenu adapté à votre humeur.",
    icon: "🤖",
    category: "ai"
  },
  {
    id: "chatbot-mood",
    name: "Chatbot Émotionnel",
    description: "Un assistant conversationnel qui s'adapte à votre état d'esprit pour vous offrir le soutien le plus approprié.",
    icon: "💬",
    category: "ai"
  },
  {
    id: "announcements",
    name: "Système d'Annonces",
    description: "Publiez et découvrez des annonces communautaires : événements, services, entraide entre membres.",
    icon: "📢",
    category: "community"
  },
  {
    id: "notifications",
    name: "Notifications Multi-plateformes",
    description: "Restez connecté grâce à nos notifications par email et push mobile, optimisées pour une expérience positive.",
    icon: "🔔",
    category: "mobile"
  },
  {
    id: "mobile-app",
    name: "Application Mobile",
    description: "Accédez à Muzlife partout avec notre application mobile native, conçue pour une utilisation quotidienne fluide.",
    icon: "📱",
    category: "mobile"
  },
  {
    id: "gender-profiles",
    name: "Profils Adaptés",
    description: "Interface et fonctionnalités personnalisées selon les préférences et besoins spécifiques de chaque utilisateur.",
    icon: "👥",
    category: "community"
  }
];

const mascot: MascotInfo = {
  name: "Muza",
  type: "Chat",
  description: "Notre mascotte Muza, un chat bienveillant, vous guide à travers votre parcours sur Muzlife et vous accompagne dans vos interactions quotidiennes."
};

const AboutPage: React.FC = () => {
  const getCategoryFeatures = (category: Feature['category']) => {
    return features.filter(feature => feature.category === category);
  };

  const FeatureCard = ({ feature }: { feature: Feature }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{feature.icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{feature.name}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
    </div>
  );

  const CategorySection = ({ title, category, color }: { 
    title: string; 
    category: Feature['category']; 
    color: string;
  }) => {
    const categoryFeatures = getCategoryFeatures(category);
    if (categoryFeatures.length === 0) return null;

    return (
      <div className="mb-12">
        <h2 className={`text-2xl font-bold mb-6 ${color}`}>{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryFeatures.map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">À propos de Muzlife</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            La plateforme communautaire musulmane gamifiée
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="text-center mb-16">
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Muzlife est une plateforme innovante conçue pour rassembler la communauté musulmane 
            autour d'une expérience interactive et enrichissante. Notre mission est de créer un 
            espace numérique où spiritualité, communauté et technologie se rencontrent harmonieusement.
          </p>
        </div>

        {/* Mascot Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16 text-center">
          <div className="text-6xl mb-4">🐱</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Rencontrez {mascot.name}, notre mascotte
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {mascot.description}
          </p>
        </div>

        {/* Features by Category */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
            🚀 Nos Fonctionnalités
          </h1>
          
          <CategorySection 
            title="🎮 Gamification" 
            category="gamification" 
            color="text-purple-600" 
          />
          
          <CategorySection 
            title="🕌 Spiritualité" 
            category="spiritual" 
            color="text-green-600" 
          />
          
          <CategorySection 
            title="🤖 Intelligence Artificielle" 
            category="ai" 
            color="text-blue-600" 
          />
          
          <CategorySection 
            title="👥 Communauté" 
            category="community" 
            color="text-orange-600" 
          />
          
          <CategorySection 
            title="📱 Mobile" 
            category="mobile" 
            color="text-indigo-600" 
          />
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">🛠️ Notre Stack Technologique</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold mb-2">Base de données</h3>
              <p className="text-gray-300">PostgreSQL</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Architecture</h3>
              <p className="text-gray-300">Full-Stack TypeScript</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Plateformes</h3>
              <p className="text-gray-300">Web • Mobile • API REST</p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Notre Mission</h2>
          <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed mb-4">
            Chez Muzlife, nous croyons que la technologie peut servir à renforcer les liens spirituels 
            et communautaires. Notre plateforme gamifiée encourage la participation positive, 
            l'entraide et l'épanouissement personnel dans un environnement respectueux des valeurs islamiques.
          </p>
          <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Nous nous engageons à créer un espace numérique où chaque membre peut grandir spirituellement, 
            socialement et personnellement, tout en contribuant au bien-être de la communauté globale.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
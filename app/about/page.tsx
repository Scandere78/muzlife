import React from 'react';
import "../../styles/globals.css";

interface CurrentFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active';
}

interface FutureFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'coming-soon';
}

// Fonctionnalités actuellement implémentées basées sur CLAUDE.md et le codebase
const currentFeatures: CurrentFeature[] = [
  {
    id: "prayer-times",
    name: "Horaires de Prière",
    description: "Consultez les horaires de prière basés sur votre ville avec calculs précis et boussole Qibla intégrée.",
    icon: "🕌",
    status: "active"
  },
  {
    id: "quran-reading",
    name: "Lecture du Coran",
    description: "Lisez les sourates avec suivi de progression, système de favoris et gestion détaillée de vos sessions d'étude.",
    icon: "📖",
    status: "active"
  },
  {
    id: "audio-recitation",
    name: "Récitation Audio",
    description: "Écoutez le Coran récité par différents récitateurs renommés avec contrôles audio avancés et préférences personnalisées.",
    icon: "🎧",
    status: "active"
  },
  {
    id: "islamic-quiz",
    name: "Quiz Islamique",
    description: "Testez vos connaissances avec des questions par catégorie, suivi des scores et système de points avec indices.",
    icon: "🧠",
    status: "active"
  },
  {
    id: "user-dashboard",
    name: "Tableau de Bord Utilisateur",
    description: "Suivez vos statistiques de lecture, résultats de quiz, séries quotidiennes et progrès spirituel gamifié.",
    icon: "📊",
    status: "active"
  },
  {
    id: "wudu-tutorial",
    name: "Guide des Ablutions",
    description: "Tutoriel étape par étape pour apprendre et réviser les ablutions selon les enseignements islamiques.",
    icon: "💧",
    status: "active"
  },
  {
    id: "authentication",
    name: "Système d'Authentification",
    description: "Inscription sécurisée avec vérification email, gestion de profil et authentification JWT robuste.",
    icon: "🔐",
    status: "active"
  },
  {
    id: "dark-mode",
    name: "Mode Sombre/Clair",
    description: "Interface adaptative avec thème sombre et clair, optimisée pour une utilisation confortable à tout moment.",
    icon: "🌙",
    status: "active"
  },
  {
    id: "daily-citations",
    name: "Citations Quotidiennes",
    description: "Découvrez chaque jour une citation islamique inspirante sélectionnée pour nourrir votre réflexion spirituelle.",
    icon: "💭",
    status: "active"
  }
];

// Fonctionnalités à venir pour les prochaines versions
const futureFeatures: FutureFeature[] = [
  {
    id: "gamification",
    name: "Système XP Gamifié",
    description: "Gagnez des points d'expérience et débloquez des niveaux en participant activement aux activités spirituelles.",
    icon: "🎮",
    status: "coming-soon"
  },
  {
    id: "community-blog",
    name: "Blog Communautaire",
    description: "Partagez vos réflexions spirituelles et expériences avec la communauté à travers un système de blog intégré.",
    icon: "📝",
    status: "coming-soon"
  },
  {
    id: "prayer-notifications",
    name: "Rappels de Prière Intelligents",
    description: "Notifications personnalisées pour les heures de prière avec géolocalisation automatique et préférences avancées.",
    icon: "🔔",
    status: "coming-soon"
  },
  {
    id: "mosque-finder",
    name: "Localisation de Mosquées",
    description: "Trouvez facilement les mosquées près de chez vous avec carte interactive et informations détaillées.",
    icon: "📍",
    status: "coming-soon"
  },
  {
    id: "ai-companion",
    name: "Compagnon IA Spirituel",
    description: "Assistant intelligent personnalisé pour vous accompagner dans votre parcours spirituel avec conseils adaptés.",
    icon: "🤖",
    status: "coming-soon"
  },
  {
    id: "mobile-app",
    name: "Application Mobile Native",
    description: "Version mobile native avec synchronisation complète et fonctionnalités hors-ligne pour un accès permanent.",
    icon: "📱",
    status: "coming-soon"
  },
  {
    id: "community-features",
    name: "Fonctionnalités Communautaires",
    description: "Système d'annonces, groupes d'étude, forums de discussion et événements communautaires.",
    icon: "👥",
    status: "coming-soon"
  }
];

const AboutPage: React.FC = () => {
  const CurrentFeatureCard = ({ feature }: { feature: CurrentFeature }) => (
    <div className="bg-[var(--color-background)] dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mr-4">
          <span className="text-2xl">{feature.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-foreground)] dark:text-white mb-1">{feature.name}</h3>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            ✅ Disponible
          </span>
        </div>
      </div>
      <p className="text-[var(--color-foreground)] dark:text-gray-300 leading-relaxed">{feature.description}</p>
    </div>
  );

  const FutureFeatureCard = ({ feature }: { feature: FutureFeature }) => (
    <div className="bg-[var(--color-background)] dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
          <span className="text-2xl">{feature.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-foreground)] dark:text-white mb-1">{feature.name}</h3>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            🚧 À venir
          </span>
        </div>
      </div>
      <p className="text-[var(--color-foreground)] dark:text-gray-300 leading-relaxed">{feature.description}</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-8 pb-16" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-800 dark:text-white">
          À propos de MuzLife
        </h1>
        <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto text-green-700 dark:text-gray-200 mb-6">
          Votre compagnon spirituel numérique
        </p>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-[var(--color-foreground)] dark:text-gray-300 leading-relaxed mb-4">
            MuzLife est une plateforme islamique moderne qui accompagne les musulmans dans leur parcours spirituel quotidien. 
            Cette première version pose les fondations d'une <strong>magnifique histoire</strong> qui grandira avec notre Oumma.
          </p>
          <p className="text-base text-green-600 dark:text-green-400 font-medium">
            🌟 Version 1.0 - Le début d'un voyage spirituel partagé
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Fonctionnalités Actuelles */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              ✨ Fonctionnalités Disponibles
            </h2>
            <p className="text-lg text-[var(--color-foreground)] dark:text-gray-300 max-w-2xl mx-auto">
              Découvrez ce que MuzLife vous propose dès aujourd'hui
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFeatures.map(feature => (
              <CurrentFeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>

        {/* Fonctionnalités À Venir */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              🚧 Fonctionnalités À Venir
            </h2>
            <p className="text-lg text-[var(--color-foreground)] dark:text-gray-300 max-w-2xl mx-auto">
              L'aventure ne fait que commencer ! Voici ce qui vous attend dans les prochaines versions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureFeatures.map(feature => (
              <FutureFeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>

        

        {/* Notre Vision */}
        <div className="bg-[var(--color-background)] dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-[var(--color-border)] dark:border-gray-600 mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-6">
            🎯 Notre Vision
          </h2>
          <p className="text-[var(--color-foreground)] dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-4">
            MuzLife aspire à devenir <strong>la plateforme de référence</strong> pour la communauté musulmane francophone. 
            Cette première version n'est que le commencement d'une aventure qui évoluera selon vos besoins et vos retours.
          </p>
          <p className="text-[var(--color-foreground)] dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Ensemble, nous construisons un espace numérique où spiritualité et technologie s'harmonisent 
            pour servir notre Oumma et renforcer nos liens fraternels.
          </p>
        </div>

        {/* Appel à l'action */}
        <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-green-200 dark:border-green-700">
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
            🤝 Grandissons Ensemble
          </h3>
          <p className="text-lg text-[var(--color-foreground)] dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Vos retours et suggestions nous aident à faire évoluer MuzLife. 
            Cette magnifique histoire s'écrit avec vous, pour vous.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            📧 Contactez-nous pour partager vos idées et rejoindre l'aventure !
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
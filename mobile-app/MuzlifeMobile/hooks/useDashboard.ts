import { useState, useEffect, useCallback } from 'react';
import { muzlifeApi } from '../services/muzlifeApi';
import { UserStats, QuizResult, ReadingProgress } from '../types/api';

// Type pour les données du dashboard
type DashboardData = {
  user: { id: string; email: string; name: string | null };
  stats: UserStats | null;
  recentResults: QuizResult[];
  categoryStats: Record<string, { 
    total: number; 
    correct: number; 
    average: number; 
    totalScore: number;
  }>;
  readingStats: {
    todayVerses: number;
    weekVerses: number;
    totalVerses: number;
    currentPosition: { surah: number; verse: number } | null;
    streak: number;
    dailyGoal: number;
    goalProgress: number;
  };
  recentReadingProgress: ReadingProgress[];
};

// Hook personnalisé pour récupérer les données du dashboard
export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fonction pour charger les données
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Récupérer les données du dashboard depuis l'API
      const dashboardData = await muzlifeApi.getDashboardStats();
      
      setData(dashboardData);
    } catch (err) {
      console.error('Erreur lors du chargement du dashboard:', err);
      
      // En mode développement, utiliser des données d'exemple au lieu de montrer une erreur
      if (err instanceof Error && (err.message.includes('401') || err.message.includes('UNAUTHORIZED'))) {
        console.log('🔧 Mode développement : Utilisation de données d\'exemple pour le dashboard');
        // Ne pas définir d'erreur, laisser le composant utiliser les données par défaut
        setData(null);
      } else {
        // Gérer les autres erreurs
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        if (errorMessage.includes('NETWORK')) {
          setError('Erreur de connexion. Vérifiez votre connexion internet.');
        } else {
          setError(errorMessage || 'Erreur lors du chargement des données');
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fonction de rafraîchissement
  const refresh = useCallback(() => {
    return fetchDashboardData(true);
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refreshing,
    refresh,
  };
}

// Hook pour la citation du jour
export function useDailyQuote() {
  // Import des citations
  const quotes = [
    {
      text: "En vérité, c'est par l'évocation d'Allah que les cœurs se tranquillisent.",
      source: "Coran",
      reference: "Ar-Ra'd (13:28)",
    },
    {
      text: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
      source: "Hadith",
      reference: "Al-Bukhari",
    },
    {
      text: "Quiconque place sa confiance en Allah, Il lui suffit.",
      source: "Coran",
      reference: "At-Talaq (65:3)",
    },
    {
      text: "Les actes ne valent que par leurs intentions.",
      source: "Hadith",
      reference: "Al-Bukhari & Muslim",
    },
    {
      text: "Ô vous qui avez cru! Cherchez secours dans l'endurance et la prière.",
      source: "Coran",
      reference: "Al-Baqara (2:153)",
    },
    {
      text: "Facilitez et ne rendez pas les choses difficiles; annoncez la bonne nouvelle et ne repoussez pas.",
      source: "Hadith",
      reference: "Al-Bukhari",
    },
    {
      text: "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
      source: "Coran",
      reference: "Al-Baqara (2:286)",
    },
    {
      text: "Le fort n'est pas celui qui terrasse les gens, mais celui qui se maîtrise lorsqu'il est en colère.",
      source: "Hadith",
      reference: "Al-Bukhari & Muslim",
    },
  ];

  // Sélectionner une citation basée sur la date du jour
  const getDailyQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const quoteIndex = dayOfYear % quotes.length;
    return quotes[quoteIndex];
  };

  return getDailyQuote();
}
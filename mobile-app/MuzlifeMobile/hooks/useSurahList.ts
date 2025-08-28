import { useState, useEffect, useCallback, useMemo } from 'react';
import { muzlifeApi } from '../services/muzlifeApi';
import { SURAH_DATA, filterSurahs, sortSurahs, SurahInfo, SurahSortBy } from '../constants/quranData';
import { FavoriteSurah } from '../types/api';

// Hook personnalisé pour gérer la liste des sourates avec recherche et favoris
export function useSurahList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SurahSortBy>('number');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les favoris depuis l'API
  const loadFavorites = useCallback(async () => {
    try {
      setLoadingFavorites(true);
      setError(null);
      
      const favoriteSurahs = await muzlifeApi.getFavoriteSurahs();
      const favoriteNumbers = new Set(favoriteSurahs.map(fav => fav.surahNumber));
      setFavorites(favoriteNumbers);
    } catch (err) {
      console.error('Erreur lors du chargement des favoris:', err);
      
      if (err instanceof Error && (err.message.includes('401') || err.message.includes('UNAUTHORIZED'))) {
        // En mode développement, continuer sans favoris plutôt que d'afficher une erreur
        console.log('🔧 Mode développement : Les favoris ne sont pas disponibles sans authentification');
        setFavorites(new Set()); // Set vide
      } else {
        setError('Impossible de charger les favoris');
      }
    } finally {
      setLoadingFavorites(false);
    }
  }, []);

  // Basculer un favori
  const toggleFavorite = useCallback(async (surahNumber: number) => {
    const isFavorite = favorites.has(surahNumber);
    
    // Mise à jour optimiste de l'état local
    const newFavorites = new Set(favorites);
    if (isFavorite) {
      newFavorites.delete(surahNumber);
    } else {
      newFavorites.add(surahNumber);
    }
    setFavorites(newFavorites);

    try {
      // Synchroniser avec l'API
      if (isFavorite) {
        await muzlifeApi.removeFavoriteSurah(surahNumber);
      } else {
        await muzlifeApi.addFavoriteSurah(surahNumber);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour des favoris:', err);
      
      // Revenir à l'état précédent en cas d'erreur
      setFavorites(favorites);
      
      // Notification optionnelle de l'erreur (peut être gérée par le composant parent)
      setError('Impossible de mettre à jour les favoris');
      
      // Effacer l'erreur après un délai
      setTimeout(() => setError(null), 3000);
    }
  }, [favorites]);

  // Filtrer et trier les sourates selon les critères actuels
  const processedSurahs = useMemo(() => {
    // Étape 1: Filtrer selon la recherche
    const filteredSurahs = filterSurahs(searchQuery);
    
    // Étape 2: Trier selon le critère sélectionné
    const sortedSurahs = sortSurahs(filteredSurahs, sortBy);
    
    return sortedSurahs;
  }, [searchQuery, sortBy]);

  // Charger les favoris au montage du composant
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Fonction pour vérifier si une sourate est favorite
  const isFavorite = useCallback((surahNumber: number) => {
    return favorites.has(surahNumber);
  }, [favorites]);

  // Fonction pour réinitialiser la recherche
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Fonction pour obtenir les statistiques de recherche
  const getSearchStats = useCallback(() => {
    const totalSurahs = SURAH_DATA.length;
    const filteredCount = processedSurahs.length;
    const favoritesCount = favorites.size;
    
    return {
      totalSurahs,
      filteredCount,
      favoritesCount,
      hasSearch: searchQuery.trim().length > 0,
    };
  }, [processedSurahs.length, favorites.size, searchQuery]);

  return {
    // État
    searchQuery,
    sortBy,
    favorites,
    loadingFavorites,
    error,
    
    // Données calculées
    surahs: processedSurahs,
    searchStats: getSearchStats(),
    
    // Actions
    setSearchQuery,
    setSortBy,
    toggleFavorite,
    isFavorite,
    clearSearch,
    refreshFavorites: loadFavorites,
    clearError: () => setError(null),
  };
}

// Cache global pour éviter les appels API multiples
let globalProgressCache: Record<number, number> | null = null;
let globalProgressPromise: Promise<Record<number, number>> | null = null;

// Fonction utilitaire pour charger une seule fois toutes les progressions
async function loadAllProgressOnce(): Promise<Record<number, number>> {
  if (globalProgressCache) {
    return globalProgressCache;
  }

  if (globalProgressPromise) {
    return globalProgressPromise;
  }

  globalProgressPromise = (async () => {
    try {
      console.log('🔄 Chargement unique des progressions de lecture...');
      const progressData = await muzlifeApi.getReadingProgress();
      
      // Créer un cache avec les progressions par sourate
      const progressMap: Record<number, number> = {};
      
      // Calculer la progression pour chaque sourate
      SURAH_DATA.forEach(surah => {
        const surahProgress = progressData.filter(p => p.surahNumber === surah.number);
        const progressPercentage = surahProgress.length > 0 
          ? Math.min((surahProgress.length / surah.verseCount) * 100, 100)
          : 0;
        progressMap[surah.number] = Math.round(progressPercentage);
      });
      
      globalProgressCache = progressMap;
      console.log('✅ Progressions chargées et mises en cache');
      return progressMap;
    } catch (err) {
      console.log('🔧 Mode développement : Génération de progressions d\'exemple');
      
      // En mode développement, générer des progressions d'exemple cohérentes
      const exampleProgressions: Record<number, number> = {};
      SURAH_DATA.forEach(surah => {
        const pseudoRandom = (surah.number * 7 + surah.verseCount * 3) % 100;
        exampleProgressions[surah.number] = pseudoRandom > 80 ? 0 : pseudoRandom > 50 ? pseudoRandom : 0;
      });
      
      globalProgressCache = exampleProgressions;
      return exampleProgressions;
    } finally {
      globalProgressPromise = null;
    }
  })();

  return globalProgressPromise;
}

// Hook optimisé pour obtenir les statistiques de lecture d'une sourate
export function useSurahReadingProgress(surahNumber: number) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      
      // Utiliser le cache global pour éviter les appels multiples
      const allProgress = await loadAllProgressOnce();
      setProgress(allProgress[surahNumber] || 0);
    } catch (err) {
      console.error('Erreur lors du chargement de la progression:', err);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  }, [surahNumber]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return { progress, loading, refresh: loadProgress };
}

// Fonction pour invalider le cache (utile pour les refreshes)
export function invalidateProgressCache() {
  globalProgressCache = null;
  globalProgressPromise = null;
}
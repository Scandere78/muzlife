import { useState, useEffect, useCallback } from 'react';
import { muzlifeApi } from '../services/muzlifeApi';
import { getSurahInfo } from '../constants/quranData';
import { getSurahVerses, hasSurahRealContent, Verse } from '../constants/quranVerses';
import { ReadingProgress } from '../types/api';

// Type pour les paramètres de lecture
type ReadingSettings = {
  showTransliteration: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoMarkAsRead: boolean;
};

// Hook personnalisé pour gérer le lecteur de sourates
export function useSurahReader(surahNumber: number) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readVerses, setReadVerses] = useState<Set<number>>(new Set());
  const [favoriteVerses, setFavoriteVerses] = useState<Set<number>>(new Set());
  const [settings, setSettings] = useState<ReadingSettings>({
    showTransliteration: false,
    fontSize: 'medium',
    autoMarkAsRead: true,
  });
  const [currentVerse, setCurrentVerse] = useState<number | null>(null);

  // Informations de la sourate
  const surahInfo = getSurahInfo(surahNumber);
  const hasRealContent = hasSurahRealContent(surahNumber);

  // Charger les versets de la sourate
  const loadVerses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les versets (depuis l'API ou données locales)
      const surahVerses = getSurahVerses(surahNumber);
      setVerses(surahVerses);

      // Charger les progrès de lecture depuis l'API
      await loadReadingProgress();
      await loadFavoriteVerses();
    } catch (err) {
      console.error('Erreur lors du chargement des versets:', err);
      
      if (err instanceof Error && (err.message.includes('401') || err.message.includes('UNAUTHORIZED'))) {
        // En mode développement, utiliser les données locales
        console.log('🔧 Mode développement : Utilisation des données locales pour les versets');
        const surahVerses = getSurahVerses(surahNumber);
        setVerses(surahVerses);
      } else {
        setError('Impossible de charger les versets de cette sourate');
      }
    } finally {
      setLoading(false);
    }
  }, [surahNumber]);

  // Charger les progrès de lecture
  const loadReadingProgress = useCallback(async () => {
    try {
      const progressData = await muzlifeApi.getReadingProgress();
      const surahProgress = progressData
        .filter(p => p.surahNumber === surahNumber)
        .map(p => p.verseNumber);
      
      setReadVerses(new Set(surahProgress));
    } catch (err) {
      console.error('Erreur lors du chargement de la progression:', err);
      
      // En mode développement, générer une progression d'exemple
      if (err instanceof Error && (err.message.includes('401') || err.message.includes('UNAUTHORIZED'))) {
        const exampleRead = new Set<number>();
        // Marquer quelques versets comme lus pour la démo
        for (let i = 1; i <= Math.min(3, verses.length); i++) {
          if (Math.random() > 0.5) exampleRead.add(i);
        }
        setReadVerses(exampleRead);
      }
    }
  }, [surahNumber, verses.length]);

  // Charger les versets favoris
  const loadFavoriteVerses = useCallback(async () => {
    try {
      // Dans une vraie implémentation, on aurait une API pour les versets favoris
      // Pour l'instant, on utilise un Set vide
      setFavoriteVerses(new Set());
    } catch (err) {
      console.error('Erreur lors du chargement des favoris:', err);
      setFavoriteVerses(new Set());
    }
  }, []);

  // Marquer un verset comme lu
  const markVerseAsRead = useCallback(async (verseNumber: number) => {
    // Mise à jour optimiste
    const newReadVerses = new Set(readVerses);
    newReadVerses.add(verseNumber);
    setReadVerses(newReadVerses);

    try {
      await muzlifeApi.updateReadingProgress(surahNumber, verseNumber);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la progression:', err);
      
      // En mode développement, ne pas revenir en arrière
      if (!(err instanceof Error && (err.message.includes('401') || err.message.includes('UNAUTHORIZED')))) {
        // Revenir à l'état précédent en cas d'erreur réseau
        setReadVerses(readVerses);
        setError('Impossible de sauvegarder la progression');
      }
    }
  }, [surahNumber, readVerses]);

  // Basculer le statut favori d'un verset
  const toggleVerseAsFavorite = useCallback((verseNumber: number) => {
    const newFavorites = new Set(favoriteVerses);
    
    if (newFavorites.has(verseNumber)) {
      newFavorites.delete(verseNumber);
    } else {
      newFavorites.add(verseNumber);
    }
    
    setFavoriteVerses(newFavorites);

    // Dans une vraie implémentation, on synchroniserait avec l'API
    // Pour l'instant, c'est juste local
  }, [favoriteVerses]);

  // Naviguer vers un verset spécifique
  const goToVerse = useCallback((verseNumber: number) => {
    setCurrentVerse(verseNumber);
    
    // Auto-marquer comme lu si l'option est activée
    if (settings.autoMarkAsRead && !readVerses.has(verseNumber)) {
      markVerseAsRead(verseNumber);
    }
  }, [settings.autoMarkAsRead, readVerses, markVerseAsRead]);

  // Naviguer vers le verset suivant
  const goToNextVerse = useCallback(() => {
    if (currentVerse && currentVerse < verses.length) {
      goToVerse(currentVerse + 1);
    } else if (!currentVerse && verses.length > 0) {
      goToVerse(1);
    }
  }, [currentVerse, verses.length, goToVerse]);

  // Naviguer vers le verset précédent
  const goToPreviousVerse = useCallback(() => {
    if (currentVerse && currentVerse > 1) {
      goToVerse(currentVerse - 1);
    }
  }, [currentVerse, goToVerse]);

  // Mettre à jour les paramètres
  const updateSettings = useCallback((newSettings: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Calculer les statistiques de progression
  const getProgressStats = useCallback(() => {
    const totalVerses = verses.length;
    const readCount = readVerses.size;
    const favoriteCount = favoriteVerses.size;
    const progressPercentage = totalVerses > 0 ? Math.round((readCount / totalVerses) * 100) : 0;

    return {
      totalVerses,
      readCount,
      favoriteCount,
      progressPercentage,
      isComplete: readCount === totalVerses && totalVerses > 0,
    };
  }, [verses.length, readVerses.size, favoriteVerses.size]);

  // Charger les données au montage
  useEffect(() => {
    if (surahNumber && surahNumber >= 1 && surahNumber <= 114) {
      loadVerses();
    } else {
      setError('Numéro de sourate invalide');
      setLoading(false);
    }
  }, [surahNumber, loadVerses]);

  // Fonctions utilitaires
  const isVerseRead = useCallback((verseNumber: number) => readVerses.has(verseNumber), [readVerses]);
  const isVerseFavorite = useCallback((verseNumber: number) => favoriteVerses.has(verseNumber), [favoriteVerses]);

  return {
    // État
    verses,
    loading,
    error,
    settings,
    currentVerse,
    
    // Métadonnées
    surahInfo,
    hasRealContent,
    progressStats: getProgressStats(),
    
    // Actions
    markVerseAsRead,
    toggleVerseAsFavorite,
    goToVerse,
    goToNextVerse,
    goToPreviousVerse,
    updateSettings,
    refresh: loadVerses,
    clearError: () => setError(null),
    
    // Fonctions utilitaires
    isVerseRead,
    isVerseFavorite,
  };
}
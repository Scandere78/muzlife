import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface VerseState {
  id: string;
  userId: string;
  surahNumber: number;
  verseNumber: number;
  isRead: boolean;
  isMemorized: boolean;
  isFavorite: boolean;
  readCount: number;
  memorizationLevel: number;
  lastReadAt?: Date;
  lastMemorizedAt?: Date;
  readingTime: number;
  memorizationTime: number;
  pronunciationTime: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SurahStats {
  totalVerses: number;
  readVerses: number;
  memorizedVerses: number;
  favoriteVerses: number;
  readingProgress: number;
  memorizationProgress: number;
  totalStudyTime: number;
  timeBreakdown: {
    reading: number;
    memorization: number;
    pronunciation: number;
  };
}

interface UseVerseProgressReturn {
  verseStates: Record<number, VerseState>;
  surahStats: SurahStats | null;
  loading: boolean;
  error: string | null;
  markVerseRead: (verseNumber: number, timeSpent?: number) => Promise<void>;
  markVerseMemorized: (verseNumber: number, timeSpent?: number) => Promise<void>;
  toggleVerseFavorite: (verseNumber: number) => Promise<void>;
  updatePronunciationTime: (verseNumber: number, timeSpent: number) => Promise<void>;
  resetVerseMemorization: (verseNumber: number) => Promise<void>;
  refreshVerseStates: () => Promise<void>;
  getVerseState: (verseNumber: number) => VerseState | null;
  isVerseRead: (verseNumber: number) => boolean;
  isVerseMemorized: (verseNumber: number) => boolean;
  isVerseFavorite: (verseNumber: number) => boolean;
}

export function useVerseProgress(surahNumber: number): UseVerseProgressReturn {
  const { user } = useAuth();
  const [verseStates, setVerseStates] = useState<Record<number, VerseState>>({});
  const [surahStats, setSurahStats] = useState<SurahStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
  }, []);

  const fetchVerseStates = useCallback(async () => {
    if (!user || !surahNumber) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await authenticatedFetch(
        `/api/study/verse-state?surahNumber=${surahNumber}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Convertir le tableau en objet indexé par verseNumber
        const statesMap: Record<number, VerseState> = {};
        data.verseStates.forEach((state: VerseState) => {
          statesMap[state.verseNumber] = state;
        });
        
        setVerseStates(statesMap);
        setSurahStats(data.surahStats);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors du chargement des états');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [user, surahNumber, authenticatedFetch]);

  // Charger les états au montage et quand la sourate change
  useEffect(() => {
    fetchVerseStates();
  }, [fetchVerseStates]);

  const updateVerseState = useCallback(async (
    verseNumber: number, 
    action: string, 
    data?: any
  ) => {
    if (!user) return;
    
    try {
      const response = await authenticatedFetch('/api/study/verse-state', {
        method: 'POST',
        body: JSON.stringify({
          surahNumber,
          verseNumber,
          action,
          data,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Mise à jour optimiste
        setVerseStates(prev => ({
          ...prev,
          [verseNumber]: responseData.verseState,
        }));
        
        // Recalculer les statistiques localement pour une UX fluide
        const updatedStates = { ...verseStates, [verseNumber]: responseData.verseState };
        const states = Object.values(updatedStates);
        
        const newStats: SurahStats = {
          totalVerses: states.length,
          readVerses: states.filter(vs => vs.isRead).length,
          memorizedVerses: states.filter(vs => vs.isMemorized).length,
          favoriteVerses: states.filter(vs => vs.isFavorite).length,
          readingProgress: 0,
          memorizationProgress: 0,
          totalStudyTime: 0,
          timeBreakdown: {
            reading: states.reduce((acc, vs) => acc + vs.readingTime, 0),
            memorization: states.reduce((acc, vs) => acc + vs.memorizationTime, 0),
            pronunciation: states.reduce((acc, vs) => acc + vs.pronunciationTime, 0),
          },
        };
        
        newStats.readingProgress = newStats.totalVerses > 0 
          ? (newStats.readVerses / newStats.totalVerses) * 100 
          : 0;
        newStats.memorizationProgress = newStats.totalVerses > 0 
          ? (newStats.memorizedVerses / newStats.totalVerses) * 100 
          : 0;
        newStats.totalStudyTime = newStats.timeBreakdown.reading + 
          newStats.timeBreakdown.memorization + 
          newStats.timeBreakdown.pronunciation;
        
        setSurahStats(newStats);
        
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Erreur lors de l'action: ${action}`);
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  }, [user, surahNumber, authenticatedFetch, verseStates]);

  const markVerseRead = useCallback((verseNumber: number, timeSpent = 0) => {
    return updateVerseState(verseNumber, 'mark_read', { timeSpent });
  }, [updateVerseState]);

  const markVerseMemorized = useCallback((verseNumber: number, timeSpent = 0) => {
    return updateVerseState(verseNumber, 'mark_memorized', { timeSpent });
  }, [updateVerseState]);

  const toggleVerseFavorite = useCallback(async (verseNumber: number) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    try {
      const { toggleVerseFavorite } = await import('@/contexts/AuthContext');
      // On utilise l'API directement via AuthContext
      const authContext = useAuth();
      const result = await authContext.toggleVerseFavorite(surahNumber, verseNumber);
      
      if (result.success) {
        // Mise à jour optimiste de l'état local
        setVerseStates(prev => {
          const currentState = prev[verseNumber];
          if (currentState) {
            return {
              ...prev,
              [verseNumber]: {
                ...currentState,
                isFavorite: result.isFavorite,
                updatedAt: new Date(),
              }
            };
          } else {
            // Créer un nouvel état si pas existant
            return {
              ...prev,
              [verseNumber]: {
                id: `temp-${verseNumber}`,
                userId: user.email || '',
                surahNumber,
                verseNumber,
                isRead: false,
                isMemorized: false,
                isFavorite: result.isFavorite,
                readCount: 0,
                memorizationLevel: 0,
                readingTime: 0,
                memorizationTime: 0,
                pronunciationTime: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
              }
            };
          }
        });
        
        // Recalculer les stats
        setTimeout(() => {
          const states = Object.values(verseStates);
          const favoriteCount = states.filter(vs => vs.isFavorite).length + (result.isFavorite ? 1 : -1);
          setSurahStats(prev => prev ? {
            ...prev,
            favoriteVerses: Math.max(0, favoriteCount)
          } : null);
        }, 0);
      }
      
      return result;
    } catch (error) {
      setError('Erreur lors de la modification des favoris');
      throw error;
    }
  }, [user, surahNumber, verseStates]);

  const updatePronunciationTime = useCallback((verseNumber: number, timeSpent: number) => {
    return updateVerseState(verseNumber, 'update_pronunciation_time', { timeSpent });
  }, [updateVerseState]);

  const resetVerseMemorization = useCallback((verseNumber: number) => {
    return updateVerseState(verseNumber, 'reset_memorization');
  }, [updateVerseState]);

  const refreshVerseStates = useCallback(() => {
    return fetchVerseStates();
  }, [fetchVerseStates]);

  // Utilitaires pour accéder facilement aux états
  const getVerseState = useCallback((verseNumber: number): VerseState | null => {
    return verseStates[verseNumber] || null;
  }, [verseStates]);

  const isVerseRead = useCallback((verseNumber: number): boolean => {
    return verseStates[verseNumber]?.isRead || false;
  }, [verseStates]);

  const isVerseMemorized = useCallback((verseNumber: number): boolean => {
    return verseStates[verseNumber]?.isMemorized || false;
  }, [verseStates]);

  const isVerseFavorite = useCallback((verseNumber: number): boolean => {
    return verseStates[verseNumber]?.isFavorite || false;
  }, [verseStates]);

  return {
    verseStates,
    surahStats,
    loading,
    error,
    markVerseRead,
    markVerseMemorized,
    toggleVerseFavorite,
    updatePronunciationTime,
    resetVerseMemorization,
    refreshVerseStates,
    getVerseState,
    isVerseRead,
    isVerseMemorized,
    isVerseFavorite,
  };
}
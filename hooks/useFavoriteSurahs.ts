import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FavoriteSurah {
  id: string;
  userId: string;
  surahNumber: number;
  surahName: string;
  surahSlug: string;
  addedAt: string;
}

interface FavoriteSurahData {
  surahNumber: number;
  surahName: string;
  surahSlug: string;
}

interface UseFavoriteSurahsReturn {
  favorites: FavoriteSurah[];
  loading: boolean;
  error: string | null;
  isFavorite: (surahNumber: number) => boolean;
  toggleFavorite: (surahData: FavoriteSurahData) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
}

export function useFavoriteSurahs(): UseFavoriteSurahsReturn {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteSurah[]>([]);
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

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch('/api/favorites/surahs/get');
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré ou invalide, déconnecter l'utilisateur
          localStorage.removeItem('token');
          window.location.reload();
          return;
        }
        throw new Error('Erreur lors de la récupération des favoris');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur fetch favoris:', err);
    } finally {
      setLoading(false);
    }
  }, [user, authenticatedFetch]);

  const isFavorite = useCallback((surahNumber: number): boolean => {
    return favorites.some(fav => fav.surahNumber === surahNumber);
  }, [favorites]);

  const toggleFavorite = useCallback(async (surahData: FavoriteSurahData): Promise<boolean> => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    setError(null);

    try {
      const response = await authenticatedFetch('/api/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify({
          surahNumber: surahData.surahNumber,
          surahName: surahData.surahName,
          surahSlug: surahData.surahSlug,
          // Pas de verseNumber = favori de sourate entière
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.reload();
          return false;
        }
        throw new Error('Erreur lors de la modification du favori');
      }

      const data = await response.json();
      
      // Mettre à jour l'état local immédiatement
      if (data.isFavorite) {
        // Ajouter aux favoris
        const newFavorite: FavoriteSurah = {
          id: `temp-${Date.now()}`, // ID temporaire
          userId: user.id || user.email,
          surahNumber: surahData.surahNumber,
          surahName: surahData.surahName,
          surahSlug: surahData.surahSlug,
          addedAt: new Date().toISOString(),
        };
        setFavorites(prev => [newFavorite, ...prev]);
      } else {
        // Supprimer des favoris
        setFavorites(prev => prev.filter(fav => fav.surahNumber !== surahData.surahNumber));
      }

      return data.isFavorite;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur toggle favori:', err);
      throw err;
    }
  }, [user, authenticatedFetch]);


  const refreshFavorites = useCallback(async () => {
    await fetchFavorites();
  }, [fetchFavorites]);

  // Charger les favoris au montage du composant et quand l'utilisateur change
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    refreshFavorites,
  };
}
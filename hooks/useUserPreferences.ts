import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserPreferences {
  id: string;
  userId: string;
  // Préférences d'affichage
  arabicFontSize: number;
  phoneticFontSize: number;
  translationFontSize: number;
  preferredLanguage: string;
  // Préférences audio
  preferredReciter: string;
  defaultPlaybackSpeed: number;
  autoPlayNext: boolean;
  repeatCount: number;
  // Préférences d'étude
  defaultStudyMode: 'READING' | 'MEMORIZATION';
  showPhonetics: boolean;
  showTranslation: boolean;
  enableNotifications: boolean;
  // Objectifs personnalisés
  dailyReadingGoal: number;
  dailyMemorizationGoal: number;
  weeklyStudyTimeGoal: number;
  // Paramètres de rappel
  reminderTime?: string;
  studyDaysOfWeek: number[];
  createdAt: Date;
  updatedAt: Date;
}

interface UseUserPreferencesReturn {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

const defaultPreferences: Partial<UserPreferences> = {
  arabicFontSize: 24,
  phoneticFontSize: 16,
  translationFontSize: 14,
  preferredLanguage: 'fr',
  preferredReciter: 'mishary',
  defaultPlaybackSpeed: 1.0,
  autoPlayNext: false,
  repeatCount: 1,
  defaultStudyMode: 'READING',
  showPhonetics: true,
  showTranslation: true,
  enableNotifications: true,
  dailyReadingGoal: 10,
  dailyMemorizationGoal: 3,
  weeklyStudyTimeGoal: 300,
  studyDaysOfWeek: [1, 2, 3, 4, 5], // Lun-Ven
};

export function useUserPreferences(): UseUserPreferencesReturn {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
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

  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Si pas d'utilisateur connecté, utiliser les préférences par défaut
    if (!user) {
      setPreferences({ 
        ...defaultPreferences,
        id: 'default',
        userId: 'anonymous',
        createdAt: new Date(),
        updatedAt: new Date()
      } as UserPreferences);
      setLoading(false);
      return;
    }
    
    try {
      const response = await authenticatedFetch('/api/study/preferences');
      
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors du chargement des préférences');
        // Fallback aux préférences par défaut
        setPreferences({ 
          ...defaultPreferences,
          id: 'fallback',
          userId: user.email,
          createdAt: new Date(),
          updatedAt: new Date()
        } as UserPreferences);
      }
    } catch (err) {
      setError('Erreur de connexion');
      // En cas d'erreur, utiliser les préférences par défaut
      setPreferences({ 
        ...defaultPreferences,
        id: 'error',
        userId: user.email,
        createdAt: new Date(),
        updatedAt: new Date()
      } as UserPreferences);
    } finally {
      setLoading(false);
    }
  }, [user, authenticatedFetch]);

  // Charger les préférences au montage
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return;
    
    setLoading(true);
    setError(null);
    
    // Mise à jour optimiste
    const optimisticPreferences = { ...preferences, ...updates };
    setPreferences(optimisticPreferences);
    
    try {
      const response = await authenticatedFetch('/api/study/preferences', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      } else {
        // Revenir aux anciennes préférences en cas d'erreur
        setPreferences(preferences);
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      // Revenir aux anciennes préférences en cas d'erreur
      setPreferences(preferences);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [user, preferences, authenticatedFetch]);

  const resetPreferences = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await authenticatedFetch('/api/study/preferences', {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la réinitialisation');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [user, authenticatedFetch]);

  const refreshPreferences = useCallback(() => {
    return fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    resetPreferences,
    refreshPreferences,
  };
}
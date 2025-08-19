import { create } from 'zustand';
import { UserStats, UserPreferences } from '../types/api';
import muzlifeApi from '../services/muzlifeApi';

interface UserState {
  // État
  stats: UserStats | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadUserStats: () => Promise<void>;
  loadUserPreferences: () => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // État initial
  stats: null,
  preferences: null,
  isLoading: false,
  error: null,

  // Charger les statistiques utilisateur
  loadUserStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const stats = await muzlifeApi.getUserStats();
      set({ stats, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Erreur lors du chargement des statistiques'
      });
    }
  },

  // Charger les préférences utilisateur
  loadUserPreferences: async () => {
    try {
      const preferences = await muzlifeApi.getUserPreferences();
      set({ preferences });
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  },

  // Mettre à jour les préférences utilisateur
  updateUserPreferences: async (newPreferences: Partial<UserPreferences>) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedPreferences = await muzlifeApi.updateUserPreferences(newPreferences);
      set({ 
        preferences: updatedPreferences, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Erreur lors de la mise à jour des préférences'
      });
      throw error;
    }
  },

  // Effacer les erreurs
  clearError: () => {
    set({ error: null });
  },
}));
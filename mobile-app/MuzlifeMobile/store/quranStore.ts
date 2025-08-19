import { create } from 'zustand';
import { Surah, ReadingProgress, FavoriteSurah, VerseState } from '../types/api';
import muzlifeApi from '../services/muzlifeApi';

interface QuranState {
  // État
  surahs: Surah[];
  currentSurah: Surah | null;
  readingProgress: ReadingProgress[];
  favoriteSurahs: FavoriteSurah[];
  verseStates: Record<string, VerseState>; // key: "surah-verse"
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSurahs: () => Promise<void>;
  loadReadingProgress: () => Promise<void>;
  loadFavoriteSurahs: () => Promise<void>;
  setCurrentSurah: (surah: Surah) => void;
  updateReadingProgress: (surahNumber: number, verseNumber: number) => Promise<void>;
  toggleFavoriteSurah: (surahNumber: number) => Promise<void>;
  clearError: () => void;
}

export const useQuranStore = create<QuranState>((set, get) => ({
  // État initial
  surahs: [],
  currentSurah: null,
  readingProgress: [],
  favoriteSurahs: [],
  verseStates: {},
  isLoading: false,
  error: null,

  // Charger la liste des sourates
  loadSurahs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const surahs = await muzlifeApi.getSurahs();
      set({ surahs, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Erreur lors du chargement des sourates'
      });
    }
  },

  // Charger la progression de lecture
  loadReadingProgress: async () => {
    try {
      const progress = await muzlifeApi.getReadingProgress();
      set({ readingProgress: progress });
    } catch (error) {
      console.error('Erreur lors du chargement de la progression:', error);
    }
  },

  // Charger les sourates favorites
  loadFavoriteSurahs: async () => {
    try {
      const favorites = await muzlifeApi.getFavoriteSurahs();
      set({ favoriteSurahs: favorites });
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  },

  // Définir la sourate actuelle
  setCurrentSurah: (surah: Surah) => {
    set({ currentSurah: surah });
  },

  // Mettre à jour la progression de lecture
  updateReadingProgress: async (surahNumber: number, verseNumber: number) => {
    try {
      const newProgress = await muzlifeApi.updateReadingProgress(surahNumber, verseNumber);
      
      set((state) => ({
        readingProgress: [
          ...state.readingProgress.filter(
            p => !(p.surahNumber === surahNumber && p.verseNumber === verseNumber)
          ),
          newProgress
        ]
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
      throw error;
    }
  },

  // Basculer une sourate en favori
  toggleFavoriteSurah: async (surahNumber: number) => {
    const { favoriteSurahs } = get();
    const isFavorite = favoriteSurahs.some(f => f.surahNumber === surahNumber);
    
    try {
      if (isFavorite) {
        await muzlifeApi.removeFavoriteSurah(surahNumber);
        set((state) => ({
          favoriteSurahs: state.favoriteSurahs.filter(f => f.surahNumber !== surahNumber)
        }));
      } else {
        const newFavorite = await muzlifeApi.addFavoriteSurah(surahNumber);
        set((state) => ({
          favoriteSurahs: [...state.favoriteSurahs, newFavorite]
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
      throw error;
    }
  },

  // Effacer les erreurs
  clearError: () => {
    set({ error: null });
  },
}));
import { create } from 'zustand';
import { User, LoginCredentials, RegisterData, ApiError } from '../types/api';
import muzlifeApi from '../services/muzlifeApi';

interface AuthState {
  // État
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // État initial
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Action de connexion
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await muzlifeApi.login(credentials);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Erreur de connexion';
      set({ 
        isLoading: false, 
        error: errorMessage,
        user: null,
        isAuthenticated: false
      });
      throw error;
    }
  },

  // Action d'inscription
  register: async (userData: RegisterData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await muzlifeApi.register(userData);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Erreur d\'inscription';
      set({ 
        isLoading: false, 
        error: errorMessage,
        user: null,
        isAuthenticated: false
      });
      throw error;
    }
  },

  // Action de déconnexion
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await muzlifeApi.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, on déconnecte localement
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
    }
  },

  // Charger l'utilisateur actuel (au démarrage de l'app)
  loadUser: async () => {
    if (!muzlifeApi.isAuthenticated) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    
    try {
      const user = await muzlifeApi.getCurrentUser();
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
    }
  },

  // Mettre à jour le profil utilisateur
  updateUser: async (userData: Partial<User>) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedUser = await muzlifeApi.updateProfile(userData);
      set({ 
        user: updatedUser, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Erreur de mise à jour';
      set({ 
        isLoading: false, 
        error: errorMessage
      });
      throw error;
    }
  },

  // Effacer les erreurs
  clearError: () => {
    set({ error: null });
  },
}));
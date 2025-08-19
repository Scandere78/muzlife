import * as SecureStore from 'expo-secure-store';
import { 
  User, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  ApiError,
  UserStats,
  QuizResult,
  ReadingProgress,
  UserPreferences,
  FavoriteSurah,
  Question,
  Category,
  PrayerTimes,
  Surah
} from '../types/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'muzlife_auth_token';

class MuzlifeApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.initializeToken();
  }

  private async initializeToken() {
    try {
      this.token = await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.token) {
      this.token = await SecureStore.getItemAsync(TOKEN_KEY);
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token invalide, nettoyer l'authentification
        await this.clearAuth();
        throw new ApiError('Session expirée', 'UNAUTHORIZED', response.status);
      }
      
      const errorData = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new ApiError(errorData.message || 'Erreur API', 'API_ERROR', response.status);
    }

    return response.json();
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        timeout: 10000, // 10 secondes
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur de connexion', 'NETWORK_ERROR');
    }
  }

  // Méthodes d'authentification
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Sauvegarder le token
    await SecureStore.setItemAsync(TOKEN_KEY, response.token);
    this.token = response.token;

    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Sauvegarder le token
    await SecureStore.setItemAsync(TOKEN_KEY, response.token);
    this.token = response.token;

    return response;
  }

  async logout(): Promise<void> {
    await this.clearAuth();
  }

  private async clearAuth(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      this.token = null;
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/user/profile');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<User>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Méthodes pour les statistiques
  async getUserStats(): Promise<UserStats> {
    return this.request<UserStats>('/api/dashboard/stats');
  }

  // Méthodes pour la lecture du Coran
  async getReadingProgress(): Promise<ReadingProgress[]> {
    return this.request<ReadingProgress[]>('/api/reading/progress');
  }

  async updateReadingProgress(surahNumber: number, verseNumber: number): Promise<ReadingProgress> {
    return this.request<ReadingProgress>('/api/reading/progress', {
      method: 'POST',
      body: JSON.stringify({ surahNumber, verseNumber }),
    });
  }

  async getSurahs(): Promise<Surah[]> {
    return this.request<Surah[]>('/api/quran/surahs');
  }

  // Méthodes pour les favoris
  async getFavoriteSurahs(): Promise<FavoriteSurah[]> {
    return this.request<FavoriteSurah[]>('/api/favorites/surahs');
  }

  async addFavoriteSurah(surahNumber: number): Promise<FavoriteSurah> {
    return this.request<FavoriteSurah>('/api/favorites/surahs', {
      method: 'POST',
      body: JSON.stringify({ surahNumber }),
    });
  }

  async removeFavoriteSurah(surahNumber: number): Promise<void> {
    return this.request<void>(`/api/favorites/surahs/${surahNumber}`, {
      method: 'DELETE',
    });
  }

  // Méthodes pour les préférences
  async getUserPreferences(): Promise<UserPreferences> {
    return this.request<UserPreferences>('/api/user/preferences');
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return this.request<UserPreferences>('/api/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Méthodes pour les quiz
  async getQuizCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/quiz/categories');
  }

  async getQuizQuestions(categoryId: string, difficulty?: string): Promise<Question[]> {
    const params = new URLSearchParams();
    if (difficulty) params.append('difficulty', difficulty);
    
    return this.request<Question[]>(`/api/quiz/questions/${categoryId}?${params.toString()}`);
  }

  async submitQuizResult(result: Omit<QuizResult, 'id' | 'createdAt'>): Promise<QuizResult> {
    return this.request<QuizResult>('/api/quiz/results', {
      method: 'POST',
      body: JSON.stringify(result),
    });
  }

  async getQuizResults(): Promise<QuizResult[]> {
    return this.request<QuizResult[]>('/api/quiz/results');
  }

  // Méthodes pour les heures de prière
  async getPrayerTimes(city: string): Promise<PrayerTimes> {
    return this.request<PrayerTimes>(`/api/prayer-times?city=${encodeURIComponent(city)}`);
  }

  // Méthode utilitaire pour vérifier la connexion
  async checkConnection(): Promise<boolean> {
    try {
      await this.request<{ status: string }>('/api/health');
      return true;
    } catch {
      return false;
    }
  }

  // Getter pour vérifier si l'utilisateur est connecté
  get isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Exporter une instance singleton
export const muzlifeApi = new MuzlifeApiService();
export default muzlifeApi;
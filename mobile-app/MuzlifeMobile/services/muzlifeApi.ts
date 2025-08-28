import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
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

// Configuration selon la plateforme :
// - Web : localhost direct
// - Émulateur Android : 10.0.2.2 (IP spéciale pour accéder au localhost de l'hôte)
// - Téléphone physique : IP du PC sur le réseau local
const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000' 
  : (process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000');
const TOKEN_KEY = 'muzlife_auth_token';

// Utilitaire pour gérer le stockage sécurisé sur toutes les plateformes
class SecureStorage {
  static async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      // Sur web, utiliser localStorage
      return localStorage.getItem(key);
    } else {
      // Sur mobile, utiliser SecureStore
      return await SecureStore.getItemAsync(key);
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Sur web, utiliser localStorage
      localStorage.setItem(key, value);
    } else {
      // Sur mobile, utiliser SecureStore
      await SecureStore.setItemAsync(key, value);
    }
  }

  static async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Sur web, utiliser localStorage
      localStorage.removeItem(key);
    } else {
      // Sur mobile, utiliser SecureStore
      await SecureStore.deleteItemAsync(key);
    }
  }
}

class MuzlifeApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.initializeToken();
  }

  private async initializeToken() {
    try {
      this.token = await SecureStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.token) {
      this.token = await SecureStorage.getItem(TOKEN_KEY);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

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
    await SecureStorage.setItem(TOKEN_KEY, response.token);
    this.token = response.token;

    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Sauvegarder le token
    await SecureStorage.setItem(TOKEN_KEY, response.token);
    this.token = response.token;

    return response;
  }

  async logout(): Promise<void> {
    await this.clearAuth();
  }

  private async clearAuth(): Promise<void> {
    try {
      await SecureStorage.deleteItem(TOKEN_KEY);
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

  // Méthode pour récupérer toutes les stats du dashboard
  async getDashboardStats(): Promise<{
    user: { id: string; email: string; name: string | null };
    stats: UserStats | null;
    recentResults: QuizResult[];
    categoryStats: Record<string, { total: number; correct: number; average: number; totalScore: number }>;
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
  }> {
    return this.request('/api/dashboard/stats');
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

  // Méthodes pour les heures de prière (pas d'auth requise)
  async getPrayerTimes(city: string): Promise<PrayerTimes> {
    const url = `${this.baseURL}/api/prayer-times?city=${encodeURIComponent(city)}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      // Extraire les données de l'API et les formater selon notre interface PrayerTimes
      if (data.data && data.data.timings) {
        const timings = data.data.timings;
        const date = data.data.date;
        
        return {
          city: city,
          country: 'France', // Par défaut, on peut l'améliorer plus tard
          date: date.readable || new Date().toLocaleDateString(),
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha,
        };
      }
      
      throw new Error('Format de réponse API invalide');
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      if (error instanceof Error) {
        throw new ApiError(error.message, 'PRAYER_TIMES_ERROR');
      }
      throw new ApiError('Erreur de connexion', 'NETWORK_ERROR');
    }
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

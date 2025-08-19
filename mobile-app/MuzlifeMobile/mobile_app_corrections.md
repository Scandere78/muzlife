# Corrections Mobile App Update

## Points Corrigés/Ajoutés

### 1. ✅ Commandes pnpm
- Remplacé `npx create-expo-app` par `pnpm create expo-app`
- Toutes les commandes d'installation utilisent `pnpm` comme demandé

### 2. 🗄️ Structure Sans src/
- Architecture similaire à Next.js (pas de dossier src/)
- Structure à la racine comme ton projet web actuel

### 3. 🔗 Intégration Backend Complète
**APIs Existantes Réutilisées :**
- `/api/auth` - Système JWT avec `jose` library
- `/api/prayer-times` - Heures de prière par ville
- `/api/reading/progress` - Progression Coran
- `/api/favorites` - Favoris sourates/versets
- `/api/dashboard/stats` - Statistiques gamifiées
- `/api/quiz` - Questions et résultats
- `/api/user/profile` - Profil et préférences

**Modèles Prisma Existants :**
```typescript
// Tous tes modèles sont réutilisables
User, UserStats, QuizResult, ReadingProgress, 
VerseState, StudySession, UserPreferences, 
FavoriteSurah, Question, Category
```

### 4. 🔧 Service API Unifié
```typescript
// services/muzlifeApi.ts
class MuzlifeApiService {
  private baseURL = process.env.EXPO_PUBLIC_API_URL;
  
  // Utilise directement tes endpoints Next.js
  async login() { return this.post('/api/auth/login'); }
  async getPrayerTimes() { return this.get('/api/prayer-times'); }
  async getReadingProgress() { return this.get('/api/reading/progress'); }
  // ... tous tes endpoints existants
}
```

### 5. 🎣 Hooks Adaptés
Tes hooks existants peuvent être adaptés :
- `useCompass` → Service Qibla mobile
- `useReadingTracker` → Progression mobile
- `useAudioManager` → Audio player mobile
- `useUserPreferences` → Préférences mobile

### 6. 🔐 AuthContext Mobile
Adaptation de ton `AuthContext` existant avec `expo-secure-store` au lieu de `localStorage`

## Structure Corrigée (sans src/)
```
MuzlifeMobile/
├── app/               # Point d'entrée Expo
├── components/        # Comme ton Next.js
├── screens/          # Écrans mobiles
├── services/         # API calls vers ton backend
├── hooks/            # Adaptation de tes hooks
├── store/            # Zustand
├── types/            # Types TypeScript partagés
├── utils/            # Utilitaires
├── navigation/       # React Navigation
└── constants/        # Configs
```

## Avantages
✅ **Zero Backend Changes** - Ton Next.js reste identique  
✅ **Réutilisation Maximale** - Toute ta logique business  
✅ **Modèles Identiques** - Pas de duplication Prisma  
✅ **Auth Compatible** - Même système JWT  
✅ **pnpm Everywhere** - Comme demandé  
✅ **Structure Familière** - Comme ton Next.js  

Tu peux maintenant développer ton mobile en réutilisant 90% de ton travail backend existant !
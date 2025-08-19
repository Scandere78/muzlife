# 📱 Guide de la Codebase React Native Muzlife

## 🎯 Vue d'ensemble : Next.js vs React Native

Cette documentation t'explique comment naviguer dans la codebase React Native en utilisant tes connaissances de Next.js 15.

### 🔄 Parallèles Architecture

| Aspect | Next.js 15 | React Native + Expo |
|--------|------------|---------------------|
| **Point d'entrée** | `app/layout.tsx` + `app/page.tsx` | `App.tsx` + `AppNavigator.tsx` |
| **Routing** | File-based (`app/dashboard/page.tsx`) | Programmatique (`<Stack.Screen name="Dashboard">`) |
| **Components** | `components/ui/button.tsx` | `components/ui/Button.tsx` |
| **State Management** | Context API / Zustand | Zustand (identique) |
| **API Calls** | `fetch()` + Server Actions | `fetch()` uniquement |
| **Styling** | TailwindCSS | StyleSheet API |
| **Types** | TypeScript (identique) | TypeScript (identique) |

---

## 📂 Structure de l'Application

### Comparaison des Structures

#### 🌐 Next.js 15 (ton projet actuel)
```
muzlife/
├── app/                    # App Router
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx           # Page d'accueil
│   ├── dashboard/         # Route /dashboard
│   └── api/               # API Routes
├── components/            # Composants réutilisables
├── lib/                   # Utilitaires
└── types/                 # Types TypeScript
```

#### 📱 React Native (nouveau projet)
```
MuzlifeMobile/
├── App.tsx               # Point d'entrée (= layout.tsx)
├── navigation/           # Navigation (= app router)
├── screens/             # Écrans (= pages)
├── components/          # Composants (identique)
├── services/           # API calls (= lib)
├── store/             # State global (Zustand)
└── types/             # Types (identique)
```

---

## 🧭 Navigation : File-based vs Programmatique

### Next.js 15 - File-based Routing
```typescript
// Automatique basé sur la structure des fichiers
app/
├── page.tsx           → /
├── dashboard/page.tsx → /dashboard
└── profile/page.tsx   → /profile
```

### React Native - Navigation Programmatique
```typescript
// navigation/AppNavigator.tsx
function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

### 🔗 Navigation entre pages

#### Next.js
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
```

#### React Native
```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('Dashboard');
```

---

## 🎨 Styling : TailwindCSS vs StyleSheet

### Next.js + TailwindCSS
```typescript
export default function Button() {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded">
      Click me
    </button>
  );
}
```

### React Native + StyleSheet
```typescript
import { StyleSheet } from 'react-native';

export default function Button() {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>Click me</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3B82F6', // bg-blue-500
    paddingHorizontal: 16,      // px-4
    paddingVertical: 8,         // py-2
    borderRadius: 8,            // rounded
  },
  text: {
    color: '#FFFFFF',           // text-white
  },
});
```

---

## 🗂️ Composants : HTML vs React Native

### Équivalences des éléments

| Next.js (HTML) | React Native | Usage |
|----------------|--------------|-------|
| `<div>` | `<View>` | Conteneur |
| `<p>`, `<span>` | `<Text>` | Texte |
| `<button>` | `<TouchableOpacity>` | Bouton |
| `<input>` | `<TextInput>` | Champ de saisie |
| `<img>` | `<Image>` | Image |
| `<ul>`, `<ol>` | `<FlatList>` | Liste |

### Exemple de conversion

#### Next.js
```typescript
export default function Card({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
```

#### React Native
```typescript
import { View, Text, StyleSheet } from 'react-native';

export default function Card({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
```

---

## 🔌 API & State Management

### Gestion des APIs (Identique à Next.js)

#### Service API
```typescript
// services/muzlifeApi.ts (ressemble à lib/api.ts)
class MuzlifeApiService {
  private baseURL = process.env.EXPO_PUBLIC_API_URL;
  
  async getUser() {
    const response = await fetch(`${this.baseURL}/api/user/profile`);
    return response.json();
  }
}
```

### State Management avec Zustand (Identique)

#### Next.js & React Native
```typescript
// store/authStore.ts (exactement pareil)
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  login: async (credentials) => {
    const user = await api.login(credentials);
    set({ user });
  },
}));
```

---

## 📁 Détail des Dossiers

### `/navigation` - Équivalent du App Router

#### Fichiers clés
- `AppNavigator.tsx` → Point d'entrée navigation (= `app/layout.tsx`)
- `types.ts` → Types pour la navigation
- `AuthNavigator.tsx` → Navigation authentification
- `QuranNavigator.tsx` → Navigation section Coran

#### Utilisation
```typescript
// navigation/types.ts
type RootStackParamList = {
  Dashboard: undefined;
  Profile: { userId: string };
};

// Dans un composant
navigation.navigate('Profile', { userId: '123' });
```

### `/screens` - Équivalent des Pages

#### Structure
```
screens/
├── Auth/
│   ├── LoginScreen.tsx     → app/login/page.tsx
│   └── RegisterScreen.tsx  → app/register/page.tsx
├── Dashboard/
│   └── DashboardScreen.tsx → app/dashboard/page.tsx
└── Profile/
    └── ProfileScreen.tsx   → app/profile/page.tsx
```

#### Exemple d'écran
```typescript
// screens/Dashboard/DashboardScreen.tsx
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Contenu de l'écran */}
    </SafeAreaView>
  );
}
```

### `/components` - Composants Réutilisables

#### Structure identique à Next.js
```
components/
├── ui/              # Composants de base
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── forms/           # Formulaires
└── shared/          # Composants partagés
```

### `/store` - State Management (Zustand)

#### Stores configurés
- `authStore.ts` → Authentification
- `quranStore.ts` → Gestion du Coran
- `userStore.ts` → Profil utilisateur

### `/services` - API Calls

#### Service principal
- `muzlifeApi.ts` → Client API unifié vers ton Next.js

### `/types` - Types TypeScript

#### Types réutilisés
- `api.ts` → Tous tes modèles Prisma
- Identiques à ton projet Next.js

---

## 🚀 Workflow de Développement

### 1. Créer un nouvel écran

#### Next.js
```bash
# Créer app/nouvelle-page/page.tsx
mkdir app/nouvelle-page
touch app/nouvelle-page/page.tsx
```

#### React Native
```bash
# 1. Créer l'écran
touch screens/NouvellePage/NouvellePageScreen.tsx

# 2. Ajouter à la navigation
# Modifier navigation/AppNavigator.tsx
```

### 2. Ajouter une route API

#### Next.js
```typescript
// app/api/nouvelle-route/route.ts
export async function GET() {
  return Response.json({ data: 'test' });
}
```

#### React Native
```typescript
// Utilise ton API Next.js existante !
// services/muzlifeApi.ts
async getNouvelleRoute() {
  return this.request('/api/nouvelle-route');
}
```

### 3. Styling

#### Next.js
```typescript
<div className="flex flex-col space-y-4 p-4">
```

#### React Native
```typescript
<View style={styles.container}>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
});
```

---

## 🛠️ Outils de Développement

### Commandes similaires

| Action | Next.js | React Native |
|--------|---------|--------------|
| **Développement** | `pnpm dev` | `pnpm start` |
| **Build** | `pnpm build` | `eas build` |
| **Type check** | `pnpm type-check` | `npx tsc --noEmit` |
| **Lint** | `pnpm lint` | `expo lint` |

### Debugging

#### Next.js
- DevTools navigateur
- Console.log
- React DevTools

#### React Native
- Metro bundler
- Console.log (dans terminal)
- React DevTools
- Flipper (optionnel)

---

## 🔧 Configuration

### Variables d'environnement

#### Next.js
```env
# .env.local
DATABASE_URL=...
NEXTAUTH_SECRET=...
```

#### React Native
```env
# .env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### TypeScript

#### Configuration similaire
```json
// tsconfig.json (presque identique)
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native" // au lieu de "react-jsx"
  }
}
```

---

## 🎯 Bonnes Pratiques

### 1. Structure des fichiers

#### Nommage
- **Next.js** : `page.tsx`, `layout.tsx`, `loading.tsx`
- **React Native** : `Screen.tsx`, `Navigator.tsx`, `Component.tsx`

### 2. Imports

#### Absolus vs Relatifs
```typescript
// Identique dans les deux
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
```

### 3. Performance

#### Next.js
- Server Components
- `use client` quand nécessaire
- Image optimization

#### React Native
- `useMemo`, `useCallback`
- FlatList pour les listes
- Image optimization avec Expo

---

## 🐛 Debugging Courant

### Problèmes fréquents

#### 1. Navigation
```typescript
// ❌ Erreur commune
navigation.navigate('ScreenName', { wrongParam: 'value' });

// ✅ Correct avec types
navigation.navigate('ScreenName', { correctParam: 'value' });
```

#### 2. Styling
```typescript
// ❌ Erreur : CSS n'existe pas
<View className="flex-1" />

// ✅ Correct
<View style={{ flex: 1 }} />
```

#### 3. API Calls
```typescript
// ❌ Erreur : localhost depuis téléphone
EXPO_PUBLIC_API_URL=http://localhost:3000

// ✅ Correct : IP de ton PC
EXPO_PUBLIC_API_URL=http://192.168.1.35:3000
```

---

## 🎉 Prochaines Étapes

### Maintenant que tu comprends la structure :

1. **Développer l'authentification**
   - Décommenter le code dans `AppNavigator.tsx`
   - Créer les vrais formulaires Login/Register

2. **Implémenter les écrans principaux**
   - Dashboard avec tes stats
   - Lecteur de Coran
   - Quiz islamiques

3. **Connecter à ton API**
   - Tester les endpoints existants
   - Gérer les erreurs et states

### Ressources utiles

- **React Navigation** : [reactnavigation.org](https://reactnavigation.org)
- **React Native** : [reactnative.dev](https://reactnative.dev)
- **Expo** : [docs.expo.dev](https://docs.expo.dev)

---

*Cette codebase React Native réutilise 100% de ton travail Next.js - tu es déjà expert du backend ! Il ne reste qu'à maîtriser la partie mobile.* 🚀
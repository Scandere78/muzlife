# Muzlife Mobile App

Application mobile React Native pour Muzlife, réutilisant l'API Next.js existante.

## 🛠️ Technologies

- **React Native** avec **TypeScript**
- **Expo SDK 53+** pour la facilité de développement
- **React Navigation 7** pour la navigation
- **Zustand** pour la gestion d'état
- **Expo SecureStore** pour l'authentification
- **API Next.js existante** (réutilisation complète)

## 📱 Structure de l'Application

```
MuzlifeMobile/
├── components/          # Composants réutilisables
├── screens/            # Écrans de l'application
├── navigation/         # Configuration React Navigation
├── services/           # Services API (connexion au backend Next.js)
├── store/             # Gestion d'état avec Zustand
├── types/             # Types TypeScript (modèles Prisma)
├── hooks/             # Hooks personnalisés
└── utils/             # Utilitaires
```

## 🚀 Installation

1. **Prérequis** :
   - Node.js 18+
   - pnpm
   - Expo CLI : `pnpm install -g @expo/cli`

2. **Installation** :
   ```bash
   cd MuzlifeMobile
   pnpm install
   ```

3. **Configuration** :
   - Modifier `.env` avec l'URL de votre API Next.js
   - Pour le développement local : `EXPO_PUBLIC_API_URL=http://localhost:3000`
   - Pour appareil physique : `EXPO_PUBLIC_API_URL=http://[IP_DE_VOTRE_PC]:3000`

## 🎯 Fonctionnalités

### ✅ Phase 1 - Base Architecture (Terminée)
- [x] Configuration Expo + TypeScript
- [x] Structure des dossiers (sans src/)
- [x] Service API (réutilise l'API Next.js)
- [x] Gestion d'état avec Zustand
- [x] Navigation React Navigation 7
- [x] Écrans placeholder

### 📋 Phase 2 - Écrans Principaux (À développer)
- [ ] Authentification (Login/Register)
- [ ] Dashboard avec statistiques
- [ ] Lecture du Coran avec audio
- [ ] Quiz islamiques
- [ ] Heures de prière avec géolocalisation
- [ ] Boussole Qibla
- [ ] Profil utilisateur

## 🔧 Commandes de Développement

```bash
# Démarrer l'application en mode développement
pnpm start

# Démarrer pour iOS (nécessite macOS)
pnpm run ios

# Démarrer pour Android
pnpm run android

# Démarrer en mode web (pour les tests rapides)
pnpm run web
```

## 🌐 Intégration Backend

L'application réutilise **100%** de l'API Next.js existante :

- **Authentication** : `/api/auth/*`
- **Lecture Coran** : `/api/reading/*`
- **Quiz** : `/api/quiz/*`
- **Statistiques** : `/api/dashboard/*`
- **Profil** : `/api/user/*`
- **Prières** : `/api/prayer-times`

## 🔐 Authentification

Système JWT identique au web :
- Tokens stockés dans `expo-secure-store`
- Même logique d'authentification
- Sessions partagées avec l'API Next.js

## 📲 Déploiement

### iOS
1. Apple Developer Account requis
2. `eas build --platform ios`
3. Publication sur App Store Connect

### Android
1. `eas build --platform android`
2. Publication sur Google Play Console

## 🚧 État Actuel

**Architecture Complète** ✅
- Navigation configurée
- API service prêt
- Stores Zustand configurés
- Types TypeScript définis

**Prochaines Étapes** 📋
1. Développer les écrans d'authentification
2. Implémenter le lecteur de Coran
3. Ajouter les notifications de prière
4. Intégrer la boussole Qibla

## 🔗 Avantages de cette Architecture

✅ **Zero Backend Changes** - Ton Next.js reste identique  
✅ **Réutilisation Maximale** - Toute ta logique business  
✅ **Modèles Identiques** - Pas de duplication Prisma  
✅ **Auth Compatible** - Même système JWT  
✅ **Structure Familière** - Comme ton Next.js sans src/
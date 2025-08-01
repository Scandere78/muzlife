# Utilisation des Animations Lottie

Ce guide explique comment intégrer des animations Lottie dans votre application Next.js pour remplacer les emojis.

## Installation

1. Installez la dépendance `lottie-react` :
```bash
npm install lottie-react
```

## Composant LottieAnimation

Le composant `LottieAnimation` permet d'afficher des animations Lottie de manière simple et réutilisable.

### Utilisation basique

```tsx
import LottieAnimation from '@/components/LottieAnimation';
import dogWalkingAnimation from '@/public/animations/dog_walking.json';

function MonComposant() {
  return (
    <div>
      <span>Bonjour !</span>
      <LottieAnimation 
        animationData={dogWalkingAnimation}
        width={32}
        height={32}
        loop={true}
        autoplay={true}
      />
      <span>Comment allez-vous ?</span>
    </div>
  );
}
```

### Props disponibles

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `animationData` | `LottieAnimationData` | - | Les données JSON de l'animation Lottie |
| `width` | `number \| string` | `24` | Largeur de l'animation |
| `height` | `number \| string` | `24` | Hauteur de l'animation |
| `loop` | `boolean` | `true` | Si l'animation doit se répéter |
| `autoplay` | `boolean` | `true` | Si l'animation doit démarrer automatiquement |
| `className` | `string` | `''` | Classes CSS personnalisées |
| `style` | `React.CSSProperties` | `{}` | Styles CSS inline |

### Exemples d'utilisation

#### 1. Animation simple (remplace un emoji)
```tsx
<LottieAnimation 
  animationData={dogWalkingAnimation}
  width={24}
  height={24}
/>
```

#### 2. Animation plus grande
```tsx
<LottieAnimation 
  animationData={dogWalkingAnimation}
  width={64}
  height={64}
  loop={true}
/>
```

#### 3. Animation avec styles personnalisés
```tsx
<LottieAnimation 
  animationData={dogWalkingAnimation}
  width={32}
  height={32}
  className="inline-block"
  style={{
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
  }}
/>
```

#### 4. Animation qui ne joue qu'une fois
```tsx
<LottieAnimation 
  animationData={dogWalkingAnimation}
  width={28}
  height={28}
  loop={false}
  autoplay={true}
/>
```

## Où trouver des animations Lottie

1. **LottieFiles** : https://lottiefiles.com/
2. **IconScout** : https://iconscout.com/lotties
3. **After Effects** : Exportez vos animations After Effects en format Lottie

## Structure des fichiers

```
public/
  animations/
    dog_walking.json    # Animation Lottie
    loading.json        # Autre animation
    success.json        # Autre animation

components/
  LottieAnimation.tsx  # Composant réutilisable

types/
  lottie.d.ts         # Types TypeScript
```

## Bonnes pratiques

1. **Taille des fichiers** : Gardez vos animations Lottie légères (< 100KB)
2. **Performance** : Utilisez `loop={false}` pour les animations de notification
3. **Accessibilité** : Ajoutez des attributs `aria-label` si nécessaire
4. **Fallback** : Le composant affiche un placeholder pendant le chargement

## Résolution des problèmes

### Erreur "Module not found"
Assurez-vous que `lottie-react` est installé :
```bash
npm install lottie-react
```

### Animation ne se charge pas
Vérifiez que le fichier JSON est valide et accessible.

### Animation trop lente
Optimisez votre fichier Lottie ou réduisez la complexité de l'animation.

## Exemple complet

Voir `components/ExampleWithLottie.tsx` pour un exemple complet d'utilisation. 
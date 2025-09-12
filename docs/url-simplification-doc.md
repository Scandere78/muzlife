# Documentation : URL Simplifiée pour les Horaires

## ✅ Implémentation terminée

### Avant (URL complexe) :
```
/horaires?city=Corbeil-Cerf&lat=49.281621&lon=2.103949&country=France
```

### Maintenant (URL simplifiée) :
```
/horaires?city=corbeil-cerf
/horaires?city=paris
/horaires?city=marseille
```

## 🎯 Fonctionnalités

### 1. **Formatage automatique de l'URL**
- ✅ Minuscules : `Paris` → `paris`
- ✅ Espaces remplacés par tirets : `Paris 20e Arrondissement` → `paris-20e-arrondissement`
- ✅ Accents supprimés : `Évry` → `evry`
- ✅ Caractères spéciaux retirés : `Saint-Maur-des-Fossés` → `saint-maur-des-fosses`

### 2. **Recherche automatique des coordonnées**
Quand quelqu'un visite `/horaires?city=paris` :
1. L'URL est parsée et la ville est extraite
2. Le nom est formaté : `paris` → `Paris`
3. Une recherche API est lancée pour obtenir les coordonnées GPS
4. Les horaires de prière sont affichés avec les bonnes coordonnées

### 3. **Conservation des coordonnées en interne**
- Les coordonnées GPS sont stockées dans le state React
- Pas besoin de les exposer dans l'URL
- Précision maintenue pour les calculs d'horaires

## 🔗 Exemples d'URLs

| Ville | URL Générée |
|-------|-------------|
| Paris | `/horaires?city=paris` |
| Corbeil-Cerf | `/horaires?city=corbeil-cerf` |
| Paris 20e Arrondissement | `/horaires?city=paris-20e-arrondissement` |
| Saint-Maur-des-Fossés | `/horaires?city=saint-maur-des-fosses` |
| Évry-Courcouronnes | `/horaires?city=evry-courcouronnes` |

## 🛠️ Architecture technique

### Flux de données :
1. **Sélection dans l'autocomplete** → URL mise à jour avec nom simplifié
2. **Visite directe avec URL** → Recherche automatique des coordonnées
3. **Stockage interne** → `selectedCity` contient toutes les infos (nom, lat, lon, pays)
4. **Affichage** → Les composants utilisent `selectedCity` pour les horaires

### Code clé :

```typescript
// Formatage de l'URL
const urlCityName = city.name
  .toLowerCase()
  .normalize("NFD") // Décomposer les accents
  .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
  .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces, tirets
  .replace(/\s+/g, '-') // Remplacer espaces par tirets
  .replace(/-+/g, '-') // Éviter les tirets multiples
  .trim();

// URL finale
router.replace(`/horaires?city=${urlCityName}`);
```

## ✨ Avantages

1. **URLs courtes et propres** - Plus faciles à partager
2. **SEO-friendly** - Meilleures pour le référencement
3. **Lisibles** - On comprend directement quelle ville
4. **Pas de données sensibles** - Les coordonnées GPS ne sont pas exposées
5. **Rétrocompatibilité** - Les anciennes URLs avec coordonnées fonctionnent toujours

## 🚀 Utilisation

1. **Partage simple** : Envoyez juste `/horaires?city=paris`
2. **Bookmarks** : Les favoris sont plus propres
3. **Navigation** : L'historique du navigateur est plus clair
4. **Analytics** : Plus facile de tracker quelle ville est consultée
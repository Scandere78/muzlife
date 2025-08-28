import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { SurahInfo } from '../../constants/quranData';

// Props du composant SurahListItem
type SurahListItemProps = {
  surah: SurahInfo;
  onPress: (surahNumber: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (surahNumber: number) => void;
  readingProgress?: number; // Pourcentage de progression (0-100)
};

// Composant d'élément de liste pour les sourates - Mémorisé selon les best practices 2025
const SurahListItem = memo(({ 
  surah, 
  onPress, 
  isFavorite = false, 
  onToggleFavorite,
  readingProgress = 0 
}: SurahListItemProps) => {
  // Fonction pour obtenir l'icône de révélation
  const getRevelationIcon = (revelation: 'meccan' | 'medinan') => {
    return revelation === 'meccan' ? 'moon-outline' : 'flower-outline';
  };

  // Fonction pour obtenir la couleur de révélation
  const getRevelationColor = (revelation: 'meccan' | 'medinan') => {
    return revelation === 'meccan' ? Colors.warning : Colors.info;
  };

  // Gestion du clic sur la sourate
  const handlePress = () => {
    onPress(surah.number);
  };

  // Gestion du basculement des favoris
  const handleToggleFavorite = () => {
    onToggleFavorite?.(surah.number);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Numéro de la sourate */}
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{surah.number}</Text>
        <Ionicons 
          name={getRevelationIcon(surah.revelation)}
          size={12}
          color={getRevelationColor(surah.revelation)}
          style={styles.revelationIcon}
        />
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        {/* Nom de la sourate */}
        <View style={styles.nameContainer}>
          <Text style={styles.arabicName}>{surah.arabicName}</Text>
          <Text style={styles.frenchName}>{surah.frenchName}</Text>
        </View>

        {/* Métadonnées */}
        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <Ionicons name="document-text-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              {surah.verseCount} verset{surah.verseCount > 1 ? 's' : ''}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons 
              name={getRevelationIcon(surah.revelation)}
              size={14} 
              color={getRevelationColor(surah.revelation)} 
            />
            <Text style={[styles.metaText, { 
              color: getRevelationColor(surah.revelation) 
            }]}>
              {surah.revelation === 'meccan' ? 'Mecquoise' : 'Médinoise'}
            </Text>
          </View>
        </View>

        {/* Barre de progression (si disponible) */}
        {readingProgress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(readingProgress, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(readingProgress)}%</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Bouton favori */}
        {onToggleFavorite && (
          <TouchableOpacity 
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={20} 
              color={isFavorite ? Colors.error : Colors.textSecondary} 
            />
          </TouchableOpacity>
        )}

        {/* Flèche de navigation */}
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={Colors.textSecondary} 
        />
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Comparaison personnalisée pour optimiser les re-rendus
  // Selon les best practices 2025, on ne re-rend que si les props importantes changent
  return (
    prevProps.surah.number === nextProps.surah.number &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.readingProgress === nextProps.readingProgress
  );
});

// Nom d'affichage pour le débogage
SurahListItem.displayName = 'SurahListItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  numberContainer: {
    width: 50,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  number: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  revelationIcon: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  nameContainer: {
    marginBottom: Spacing.xs,
  },
  arabicName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'right',
    fontFamily: 'System', // On utilise System pour l'arabe sur mobile
    marginBottom: 2,
  },
  frenchName: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 2,
  },
  progressText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    minWidth: 30,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  favoriteButton: {
    padding: Spacing.xs,
  },
});

export { SurahListItem };
export default SurahListItem;
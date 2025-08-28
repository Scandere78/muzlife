import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { Verse } from '../../constants/quranVerses';

// Props du composant VerseCard
type VerseCardProps = {
  verse: Verse;
  surahNumber: number;
  showTransliteration?: boolean;
  isRead?: boolean;
  isFavorite?: boolean;
  onMarkAsRead?: (verseNumber: number) => void;
  onToggleFavorite?: (verseNumber: number) => void;
  onPress?: (verseNumber: number) => void;
};

// Composant pour afficher un verset du Coran - Mémorisé selon les best practices 2025
const VerseCard = memo(({ 
  verse, 
  surahNumber,
  showTransliteration = false,
  isRead = false,
  isFavorite = false,
  onMarkAsRead,
  onToggleFavorite,
  onPress
}: VerseCardProps) => {
  
  // Gestion du clic sur le verset
  const handlePress = () => {
    onPress?.(verse.number);
  };

  // Gestion du marquage comme lu
  const handleMarkAsRead = () => {
    onMarkAsRead?.(verse.number);
  };

  // Gestion du basculement des favoris
  const handleToggleFavorite = () => {
    onToggleFavorite?.(verse.number);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, isRead && styles.containerRead]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* En-tête avec numéro de verset et actions */}
      <View style={styles.header}>
        <View style={styles.verseNumber}>
          <Text style={styles.verseNumberText}>{verse.number}</Text>
        </View>
        
        <View style={styles.actions}>
          {/* Bouton favori */}
          {onToggleFavorite && (
            <TouchableOpacity 
              onPress={handleToggleFavorite}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name={isFavorite ? 'heart' : 'heart-outline'} 
                size={18} 
                color={isFavorite ? Colors.error : Colors.textSecondary} 
              />
            </TouchableOpacity>
          )}

          {/* Bouton marquer comme lu */}
          {onMarkAsRead && (
            <TouchableOpacity 
              onPress={handleMarkAsRead}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name={isRead ? 'checkmark-circle' : 'checkmark-circle-outline'} 
                size={18} 
                color={isRead ? Colors.success : Colors.textSecondary} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenu du verset */}
      <View style={styles.content}>
        {/* Texte arabe */}
        <Text style={styles.arabicText}>{verse.arabic}</Text>
        
        {/* Translittération (optionnelle) */}
        {showTransliteration && verse.transliteration && (
          <Text style={styles.transliterationText}>{verse.transliteration}</Text>
        )}
        
        {/* Traduction française */}
        <Text style={styles.frenchText}>{verse.french}</Text>
      </View>

      {/* Indicateur de statut en bas */}
      {isRead && (
        <View style={styles.statusIndicator}>
          <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
          <Text style={styles.statusText}>Lu</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Comparaison personnalisée pour optimiser les re-rendus
  // Selon les best practices 2025, on ne re-rend que si les props importantes changent
  return (
    prevProps.verse.number === nextProps.verse.number &&
    prevProps.surahNumber === nextProps.surahNumber &&
    prevProps.showTransliteration === nextProps.showTransliteration &&
    prevProps.isRead === nextProps.isRead &&
    prevProps.isFavorite === nextProps.isFavorite
  );
});

// Nom d'affichage pour le débogage
VerseCard.displayName = 'VerseCard';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  containerRead: {
    backgroundColor: Colors.success + '08',
    borderColor: Colors.success + '30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  verseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  content: {
    gap: Spacing.md,
  },
  arabicText: {
    fontSize: FontSizes.lg,
    lineHeight: 32,
    textAlign: 'right',
    color: Colors.text,
    fontWeight: '500',
    fontFamily: 'System', // On utilise System pour l'arabe sur mobile
  },
  transliterationText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'left',
  },
  frenchText: {
    fontSize: FontSizes.md,
    lineHeight: 24,
    color: Colors.text,
    textAlign: 'left',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    fontWeight: '500',
  },
});

export { VerseCard };
export default VerseCard;
import React, { useCallback, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SurahListItem } from '../../components/quran/SurahListItem';
import { useSurahList, useSurahReadingProgress } from '../../hooks/useSurahList';
import { Loading } from '../../components/ui/Loading';
import { Card } from '../../components/ui/Card';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { SurahInfo, SurahSortBy } from '../../constants/quranData';

// Constante pour la hauteur fixe des éléments (optimisation FlatList selon best practices 2025)
const ITEM_HEIGHT = 100;

// Options de tri
const SORT_OPTIONS: { value: SurahSortBy; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'number', label: 'Numéro', icon: 'list-outline' },
  { value: 'name', label: 'Nom', icon: 'text-outline' },
  { value: 'revelation', label: 'Révélation', icon: 'location-outline' },
  { value: 'verseCount', label: 'Longueur', icon: 'resize-outline' },
];

export default function SurahListScreen() {
  const navigation = useNavigation();
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  // Utilisation du hook personnalisé pour gérer la liste des sourates
  const {
    searchQuery,
    sortBy,
    surahs,
    searchStats,
    loadingFavorites,
    error,
    setSearchQuery,
    setSortBy,
    toggleFavorite,
    isFavorite,
    clearSearch,
    refreshFavorites,
    clearError,
  } = useSurahList();

  // Fonction de navigation vers le lecteur de sourate
  const handleSurahPress = useCallback((surahNumber: number) => {
    navigation.navigate('SurahReader' as never, { surahNumber } as never);
  }, [navigation]);

  // Fonction pour basculer les favoris avec confirmation
  const handleToggleFavorite = useCallback((surahNumber: number) => {
    const surah = surahs.find(s => s.number === surahNumber);
    if (!surah) return;

    const isCurrentlyFavorite = isFavorite(surahNumber);
    
    if (isCurrentlyFavorite) {
      Alert.alert(
        'Retirer des favoris',
        `Êtes-vous sûr de vouloir retirer "${surah.frenchName}" de vos favoris ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Retirer', 
            style: 'destructive',
            onPress: () => toggleFavorite(surahNumber)
          }
        ]
      );
    } else {
      toggleFavorite(surahNumber);
    }
  }, [surahs, isFavorite, toggleFavorite]);

  // Composant d'élément de liste mémorisé (best practice 2025)
  const renderSurahItem = useCallback(({ item }: { item: SurahInfo }) => {
    return (
      <SurahItemWrapper 
        surah={item}
        onPress={handleSurahPress}
        isFavorite={isFavorite(item.number)}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  }, [handleSurahPress, isFavorite, handleToggleFavorite]);

  // Fonction getItemLayout pour optimiser les performances FlatList (best practice 2025)
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  // Fonction keyExtractor optimisée
  const keyExtractor = useCallback((item: SurahInfo) => `surah-${item.number}`, []);

  // Gestion du changement de tri
  const handleSortChange = useCallback((newSortBy: SurahSortBy) => {
    setSortBy(newSortBy);
    setShowSortOptions(false);
  }, [setSortBy]);

  // Gestion du rafraîchissement
  const handleRefresh = useCallback(() => {
    // Invalider le cache de progression pour forcer un nouveau chargement
    const { invalidateProgressCache } = require('../../hooks/useSurahList');
    invalidateProgressCache();
    
    refreshFavorites();
    clearError();
  }, [refreshFavorites, clearError]);

  // En-tête de liste avec recherche et tri
  const ListHeader = useMemo(() => (
    <View style={styles.header}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une sourate..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Options de tri et statistiques */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortOptions(!showSortOptions)}
        >
          <Ionicons name="filter" size={18} color={Colors.primary} />
          <Text style={styles.sortButtonText}>
            {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
          </Text>
          <Ionicons 
            name={showSortOptions ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={Colors.primary} 
          />
        </TouchableOpacity>

        <Text style={styles.statsText}>
          {searchStats.filteredCount} / {searchStats.totalSurahs} sourates
        </Text>
      </View>

      {/* Options de tri déroulantes */}
      {showSortOptions && (
        <View style={styles.sortOptions}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortOption,
                sortBy === option.value && styles.sortOptionActive
              ]}
              onPress={() => handleSortChange(option.value)}
            >
              <Ionicons 
                name={option.icon} 
                size={18} 
                color={sortBy === option.value ? Colors.primary : Colors.textSecondary} 
              />
              <Text style={[
                styles.sortOptionText,
                sortBy === option.value && styles.sortOptionTextActive
              ]}>
                {option.label}
              </Text>
              {sortBy === option.value && (
                <Ionicons name="checkmark" size={18} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Boutons de navigation rapide */}
      <View style={styles.quickNavigation}>
        <TouchableOpacity 
          style={styles.quickNavButton}
          onPress={() => navigation.navigate('Favorites' as never)}
        >
          <Ionicons name="heart" size={20} color={Colors.error} />
          <Text style={styles.quickNavText}>Favoris</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickNavButton}
          onPress={() => navigation.navigate('ReadingStats' as never)}
        >
          <Ionicons name="bar-chart" size={20} color={Colors.success} />
          <Text style={styles.quickNavText}>Statistiques</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [
    searchQuery, 
    setSearchQuery, 
    clearSearch, 
    showSortOptions, 
    sortBy, 
    searchStats, 
    handleSortChange,
    navigation
  ]);

  // Pied de page avec message si aucun résultat
  const ListEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>Aucune sourate trouvée</Text>
      <Text style={styles.emptyMessage}>
        Essayez de modifier votre recherche ou vos critères de tri
      </Text>
      {searchQuery.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
          <Text style={styles.clearButtonText}>Effacer la recherche</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [searchQuery, clearSearch]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Affichage des erreurs */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Ionicons name="close" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      )}

      {/* Liste principale avec optimisations best practices 2025 */}
      <FlatList
        data={surahs}
        renderItem={renderSurahItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl 
            refreshing={loadingFavorites} 
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        // Optimisations de performance selon best practices 2025
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={21}
        // Propriétés pour améliorer les performances de défilement
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={surahs.length === 0 ? styles.emptyList : undefined}
      />
    </SafeAreaView>
  );
}

// Wrapper pour l'élément de sourate avec gestion de la progression de lecture
const SurahItemWrapper = React.memo(({ 
  surah, 
  onPress, 
  isFavorite, 
  onToggleFavorite 
}: {
  surah: SurahInfo;
  onPress: (surahNumber: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (surahNumber: number) => void;
}) => {
  const { progress } = useSurahReadingProgress(surah.number);

  return (
    <SurahListItem
      surah={surah}
      onPress={onPress}
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
      readingProgress={progress}
    />
  );
});

SurahItemWrapper.displayName = 'SurahItemWrapper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  sortButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  statsText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  sortOptions: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sortOptionActive: {
    backgroundColor: Colors.primary + '10',
  },
  sortOptionText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  sortOptionTextActive: {
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  clearButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  clearButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  emptyList: {
    flexGrow: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.error + '15',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.error + '30',
  },
  errorText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.error,
  },
  quickNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quickNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  quickNavText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
  },
});
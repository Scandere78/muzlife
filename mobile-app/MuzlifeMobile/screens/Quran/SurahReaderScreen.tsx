import React, { useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  RefreshControl,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { VerseCard } from '../../components/quran/VerseCard';
import { useSurahReader } from '../../hooks/useSurahReader';
import { Loading } from '../../components/ui/Loading';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { Verse } from '../../constants/quranVerses';

// Types pour la navigation
type SurahReaderRouteProp = RouteProp<{
  SurahReader: { surahNumber: number };
}, 'SurahReader'>;

// Constante pour la hauteur des éléments (optimisation FlatList)
const VERSE_HEIGHT = 250;

export default function SurahReaderScreen() {
  const route = useRoute<SurahReaderRouteProp>();
  const navigation = useNavigation();
  const { surahNumber } = route.params;

  const [showSettings, setShowSettings] = React.useState(false);

  // Utilisation du hook personnalisé
  const {
    verses,
    loading,
    error,
    settings,
    surahInfo,
    hasRealContent,
    progressStats,
    markVerseAsRead,
    toggleVerseAsFavorite,
    updateSettings,
    refresh,
    clearError,
    isVerseRead,
    isVerseFavorite,
  } = useSurahReader(surahNumber);

  // Configuration du header de navigation
  React.useEffect(() => {
    navigation.setOptions({
      title: surahInfo ? `${surahInfo.number}. ${surahInfo.frenchName}` : 'Lecteur',
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => setShowSettings(true)}
          style={styles.headerButton}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, surahInfo]);

  // Fonction de rendu des versets (mémorisée selon best practices 2025)
  const renderVerse = useCallback(({ item }: { item: Verse }) => (
    <VerseCard
      verse={item}
      surahNumber={surahNumber}
      showTransliteration={settings.showTransliteration}
      isRead={isVerseRead(item.number)}
      isFavorite={isVerseFavorite(item.number)}
      onMarkAsRead={markVerseAsRead}
      onToggleFavorite={toggleVerseAsFavorite}
    />
  ), [
    surahNumber, 
    settings.showTransliteration, 
    isVerseRead, 
    isVerseFavorite, 
    markVerseAsRead, 
    toggleVerseAsFavorite
  ]);

  // Fonction getItemLayout pour optimiser les performances (best practice 2025)
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: VERSE_HEIGHT,
    offset: VERSE_HEIGHT * index,
    index,
  }), []);

  // Fonction keyExtractor optimisée
  const keyExtractor = useCallback((item: Verse) => `verse-${item.number}`, []);

  // En-tête de la liste avec informations sur la sourate
  const ListHeader = useMemo(() => (
    <View style={styles.header}>
      {/* Informations de la sourate */}
      <View style={styles.surahInfo}>
        <Text style={styles.surahTitle}>{surahInfo?.arabicName}</Text>
        <Text style={styles.surahSubtitle}>{surahInfo?.frenchName}</Text>
        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <Ionicons name="document-text-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              {surahInfo?.verseCount} verset{(surahInfo?.verseCount || 0) > 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons 
              name={surahInfo?.revelation === 'meccan' ? 'moon-outline' : 'flower-outline'}
              size={16} 
              color={surahInfo?.revelation === 'meccan' ? Colors.warning : Colors.info} 
            />
            <Text style={styles.metaText}>
              {surahInfo?.revelation === 'meccan' ? 'Mecquoise' : 'Médinoise'}
            </Text>
          </View>
        </View>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progression de lecture</Text>
          <Text style={styles.progressValue}>
            {progressStats.readCount}/{progressStats.totalVerses} ({progressStats.progressPercentage}%)
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressStats.progressPercentage}%` }
            ]} 
          />
        </View>
        {progressStats.isComplete && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.completedText}>Sourate terminée !</Text>
          </View>
        )}
      </View>

      {/* Avertissement pour le contenu de démo */}
      {!hasRealContent && (
        <View style={styles.demoWarning}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
          <Text style={styles.demoText}>
            Contenu de démonstration. Dans la version complète, tous les versets du Coran seraient disponibles.
          </Text>
        </View>
      )}
    </View>
  ), [surahInfo, progressStats, hasRealContent]);

  // Gestion du chargement
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loading fullScreen text="Chargement de la sourate..." />
      </SafeAreaView>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Liste des versets avec optimisations best practices 2025 */}
      <FlatList
        data={verses}
        renderItem={renderVerse}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={ListHeader}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={refresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        // Optimisations de performance selon best practices 2025
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        initialNumToRender={5}
        windowSize={10}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={verses.length === 0 ? styles.emptyList : undefined}
      />

      {/* Modal des paramètres */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSettings(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Paramètres de lecture</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsContent}>
            {/* Toggle translittération */}
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => updateSettings({ 
                showTransliteration: !settings.showTransliteration 
              })}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Afficher la translittération</Text>
                <Text style={styles.settingDescription}>
                  Phonétique pour aider à la prononciation
                </Text>
              </View>
              <Ionicons 
                name={settings.showTransliteration ? 'toggle' : 'toggle-outline'}
                size={24} 
                color={settings.showTransliteration ? Colors.primary : Colors.textSecondary} 
              />
            </TouchableOpacity>

            {/* Toggle auto-marquage */}
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => updateSettings({ 
                autoMarkAsRead: !settings.autoMarkAsRead 
              })}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Marquage automatique</Text>
                <Text style={styles.settingDescription}>
                  Marquer automatiquement les versets comme lus
                </Text>
              </View>
              <Ionicons 
                name={settings.autoMarkAsRead ? 'toggle' : 'toggle-outline'}
                size={24} 
                color={settings.autoMarkAsRead ? Colors.primary : Colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerButton: {
    padding: Spacing.xs,
  },
  header: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  surahInfo: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  surahTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    fontFamily: 'System', // Pour l'arabe
  },
  surahSubtitle: {
    fontSize: FontSizes.lg,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  metadata: {
    flexDirection: 'row',
    gap: Spacing.lg,
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.success + '15',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.sm,
  },
  completedText: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: '600',
  },
  demoWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.info + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  demoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.info,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  emptyList: {
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  settingsContent: {
    padding: Spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
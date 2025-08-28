import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDashboard, useDailyQuote } from '../../hooks/useDashboard';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { QuoteCard } from '../../components/dashboard/QuoteCard';
import { RecentActivityCard } from '../../components/dashboard/RecentActivityCard';
import { Loading } from '../../components/ui/Loading';
import { Colors, FontSizes, Spacing } from '../../constants/theme';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { data, loading, error, refreshing, refresh } = useDashboard();
  const dailyQuote = useDailyQuote();

  // Fonction pour naviguer vers les détails d'une activité
  const handleActivityPress = (activity: any) => {
    if (activity.type === 'quiz') {
      // Navigation vers l'historique des quiz
      navigation.navigate('Quiz' as never, { 
        screen: 'QuizHistory' 
      } as never);
    } else if (activity.type === 'reading') {
      // Navigation vers la sourate correspondante
      navigation.navigate('Quran' as never, { 
        screen: 'SurahReader',
        params: { surahNumber: activity.data.surahNumber }
      } as never);
    }
  };

  // Gestion du chargement initial
  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <Loading fullScreen text="Chargement du tableau de bord..." />
      </SafeAreaView>
    );
  }

  // Gestion des erreurs
  if (error && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <View style={styles.errorNote}>
            <Text style={styles.noteText}>
              💡 Mode développement : L'authentification est temporairement désactivée.
              Les données affichées sont des exemples.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Données par défaut pour le développement
  const defaultData = {
    user: { name: 'Utilisateur', email: 'user@example.com' },
    readingStats: {
      todayVerses: 5,
      weekVerses: 42,
      totalVerses: 236,
      streak: 7,
      dailyGoal: 10,
      goalProgress: 50,
    },
    stats: {
      totalQuizzes: 15,
      totalPoints: 450,
      averageScore: 75,
    },
    recentResults: [],
    recentReadingProgress: [],
  };

  const displayData = data || defaultData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {/* En-tête avec salutation */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            As-salāmu ʿalaykum,
          </Text>
          <Text style={styles.userName}>
            {displayData.user?.name || 'Utilisateur'} 👋
          </Text>
        </View>

        {/* Citation du jour */}
        <QuoteCard 
          text={dailyQuote.text}
          source={dailyQuote.source}
          reference={dailyQuote.reference}
        />

        {/* Statistiques de lecture */}
        <Text style={styles.sectionTitle}>📖 Progression de lecture</Text>
        <View style={styles.statsGrid}>
          <StatsCard
            title="Aujourd'hui"
            value={displayData.readingStats?.todayVerses || 0}
            subtitle="versets lus"
            icon="today-outline"
            color={Colors.primary}
            progress={parseFloat((displayData.readingStats?.goalProgress || 0).toFixed(2))}
          />
          <StatsCard
            title="Cette semaine"
            value={displayData.readingStats?.weekVerses || 0}
            subtitle="versets lus"
            icon="calendar-outline"
            color={Colors.info}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatsCard
            title="Total lu"
            value={displayData.readingStats?.totalVerses || 0}
            subtitle="versets au total"
            icon="book-outline"
            color={Colors.success}
          />
          <StatsCard
            title="Série"
            value={`${displayData.readingStats?.streak || 0} 🔥`}
            subtitle="jours consécutifs"
            icon="flame-outline"
            color={Colors.warning}
          />
        </View>

        {/* Statistiques des quiz */}
        <Text style={styles.sectionTitle}>🎯 Performance Quiz</Text>
        <View style={styles.statsGrid}>
          <StatsCard
            title="Quiz complétés"
            value={displayData.stats?.totalQuizzes || 0}
            subtitle="au total"
            icon="checkmark-circle-outline"
            color={Colors.secondary}
          />
          <StatsCard
            title="Score moyen"
            value={`${(displayData.stats?.averageScore || 0).toFixed(2)}%`}
            subtitle="de réussite"
            icon="stats-chart-outline"
            color={(displayData.stats?.averageScore || 0) >= 70 ? Colors.success : Colors.warning}
          />
        </View>

        {/* Activités récentes */}
        <RecentActivityCard
          title="Activités récentes"
          activities={[
            ...displayData.recentResults?.slice(0, 2).map(result => ({
              type: 'quiz' as const,
              data: result,
            })) || [],
            ...displayData.recentReadingProgress?.slice(0, 1).map(progress => ({
              type: 'reading' as const,
              data: progress,
            })) || [],
          ]}
          onActivityPress={handleActivityPress}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
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
  errorNote: {
    backgroundColor: Colors.info + '20',
    padding: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.md,
  },
  noteText: {
    fontSize: FontSizes.sm,
    color: Colors.info,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: Spacing.xl * 2,
  },
});
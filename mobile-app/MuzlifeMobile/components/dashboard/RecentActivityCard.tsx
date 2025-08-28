import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { QuizResult } from '../../types/api';

// Props du composant RecentActivityCard
type RecentActivityCardProps = {
  title: string;
  activities: {
    type: 'quiz' | 'reading';
    data: QuizResult | { surahNumber: number; verseNumber: number; readAt: string };
  }[];
  onActivityPress?: (activity: any) => void;
};

// Composant pour afficher les activités récentes
export function RecentActivityCard({ title, activities, onActivityPress }: RecentActivityCardProps) {
  // Fonction pour formater la date relative
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Fonction pour obtenir l'icône selon le type d'activité
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'help-circle-outline';
      case 'reading':
        return 'book-outline';
      default:
        return 'time-outline';
    }
  };

  // Fonction pour obtenir la couleur selon le score (quiz)
  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {activities.length > 3 && (
          <TouchableOpacity>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        )}
      </View>

      {activities.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>Aucune activité récente</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {activities.slice(0, 3).map((activity, index) => (
            <TouchableOpacity
              key={index}
              style={styles.activityItem}
              onPress={() => onActivityPress?.(activity)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { 
                backgroundColor: activity.type === 'quiz' ? '#E3F2FD' : '#F1F8E9' 
              }]}>
                <Ionicons 
                  name={getActivityIcon(activity.type)} 
                  size={20} 
                  color={activity.type === 'quiz' ? Colors.info : Colors.success} 
                />
              </View>

              <View style={styles.activityContent}>
                {activity.type === 'quiz' ? (
                  <>
                    <Text style={styles.activityTitle}>
                      Quiz: {(activity.data as QuizResult).category}
                    </Text>
                    <View style={styles.activityMeta}>
                      <Text style={[
                        styles.score, 
                        { color: getScoreColor((activity.data as QuizResult).score) }
                      ]}>
                        {(activity.data as QuizResult).score}%
                      </Text>
                      <Text style={styles.separator}>•</Text>
                      <Text style={styles.time}>
                        {formatRelativeTime((activity.data as QuizResult).createdAt)}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.activityTitle}>
                      Lecture: Sourate {(activity.data as any).surahNumber}, 
                      Verset {(activity.data as any).verseNumber}
                    </Text>
                    <Text style={styles.time}>
                      {formatRelativeTime((activity.data as any).readAt)}
                    </Text>
                  </>
                )}
              </View>

              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={Colors.textSecondary} 
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  seeAll: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  list: {
    gap: Spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FontSizes.md,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  separator: {
    color: Colors.textSecondary,
    marginHorizontal: Spacing.xs,
    fontSize: FontSizes.sm,
  },
  time: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});
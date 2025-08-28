import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Props du composant StatsCard
type StatsCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  progress?: number; // Pourcentage de progression (0-100)
};

// Composant pour afficher une carte de statistique
export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = Colors.primary,
  progress 
}: StatsCardProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(progress, 100)}%`, backgroundColor: color }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{progress.toFixed(2)}%</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  content: {
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginRight: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    minWidth: 35,
    textAlign: 'right',
  },
});
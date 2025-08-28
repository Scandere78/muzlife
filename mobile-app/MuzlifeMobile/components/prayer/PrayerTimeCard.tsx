import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Colors, FontSizes, Spacing } from '../../constants/theme';

interface PrayerTimeCardProps {
  name: string;
  time: string;
  isNext?: boolean;
  arabicName: string;
}

export function PrayerTimeCard({ name, time, isNext = false, arabicName }: PrayerTimeCardProps) {
  return (
    <Card style={isNext ? StyleSheet.flatten([styles.card, styles.nextPrayerCard]) : styles.card}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.prayerName, isNext && styles.nextPrayerName]}>
            {name}
          </Text>
          <Text style={[styles.arabicName, isNext && styles.nextArabicName]}>
            {arabicName}
          </Text>
        </View>
        <Text style={[styles.time, isNext && styles.nextTime]}>
          {time}
        </Text>
      </View>
      {isNext && (
        <View style={styles.nextIndicator}>
          <Text style={styles.nextText}>Prochaine</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
  },
  nextPrayerCard: {
    backgroundColor: Colors.secondary,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  prayerName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  nextPrayerName: {
    color: Colors.surface,
  },
  arabicName: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontFamily: 'System', // On utilisera une police arabe plus tard
  },
  nextArabicName: {
    color: Colors.surface,
    opacity: 0.9,
  },
  time: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  nextTime: {
    color: Colors.surface,
  },
  nextIndicator: {
    position: 'absolute',
    top: -8,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  nextText: {
    color: Colors.surface,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
});
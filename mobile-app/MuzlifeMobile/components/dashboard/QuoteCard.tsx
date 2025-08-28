import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Props du composant QuoteCard
type QuoteCardProps = {
  text: string;
  source: string;
  reference?: string;
};

// Composant pour afficher la citation du jour
export function QuoteCard({ text, source, reference }: QuoteCardProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book-outline" size={24} color={Colors.primary} />
        <Text style={styles.headerText}>Citation du jour</Text>
      </View>

      <View style={styles.quoteContainer}>
        <Text style={styles.quoteSymbol}>"</Text>
        <Text style={styles.quoteText}>{text}</Text>
        <Text style={[styles.quoteSymbol, styles.quoteSymbolEnd]}>"</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.source}>{source}</Text>
        {reference && <Text style={styles.reference}> • {reference}</Text>}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  quoteContainer: {
    marginBottom: Spacing.md,
  },
  quoteSymbol: {
    fontSize: 32,
    color: Colors.primary,
    opacity: 0.3,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  quoteSymbolEnd: {
    textAlign: 'right',
  },
  quoteText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  source: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  reference: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
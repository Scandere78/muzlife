import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>SCANDERE LOOSER</Text>
        <Text style={styles.subtitle}>L'app fonctionne maintenant !</Text>
        
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            🏠 Écran Dasknqmz,dmkqzndmqzldnqmzldnhboard à développer
          </Text>
          <Text style={styles.description}>
            - Statistiques utilisateur{'\n'}
            - Citations du jour{'\n'}
            - Progression de lecture{'\n'}
            - Rappels de prière
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 32,
  },
  placeholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E74C3C',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E74C3C',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
});
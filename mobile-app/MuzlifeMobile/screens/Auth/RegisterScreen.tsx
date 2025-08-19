import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Inscription</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            📝 Écran d'inscription à développer
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 32,
    textAlign: 'center',
  },
  placeholder: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E74C3C',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
  },
});
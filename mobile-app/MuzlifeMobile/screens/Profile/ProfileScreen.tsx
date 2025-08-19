import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            👤 Écran profil à développer
          </Text>
        </View>
      </View>
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
    justifyContent: 'center',
  },
  placeholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF9800',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#FF9800',
    textAlign: 'center',
  },
});

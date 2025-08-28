import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../../constants/theme';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

export function CustomHeader({ 
  title, 
  showBackButton = true, 
  rightComponent,
  backgroundColor = Colors.surface,
  textColor = Colors.text
}: CustomHeaderProps) {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.header, { backgroundColor }]}>
      {/* Bouton retour */}
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'} 
              size={24} 
              color={textColor} 
            />
            <Text style={[styles.backText, { color: textColor }]}>Retour</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Titre centré */}
      <View style={styles.centerContainer}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Composant à droite (optionnel) */}
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 0 : Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 50,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.sm,
  },
  backText: {
    fontSize: FontSizes.md,
    marginLeft: Spacing.xs,
    fontWeight: '500',
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
});
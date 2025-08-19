import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PrayerStackParamList } from './types';

// Screens de prière (à créer)
import PrayerTimesScreen from '../screens/Prayer/PrayerTimesScreen';
import QiblaCompassScreen from '../screens/Prayer/QiblaCompassScreen';
import PrayerSettingsScreen from '../screens/Prayer/PrayerSettingsScreen';
import WuduGuideScreen from '../screens/Prayer/WuduGuideScreen';

const PrayerStack = createStackNavigator<PrayerStackParamList>();

export default function PrayerNavigator() {
  return (
    <PrayerStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        gestureEnabled: true,
      }}
    >
      <PrayerStack.Screen 
        name="PrayerTimes" 
        component={PrayerTimesScreen}
        options={{
          title: 'Heures de Prière',
          headerRight: () => (
            // Bouton pour les paramètres
            null
          ),
        }}
      />
      <PrayerStack.Screen 
        name="QiblaCompass" 
        component={QiblaCompassScreen}
        options={{
          title: 'Boussole Qibla',
        }}
      />
      <PrayerStack.Screen 
        name="PrayerSettings" 
        component={PrayerSettingsScreen}
        options={{
          title: 'Paramètres de Prière',
        }}
      />
      <PrayerStack.Screen 
        name="WuduGuide" 
        component={WuduGuideScreen}
        options={{
          title: 'Guide des Ablutions',
        }}
      />
    </PrayerStack.Navigator>
  );
}
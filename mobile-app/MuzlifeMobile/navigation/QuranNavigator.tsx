import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { QuranStackParamList } from './types';

// Screens du Coran (à créer)
import SurahListScreen from '../screens/Quran/SurahListScreen';
import SurahReaderScreen from '../screens/Quran/SurahReaderScreen';
import FavoritesScreen from '../screens/Quran/FavoritesScreen';
import ReadingStatsScreen from '../screens/Quran/ReadingStatsScreen';

const QuranStack = createStackNavigator<QuranStackParamList>();

export default function QuranNavigator() {
  return (
    <QuranStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A90E2',
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
      <QuranStack.Screen 
        name="SurahList" 
        component={SurahListScreen}
        options={{
          title: 'Sourates du Coran',
          headerRight: () => (
            // Bouton pour les favoris et les stats
            null
          ),
        }}
      />
      <QuranStack.Screen 
        name="SurahReader" 
        component={SurahReaderScreen}
        options={({ route }) => ({
          title: route.params.surahName,
          headerBackTitle: 'Retour',
        })}
      />
      <QuranStack.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          title: 'Sourates Favorites',
        }}
      />
      <QuranStack.Screen 
        name="ReadingStats" 
        component={ReadingStatsScreen}
        options={{
          title: 'Statistiques de Lecture',
        }}
      />
    </QuranStack.Navigator>
  );
}
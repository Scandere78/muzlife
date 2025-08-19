import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { QuizStackParamList } from './types';

// Screens de quiz (à créer)
import CategoriesScreen from '../screens/Quiz/CategoriesScreen';
import QuizScreen from '../screens/Quiz/QuizScreen';
import QuizResultsScreen from '../screens/Quiz/QuizResultsScreen';
import QuizHistoryScreen from '../screens/Quiz/QuizHistoryScreen';

const QuizStack = createStackNavigator<QuizStackParamList>();

export default function QuizNavigator() {
  return (
    <QuizStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#7B1FA2',
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
      <QuizStack.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{
          title: 'Catégories de Quiz',
          headerRight: () => (
            // Bouton pour l'historique
            null
          ),
        }}
      />
      <QuizStack.Screen 
        name="QuizScreen" 
        component={QuizScreen}
        options={({ route }) => ({
          title: route.params.categoryName,
          headerBackTitle: 'Retour',
          gestureEnabled: false, // Empêcher le retour en arrière pendant un quiz
        })}
      />
      <QuizStack.Screen 
        name="QuizResults" 
        component={QuizResultsScreen}
        options={{
          title: 'Résultats',
          headerLeft: () => null, // Pas de retour possible depuis les résultats
        }}
      />
      <QuizStack.Screen 
        name="QuizHistory" 
        component={QuizHistoryScreen}
        options={{
          title: 'Historique des Quiz',
        }}
      />
    </QuizStack.Navigator>
  );
}
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Types
import { RootStackParamList, MainTabParamList } from './types';

// Stores
import { useAuthStore } from '../store/authStore';

// Screens (à créer)
import LoadingScreen from '../screens/LoadingScreen';
import AuthNavigator from './AuthNavigator';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import QuranNavigator from './QuranNavigator';
import PrayerNavigator from './PrayerNavigator';
import QuizNavigator from './QuizNavigator';
import ProfileScreen from '../screens/Profile/ProfileScreen';

// Icons (utilisation d'icônes simple pour commencer)
import { Text } from 'react-native';

const RootStack = createStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Composant pour les icônes des tabs (version simple)
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <Text style={{ fontSize: 12, color: focused ? '#4A90E2' : '#8E8E93' }}>
    {name}
  </Text>
);

// Navigation principale avec tabs
function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <MainTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="🏠" focused={focused} />
          ),
        }}
      />
      <MainTab.Screen
        name="Quran"
        component={QuranNavigator}
        options={{
          title: 'Coran',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="📖" focused={focused} />
          ),
        }}
      />
      <MainTab.Screen
        name="Prayer"
        component={PrayerNavigator}
        options={{
          title: 'Prière',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="🕌" focused={focused} />
          ),
        }}
      />
      <MainTab.Screen
        name="Quiz"
        component={QuizNavigator}
        options={{
          title: 'Quiz',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="🧠" focused={focused} />
          ),
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="👤" focused={focused} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
}

// Navigation racine
function RootNavigator() {
  // TEMPORAIRE : Bypasser l'authentification pour tester
  // const { isAuthenticated, isLoading } = useAuthStore();

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* TEMPORAIRE : Afficher directement l'app principale */}
      <RootStack.Screen name="Main" component={MainNavigator} />
      {/* {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )} */}
    </RootStack.Navigator>
  );
}

// Composant principal de navigation
export default function AppNavigator() {
  // TEMPORAIRE : Désactiver le chargement utilisateur
  // const { loadUser } = useAuthStore();

  // React.useEffect(() => {
  //   // Charger l'utilisateur au démarrage
  //   loadUser();
  // }, [loadUser]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
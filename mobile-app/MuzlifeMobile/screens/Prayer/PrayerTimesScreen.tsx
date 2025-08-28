import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TextInput, Platform, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { PrayerTimeCard } from '../../components/prayer/PrayerTimeCard';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { Card } from '../../components/ui/Card';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { Colors, FontSizes, Spacing } from '../../constants/theme';

// Configuration des notifications de prières
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function PrayerTimesScreen() {
  const navigation = useNavigation();
  const [city, setCity] = useState('Paris');
  const [inputCity, setInputCity] = useState('Paris');
  const [locationLoading, setLocationLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  
  const { prayerTimes, loading, error, refetch, nextPrayer } = usePrayerTimes(city);
  
  // Log uniquement au premier chargement
  useEffect(() => {
    console.log('🏃 PrayerTimesScreen monté avec ville:', city);
  }, []);

  // Charger les préférences sauvegardées au montage uniquement
  useEffect(() => {
    loadSavedPreferences();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculer le temps jusqu'à la prochaine prière (mémorisé)
  const calculateTimeUntilNext = useCallback((): string => {
    if (!prayerTimes || !nextPrayer) return '';

    const now = new Date();
    const prayers = {
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
    };

    const nextTime = prayers[nextPrayer as keyof typeof prayers];
    if (!nextTime) return '';

    const [hours, minutes] = nextTime.split(':').map(Number);
    const nextPrayerDate = new Date();
    nextPrayerDate.setHours(hours, minutes, 0, 0);

    // Si l'heure est passée aujourd'hui, c'est pour demain
    if (nextPrayerDate <= now) {
      nextPrayerDate.setDate(nextPrayerDate.getDate() + 1);
    }

    const diff = nextPrayerDate.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
    }
    return `${minutesLeft}m ${secondsLeft}s`;
  }, [prayerTimes, nextPrayer]);

  // Calculer le temps jusqu'à la prochaine prière
  useEffect(() => {
    if (prayerTimes && nextPrayer) {
      const interval = setInterval(() => {
        const timeRemaining = calculateTimeUntilNext();
        setTimeUntilNext(timeRemaining);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [prayerTimes, nextPrayer, calculateTimeUntilNext]);

  // Planifier les notifications (mémorisé)
  const scheduleNotifications = useCallback(async () => {
    if (!prayerTimes) return;

    try {
      // Annuler les notifications existantes
      await Notifications.cancelAllScheduledNotificationsAsync();

      const prayers = [
        { name: 'Fajr', arabicName: 'الفجر', time: prayerTimes.fajr },
        { name: 'Dhuhr', arabicName: 'الظهر', time: prayerTimes.dhuhr },
        { name: 'Asr', arabicName: 'العصر', time: prayerTimes.asr },
        { name: 'Maghrib', arabicName: 'المغرب', time: prayerTimes.maghrib },
        { name: 'Isha', arabicName: 'العشاء', time: prayerTimes.isha },
      ];

      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);

        // Si l'heure est passée aujourd'hui, programmer pour demain
        if (prayerDate <= new Date()) {
          prayerDate.setDate(prayerDate.getDate() + 1);
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `🕌 Heure de ${prayer.name}`,
            body: `Il est temps pour la prière de ${prayer.name} (${prayer.arabicName})`,
            sound: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: prayerDate,
          },
        });
      }

      console.log('✅ Notifications programmées pour', prayers.length, 'prières');
    } catch (error) {
      console.error('Erreur programmation notifications:', error);
    }
  }, [prayerTimes]);

  // Planifier les notifications quand les horaires changent
  useEffect(() => {
    if (prayerTimes && notificationsEnabled) {
      scheduleNotifications();
    }
  }, [prayerTimes, notificationsEnabled]);

  // Charger les préférences sauvegardées (mémorisé)
  const loadSavedPreferences = useCallback(async () => {
    if (preferencesLoaded) return;
    
    try {
      const savedCity = await AsyncStorage.getItem('prayer_city');
      const savedNotifications = await AsyncStorage.getItem('prayer_notifications');
      
      if (savedCity) {
        setCity(savedCity);
        setInputCity(savedCity);
      }
      
      if (savedNotifications === 'true') {
        // Vérifier les permissions existantes
        const { status } = await Notifications.getPermissionsAsync();
        if (status === 'granted') {
          setNotificationsEnabled(true);
        }
      }
      
      setPreferencesLoaded(true);
    } catch (error) {
      console.error('Erreur chargement préférences:', error);
      setPreferencesLoaded(true);
    }
  }, [preferencesLoaded]);

  // Sauvegarder la ville (mémorisé)
  const saveCity = useCallback(async (newCity: string) => {
    try {
      await AsyncStorage.setItem('prayer_city', newCity);
    } catch (error) {
      console.error('Erreur sauvegarde ville:', error);
    }
  }, []);


  // Gérer l'activation des notifications (mémorisé)
  const handleNotificationsToggle = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre permission pour vous envoyer des rappels de prières.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    setNotificationsEnabled(enabled);
    await AsyncStorage.setItem('prayer_notifications', enabled.toString());

    if (!enabled) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, []);

  // Tester les notifications immédiatement
  const testNotification = useCallback(async () => {
    try {
      // Vérifier si on est sur web
      if (Platform.OS === 'web') {
        Alert.alert(
          '🌐 Test Web',
          'Les notifications ne sont pas disponibles sur navigateur web. Cette fonctionnalité fonctionne uniquement sur mobile (iOS/Android).\n\nPour tester les vraies notifications :\n1. Utilisez l\'app sur votre téléphone\n2. Ou utilisez un émulateur mobile',
          [{ text: 'Compris' }]
        );
        return;
      }

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissions requises',
          'Veuillez d\'abord activer les notifications ci-dessus.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Envoyer une notification de test dans 3 secondes
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🕌 Test Notification Muzlife',
          body: 'Ceci est un test de notification de prière. Les vraies notifications arriveront aux heures de prière.',
          sound: 'default',
          data: { type: 'test' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 3, // Dans 3 secondes
        },
      });

      Alert.alert(
        '⏱️ Notification programmée',
        'Une notification de test va apparaître dans 3 secondes !',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Erreur test notification:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'envoyer la notification de test. Les notifications ne sont peut-être pas supportées sur cette plateforme.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  // Obtenir le nom français de la prochaine prière
  const getNextPrayerName = (): string => {
    const prayerNames: Record<string, string> = {
      fajr: 'Fajr',
      sunrise: 'Lever du soleil',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
    };
    return nextPrayer ? prayerNames[nextPrayer] : '';
  };

  const requestLocationPermission = async () => {
    setLocationLoading(true);
    console.log('🌍 Demande de géolocalisation démarrée - Platform:', Platform.OS);
    
    try {
      if (Platform.OS === 'web') {
        // Sur web, essayer d'abord le GPS, puis fallback sur l'IP
        console.log('🌐 Mode Web - Tentative GPS puis fallback IP si échec');
        
        try {
          // Essayer le GPS avec un timeout court
          console.log('📍 Tentative GPS...');
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('GPS timeout')), 3000);
            
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                clearTimeout(timeout);
                console.log('✅ Position GPS reçue:', pos);
                resolve(pos);
              }, 
              (err) => {
                clearTimeout(timeout);
                console.log('⚠️ GPS échoué, utilisation de l\'IP comme fallback');
                reject(err);
              }, 
              {
                enableHighAccuracy: false, // Mode rapide
                timeout: 3000,
                maximumAge: 60000,
              }
            );
          });

          // Si GPS réussi, utiliser les coordonnées
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=fr`
          );
          const data = await response.json();
          const cityName = data.city || data.locality || data.principalSubdivision || 'Paris';
          
          setCity(cityName);
          setInputCity(cityName);
          saveCity(cityName);
          console.log('✅ Ville mise à jour par GPS:', cityName);
          Alert.alert('Position trouvée', `Ville détectée par GPS: ${cityName}`);
          
        } catch (gpsError) {
          // Fallback: utiliser l'IP si le GPS échoue
          console.log('🌐 GPS échoué, utilisation de la géolocalisation par IP...');
          
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          if (data.city) {
            setCity(data.city);
            setInputCity(data.city);
            saveCity(data.city);
            console.log('✅ Ville détectée par IP:', data.city);
            Alert.alert('Position trouvée', `Ville détectée: ${data.city}`);
          } else {
            throw new Error('Impossible de détecter la ville');
          }
        }
      } else {
        // Sur mobile, utiliser expo-location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission refusée',
            'Nous avons besoin de votre localisation pour trouver les horaires de prières de votre ville.',
            [{ text: 'OK' }]
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const cityName = reverseGeocode[0].city || reverseGeocode[0].district || reverseGeocode[0].subregion || 'Paris';
          
          // Mettre à jour la ville - le hook se rechargera automatiquement
          setCity(cityName);
          setInputCity(cityName);
          saveCity(cityName);
          
          // Notification de succès
          console.log('✅ Ville mise à jour (mobile):', cityName);
          Alert.alert('Position trouvée', `Ville détectée: ${cityName}`);
        }
      }
    } catch (error) {
      console.error('Erreur géolocalisation:', error);
      let errorMessage = 'Impossible de récupérer votre position.';
      
      if (Platform.OS === 'web') {
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permission de géolocalisation refusée. Activez la localisation dans votre navigateur.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Position non disponible. Vérifiez votre connexion.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Délai dépassé pour obtenir votre position.';
              break;
          }
        }
      }
      
      Alert.alert('Erreur', errorMessage + ' Utilisation de Paris par défaut.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCityChange = () => {
    console.log('🏙️ Changement de ville:', inputCity);
    if (inputCity.trim()) {
      const newCity = inputCity.trim();
      setCity(newCity);
      saveCity(newCity);
    }
  };


  const getCurrentTimeString = () => {
    return new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCurrentDateString = () => {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !prayerTimes) {
    return <Loading fullScreen text="Chargement des horaires de prières..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        {/* Header avec date et heure */}
        <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Text style={styles.currentTime}>{getCurrentTimeString()}</Text>
            <Text style={styles.currentDate}>{getCurrentDateString()}</Text>
            <Text style={styles.cityText}>📍 {city}</Text>
            
            {/* Prochaine prière et temps restant */}
            {nextPrayer && timeUntilNext && (
              <View style={styles.nextPrayerContainer}>
                <Text style={styles.nextPrayerLabel}>Prochaine prière :</Text>
                <Text style={styles.nextPrayerName}>{getNextPrayerName()}</Text>
                <Text style={styles.timeRemaining}>dans {timeUntilNext}</Text>
              </View>
            )}
          </View>
          
          {/* Bouton paramètres */}
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setShowSettings(!showSettings)}
          >
            <Ionicons 
              name={showSettings ? "settings" : "settings-outline"} 
              size={24} 
              color={Colors.primary} 
            />
          </TouchableOpacity>
        </Card>

        {/* Paramètres de notifications */}
        {showSettings && (
          <Card style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>⚙️ Paramètres</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Notifications de prières</Text>
                <Text style={styles.settingDescription}>
                  Recevez des rappels à chaque heure de prière
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                thumbColor={notificationsEnabled ? Colors.primary : Colors.textSecondary}
              />
            </View>
            
            {notificationsEnabled && (
              <>
                <View style={styles.notificationStatus}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  <Text style={styles.notificationStatusText}>
                    Notifications actives pour 5 prières quotidiennes
                  </Text>
                </View>

                {/* Bouton de test des notifications */}
                <TouchableOpacity
                  style={[
                    styles.testNotificationButton,
                    Platform.OS === 'web' && styles.testNotificationButtonWeb
                  ]}
                  onPress={testNotification}
                >
                  <Ionicons 
                    name={Platform.OS === 'web' ? 'information-circle' : 'notifications-outline'} 
                    size={20} 
                    color={Platform.OS === 'web' ? Colors.warning : Colors.primary} 
                  />
                  <Text style={[
                    styles.testNotificationText,
                    Platform.OS === 'web' && styles.testNotificationTextWeb
                  ]}>
                    {Platform.OS === 'web' ? 'Info notifications (Web)' : 'Tester les notifications'}
                  </Text>
                  <Ionicons 
                    name={Platform.OS === 'web' ? 'help-circle' : 'play-circle'} 
                    size={16} 
                    color={Platform.OS === 'web' ? Colors.warning : Colors.primary} 
                  />
                </TouchableOpacity>
              </>
            )}
          </Card>
        )}

        {/* Section de recherche de ville */}
        <Card style={styles.searchCard}>
          <Text style={styles.sectionTitle}>Changer de ville</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.cityInput}
              value={inputCity}
              onChangeText={setInputCity}
              placeholder="Entrez une ville..."
              placeholderTextColor={Colors.textSecondary}
            />
            <Button
              title="Rechercher"
              onPress={handleCityChange}
              size="small"
              style={styles.searchButton}
            />
          </View>
          <Button
            title="📍 Utiliser ma position"
            onPress={requestLocationPermission}
            variant="outline"
            loading={locationLoading}
            style={styles.locationButton}
          />
        </Card>

        {/* Affichage des erreurs */}
        {error && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>❌ {error}</Text>
            <Button
              title="Réessayer"
              onPress={refetch}
              size="small"
              style={styles.retryButton}
            />
          </Card>
        )}

        {/* Horaires de prières */}
        {prayerTimes && (
          <View style={styles.prayerTimesContainer}>
            <Text style={styles.sectionTitle}>Horaires de prières</Text>
            
            <PrayerTimeCard
              name="Fajr"
              arabicName="الفجر"
              time={prayerTimes.fajr}
              isNext={nextPrayer === 'fajr'}
            />
            
            <PrayerTimeCard
              name="Lever du soleil"
              arabicName="الشروق"
              time={prayerTimes.sunrise}
              isNext={nextPrayer === 'sunrise'}
            />
            
            <PrayerTimeCard
              name="Dhuhr"
              arabicName="الظهر"
              time={prayerTimes.dhuhr}
              isNext={nextPrayer === 'dhuhr'}
            />
            
            <PrayerTimeCard
              name="Asr"
              arabicName="العصر"
              time={prayerTimes.asr}
              isNext={nextPrayer === 'asr'}
            />
            
            <PrayerTimeCard
              name="Maghrib"
              arabicName="المغرب"
              time={prayerTimes.maghrib}
              isNext={nextPrayer === 'maghrib'}
            />
            
            <PrayerTimeCard
              name="Isha"
              arabicName="العشاء"
              time={prayerTimes.isha}
              isNext={nextPrayer === 'isha'}
            />
          </View>
        )}

        {/* Boutons de navigation vers les autres écrans */}
        <Card style={styles.navigationCard}>
          <Text style={styles.sectionTitle}>🧭 Outils de Prière</Text>
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => navigation.navigate('QiblaCompass' as never)}
          >
            <View style={styles.navigationButtonContent}>
              <Ionicons name="compass" size={24} color={Colors.primary} />
              <View style={styles.navigationButtonText}>
                <Text style={styles.navigationButtonTitle}>Boussole Qibla</Text>
                <Text style={styles.navigationButtonSubtitle}>
                  Trouvez la direction de La Mecque
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => navigation.navigate('WuduGuide' as never)}
          >
            <View style={styles.navigationButtonContent}>
              <Ionicons name="water" size={24} color={Colors.secondary} />
              <View style={styles.navigationButtonText}>
                <Text style={styles.navigationButtonTitle}>Guide des Ablutions</Text>
                <Text style={styles.navigationButtonSubtitle}>
                  Apprenez comment faire le Wudu
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => navigation.navigate('PrayerSettings' as never)}
          >
            <View style={styles.navigationButtonContent}>
              <Ionicons name="settings" size={24} color={Colors.textSecondary} />
              <View style={styles.navigationButtonText}>
                <Text style={styles.navigationButtonTitle}>Paramètres de Prière</Text>
                <Text style={styles.navigationButtonSubtitle}>
                  Méthodes de calcul et notifications
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    marginBottom: Spacing.sm,
  },
  headerContent: {
    alignItems: 'center',
  },
  currentTime: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  currentDate: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  cityText: {
    fontSize: FontSizes.lg,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  nextPrayerContainer: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextPrayerLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  nextPrayerName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  timeRemaining: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.success,
    fontFamily: 'monospace',
  },
  settingsButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    padding: Spacing.xs,
  },
  settingsCard: {
    marginBottom: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  notificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.success + '15',
    borderRadius: 8,
    gap: Spacing.xs,
  },
  notificationStatusText: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: '500',
  },
  testNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    gap: Spacing.sm,
  },
  testNotificationText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  testNotificationButtonWeb: {
    backgroundColor: Colors.warning + '10',
    borderColor: Colors.warning + '30',
  },
  testNotificationTextWeb: {
    color: Colors.warning,
  },
  searchCard: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.sm,
    fontSize: FontSizes.md,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
  },
  searchButton: {
    minWidth: 80,
  },
  locationButton: {
    marginTop: Spacing.xs,
  },
  errorCard: {
    backgroundColor: '#FFF5F5',
    borderColor: Colors.error,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  retryButton: {
    minWidth: 100,
  },
  prayerTimesContainer: {
    marginBottom: Spacing.lg,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
  navigationCard: {
    marginBottom: Spacing.md,
  },
  navigationButton: {
    marginBottom: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navigationButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  navigationButtonText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  navigationButtonTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  navigationButtonSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

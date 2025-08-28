import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Alert, 
  Platform,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { Colors, FontSizes, Spacing } from '../../constants/theme';

// Coordonnées de la Kaaba à La Mecque
const KAABA_COORDS = {
  latitude: 21.4225,
  longitude: 39.8262,
};

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
}

export default function QiblaCompassScreen() {
  // États pour la géolocalisation et la boussole
  const [location, setLocation] = useState<LocationData | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [currentHeading, setCurrentHeading] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [isCalibrated, setIsCalibrated] = useState(false);
  
  // Animation pour la rotation de la boussole
  const compassRotation = new Animated.Value(0);
  const qiblaRotation = new Animated.Value(0);

  useEffect(() => {
    // Démarrer le magnétomètre si disponible
    startMagnetometer();
    
    return () => {
      Magnetometer.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    // Calculer la direction Qibla quand la position change
    if (location) {
      const direction = calculateQiblaDirection(location);
      setQiblaDirection(direction);
    }
  }, [location]);

  useEffect(() => {
    // Animer la rotation de la boussole
    Animated.timing(compassRotation, {
      toValue: -currentHeading,
      duration: 100,
      useNativeDriver: true,
    }).start();

    // Animer l'indicateur Qibla
    const qiblaAngle = qiblaDirection - currentHeading;
    Animated.timing(qiblaRotation, {
      toValue: qiblaAngle,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [currentHeading, qiblaDirection]);

  // Démarrer le magnétomètre pour la boussole
  const startMagnetometer = () => {
    if (Platform.OS === 'web') {
      // Sur web, utiliser l'API DeviceOrientationEvent si disponible
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      } else {
        setError('Boussole non disponible sur ce navigateur');
      }
      return;
    }

    // Sur mobile, utiliser expo-sensors
    Magnetometer.setUpdateInterval(100);
    const subscription = Magnetometer.addListener((data) => {
      setMagnetometerData(data);
      const heading = calculateHeading(data);
      setCurrentHeading(heading);
      setIsCalibrated(true);
    });

    return () => subscription?.remove();
  };

  // Gestionnaire pour l'orientation du device (web)
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setCurrentHeading(event.alpha);
      setIsCalibrated(true);
    }
  };

  // Calculer la direction de la boussole basée sur le magnétomètre
  const calculateHeading = (magnetometerData: { x: number; y: number; z: number }): number => {
    const { x, y } = magnetometerData;
    let heading = Math.atan2(y, x) * (180 / Math.PI);
    heading = heading < 0 ? heading + 360 : heading;
    return heading;
  };

  // Calculer la direction Qibla basée sur la position
  const calculateQiblaDirection = (userLocation: LocationData): number => {
    const userLat = userLocation.latitude * (Math.PI / 180);
    const userLng = userLocation.longitude * (Math.PI / 180);
    const meccaLat = KAABA_COORDS.latitude * (Math.PI / 180);
    const meccaLng = KAABA_COORDS.longitude * (Math.PI / 180);

    const deltaLng = meccaLng - userLng;

    const y = Math.sin(deltaLng) * Math.cos(meccaLat);
    const x = Math.cos(userLat) * Math.sin(meccaLat) - 
              Math.sin(userLat) * Math.cos(meccaLat) * Math.cos(deltaLng);

    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  // Obtenir la position de l'utilisateur
  const getUserLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'web') {
        // Sur web, utiliser l'API de géolocalisation du navigateur
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        });

        const newLocation: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Optionnel : obtenir le nom de la ville
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=fr`
          );
          const data = await response.json();
          newLocation.city = data.city || data.locality || 'Position inconnue';
        } catch (cityError) {
          console.warn('Impossible d\'obtenir le nom de la ville:', cityError);
        }

        setLocation(newLocation);
        
      } else {
        // Sur mobile, utiliser expo-location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission de géolocalisation refusée');
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const newLocation: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Obtenir le nom de la ville
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          newLocation.city = reverseGeocode[0].city || reverseGeocode[0].district || 'Position inconnue';
        }

        setLocation(newLocation);
      }

      Alert.alert(
        'Position trouvée',
        'Direction Qibla calculée avec succès !',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Erreur géolocalisation:', error);
      let errorMessage = 'Impossible d\'obtenir votre position.';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission de géolocalisation refusée.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position non disponible.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai dépassé pour obtenir votre position.';
            break;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer la distance approximative jusqu'à La Mecque
  const getDistanceToMecca = (): string => {
    if (!location) return '';
    
    const R = 6371; // Rayon de la Terre en km
    const lat1 = location.latitude * (Math.PI / 180);
    const lat2 = KAABA_COORDS.latitude * (Math.PI / 180);
    const deltaLat = (KAABA_COORDS.latitude - location.latitude) * (Math.PI / 180);
    const deltaLng = (KAABA_COORDS.longitude - location.longitude) * (Math.PI / 180);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance > 1000 
      ? `${Math.round(distance).toLocaleString()} km` 
      : `${Math.round(distance)} km`;
  };

  // Obtenir l'angle de déviation par rapport à Qibla
  const getDeviationAngle = (): number => {
    if (!location) return 0;
    let deviation = qiblaDirection - currentHeading;
    
    // Normaliser l'angle entre -180 et 180
    if (deviation > 180) deviation -= 360;
    if (deviation < -180) deviation += 360;
    
    return Math.abs(deviation);
  };

  // Obtenir le message de direction
  const getDirectionMessage = (): string => {
    const deviation = getDeviationAngle();
    
    if (deviation <= 5) {
      return '🎯 Parfait ! Vous pointez vers La Mecque';
    } else if (deviation <= 15) {
      return '✅ Très bien ! Presque parfaitement aligné';
    } else if (deviation <= 30) {
      return '⚠️ Proche ! Ajustez légèrement votre direction';
    } else {
      return '❌ Tournez-vous pour trouver la direction Qibla';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec informations */}
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>🕌 Boussole Qibla</Text>
          <Text style={styles.subtitle}>
            Direction vers la Kaaba, La Mecque
          </Text>
          {location?.city && (
            <Text style={styles.locationText}>📍 {location.city}</Text>
          )}
        </View>
      </Card>

      {/* Message d'erreur */}
      {error && (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </Card>
      )}

      {/* État de chargement */}
      {isLoading && (
        <Card style={styles.loadingCard}>
          <Loading size="small" />
          <Text style={styles.loadingText}>Localisation en cours...</Text>
        </Card>
      )}

      {/* Boussole principale */}
      <View style={styles.compassContainer}>
        {location && isCalibrated ? (
          <View style={styles.compassWrapper}>
            {/* Cercle extérieur de la boussole */}
            <Animated.View 
              style={[
                styles.compassCircle,
                {
                  transform: [{ rotate: compassRotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })}],
                },
              ]}
            >
              {/* Points cardinaux */}
              <View style={[styles.cardinalPoint, styles.northPoint]}>
                <Text style={styles.cardinalText}>N</Text>
              </View>
              <View style={[styles.cardinalPoint, styles.eastPoint]}>
                <Text style={styles.cardinalText}>E</Text>
              </View>
              <View style={[styles.cardinalPoint, styles.southPoint]}>
                <Text style={styles.cardinalText}>S</Text>
              </View>
              <View style={[styles.cardinalPoint, styles.westPoint]}>
                <Text style={styles.cardinalText}>W</Text>
              </View>
              
              {/* Markings de la boussole */}
              {Array.from({ length: 12 }, (_, i) => (
                <View 
                  key={i}
                  style={[
                    styles.compassMark,
                    {
                      transform: [{ rotate: `${i * 30}deg` }],
                    },
                  ]}
                />
              ))}
            </Animated.View>

            {/* Indicateur Qibla */}
            <Animated.View 
              style={[
                styles.qiblaIndicator,
                {
                  transform: [{ rotate: qiblaRotation.interpolate({
                    inputRange: [-180, 180],
                    outputRange: ['-180deg', '180deg'],
                  })}],
                },
              ]}
            >
              <View style={styles.qiblaArrow}>
                <Ionicons name="location" size={40} color={Colors.primary} />
                <Text style={styles.qiblaText}>QIBLA</Text>
              </View>
            </Animated.View>

            {/* Centre de la boussole */}
            <View style={styles.compassCenter}>
              <Ionicons name="navigate" size={30} color={Colors.text} />
            </View>
          </View>
        ) : (
          <View style={styles.compassPlaceholder}>
            <Ionicons name="compass-outline" size={100} color={Colors.textSecondary} />
            <Text style={styles.placeholderText}>
              {location ? 'Calibrage de la boussole...' : 'Appuyez sur le bouton ci-dessous'}
            </Text>
          </View>
        )}
      </View>

      {/* Informations de direction */}
      {location && (
        <Card style={styles.infoCard}>
          <Text style={styles.directionMessage}>{getDirectionMessage()}</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Direction Qibla</Text>
              <Text style={styles.infoValue}>{Math.round(qiblaDirection)}°</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Direction actuelle</Text>
              <Text style={styles.infoValue}>{Math.round(currentHeading)}°</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{getDistanceToMecca()}</Text>
            </View>
          </View>
          <View style={styles.accuracyBar}>
            <View 
              style={[
                styles.accuracyFill,
                {
                  width: `${Math.max(0, 100 - getDeviationAngle() * 2)}%`,
                  backgroundColor: getDeviationAngle() <= 15 ? Colors.success : 
                                   getDeviationAngle() <= 30 ? Colors.warning : Colors.error,
                }
              ]}
            />
          </View>
        </Card>
      )}

      {/* Bouton d'action */}
      <View style={styles.actionContainer}>
        {!location ? (
          <Button
            title="📍 Trouver ma position"
            onPress={getUserLocation}
            loading={isLoading}
            size="large"
            style={styles.actionButton}
          />
        ) : (
          <Button
            title="🔄 Recalibrer"
            onPress={getUserLocation}
            variant="outline"
            loading={isLoading}
            size="large"
            style={styles.actionButton}
          />
        )}
      </View>

      {/* Conseils d'utilisation */}
      <Card style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Conseils d'utilisation</Text>
        <Text style={styles.tipsText}>
          • Tenez votre téléphone à plat et à niveau{'\n'}
          • Éloignez-vous des objets métalliques{'\n'}
          • Calibrez la boussole en faisant un 8 dans l'air si nécessaire{'\n'}
          • La précision dépend de votre capteur magnétique
        </Text>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  headerCard: {
    marginBottom: Spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  locationText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: Colors.error + '15',
    borderColor: Colors.error,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  loadingText: {
    color: Colors.textSecondary,
  },
  compassContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  compassWrapper: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  compassCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardinalPoint: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  northPoint: {
    top: -15,
    backgroundColor: Colors.error,
    borderRadius: 15,
  },
  eastPoint: {
    right: -15,
    backgroundColor: Colors.textSecondary,
    borderRadius: 15,
  },
  southPoint: {
    bottom: -15,
    backgroundColor: Colors.textSecondary,
    borderRadius: 15,
  },
  westPoint: {
    left: -15,
    backgroundColor: Colors.textSecondary,
    borderRadius: 15,
  },
  cardinalText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
  },
  compassMark: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
    top: -10,
  },
  qiblaIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  qiblaArrow: {
    alignItems: 'center',
    paddingTop: 20,
  },
  qiblaText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  compassCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  compassPlaceholder: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  placeholderText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  infoCard: {
    marginBottom: Spacing.md,
  },
  directionMessage: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  accuracyBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionContainer: {
    marginBottom: Spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  tipsCard: {
    marginBottom: Spacing.md,
  },
  tipsTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tipsText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
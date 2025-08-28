'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';

interface LocationGPSProps {
  onLocationDetected?: (location: { latitude: number; longitude: number; }) => void;
  className?: string;
}

interface GeoLocationResult {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export default function LocationGPS({ onLocationDetected, className }: LocationGPSProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCity, setCountry, countries } = useLocation();

  // Fonction pour obtenir la ville à partir des coordonnées GPS
  const getCityFromCoordinates = async (latitude: number, longitude: number): Promise<GeoLocationResult | null> => {
    try {
      // Utiliser l'API de géocodage inversé Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=fr`,
        {
          headers: {
            'User-Agent': 'MuzLife-PrayerTimes/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations de localisation');
      }

      const data = await response.json();
      const address = data.address || {};

      let cityName = address.city || address.town || address.village || address.municipality;
      let countryName = address.country || '';

      // Si on ne trouve pas de ville, utiliser la localité
      if (!cityName) {
        cityName = address.suburb || address.neighbourhood || data.display_name?.split(',')[0] || 'Position GPS';
      }

      return {
        latitude,
        longitude,
        city: cityName,
        country: countryName
      };
    } catch (error) {
      console.error('Erreur lors du géocodage inversé:', error);
      return null;
    }
  };

  // Fonction pour trouver le pays correspondant dans notre liste
  const findMatchingCountry = (countryName: string) => {
    const normalizedName = countryName.toLowerCase();
    
    // Mapping des noms de pays
    const countryMappings: Record<string, string> = {
      'france': 'France',
      'morocco': 'Maroc',
      'maroc': 'Maroc',
      'algeria': 'Algérie',
      'algérie': 'Algérie',
      'tunisia': 'Tunisie',
      'tunisie': 'Tunisie',
      'belgium': 'Belgique',
      'belgique': 'Belgique',
      'switzerland': 'Suisse',
      'suisse': 'Suisse',
      'canada': 'Canada',
      'germany': 'Allemagne',
      'allemagne': 'Allemagne',
      'united kingdom': 'Royaume-Uni',
      'royaume-uni': 'Royaume-Uni',
      'uk': 'Royaume-Uni',
      'spain': 'Espagne',
      'espagne': 'Espagne',
      'italy': 'Italie',
      'italie': 'Italie',
      'netherlands': 'Pays-Bas',
      'pays-bas': 'Pays-Bas',
      'turkey': 'Turquie',
      'turquie': 'Turquie',
      'egypt': 'Égypte',
      'égypte': 'Égypte',
      'saudi arabia': 'Arabie Saoudite',
      'arabie saoudite': 'Arabie Saoudite',
      'united arab emirates': 'Émirats Arabes Unis',
      'émirats arabes unis': 'Émirats Arabes Unis',
      'uae': 'Émirats Arabes Unis',
      'united states': 'États-Unis',
      'états-unis': 'États-Unis',
      'usa': 'États-Unis',
      'us': 'États-Unis'
    };

    const mappedName = countryMappings[normalizedName];
    if (mappedName) {
      return countries.find(c => c.name === mappedName);
    }

    // Recherche directe dans notre liste
    return countries.find(c => 
      c.name.toLowerCase() === normalizedName ||
      c.name.toLowerCase().includes(normalizedName)
    );
  };

  // Fonction principale de géolocalisation
  const handleGetGPSLocation = async () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Callback pour les composants parents
      if (onLocationDetected) {
        onLocationDetected({ latitude, longitude });
      }

      // Obtenir les informations de la ville
      const locationInfo = await getCityFromCoordinates(latitude, longitude);
      
      if (locationInfo && locationInfo.country) {
        // Trouver le pays correspondant dans notre liste
        const matchingCountry = findMatchingCountry(locationInfo.country);
        
        if (matchingCountry) {
          // Mettre à jour le pays
          setCountry(matchingCountry);
          
          // Créer l'objet ville avec les coordonnées GPS
          const cityData = {
            name: locationInfo.city || 'Ma Position',
            country: matchingCountry.name,
            latitude: locationInfo.latitude,
            longitude: locationInfo.longitude,
            displayName: `${locationInfo.city || 'Ma Position'}, ${matchingCountry.name}`
          };
          
          // Mettre à jour la ville
          setCity(cityData);
        } else {
          // Pays non supporté, utiliser une ville GPS générique
          const cityData = {
            name: 'Ma Position GPS',
            country: locationInfo.country,
            latitude: locationInfo.latitude,
            longitude: locationInfo.longitude,
            displayName: `Ma Position GPS, ${locationInfo.country}`
          };
          setCity(cityData);
        }
      } else {
        // Utiliser directement les coordonnées GPS
        const cityData = {
          name: 'Ma Position GPS',
          country: 'Position GPS',
          latitude,
          longitude,
          displayName: `Position GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        };
        setCity(cityData);
      }

    } catch (error: any) {
      let errorMessage = 'Erreur lors de la géolocalisation';
      
      if (error.code === 1) {
        errorMessage = 'Géolocalisation refusée. Veuillez autoriser l\'accès à votre position.';
      } else if (error.code === 2) {
        errorMessage = 'Position non disponible. Vérifiez votre connexion et les paramètres de localisation.';
      } else if (error.code === 3) {
        errorMessage = 'Délai d\'attente dépassé pour la géolocalisation.';
      }
      
      setError(errorMessage);
      console.error('Erreur de géolocalisation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        onClick={handleGetGPSLocation}
        disabled={loading}
        variant="outline"
        className="w-full flex items-center gap-2 h-12"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Navigation className="h-4 w-4" />
        )}
        {loading ? 'Localisation en cours...' : 'Utiliser ma position GPS'}
      </Button>
      
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
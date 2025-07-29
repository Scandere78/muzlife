'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, MapPin, Calendar, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import CityAutocomplete from './CityAutocomplete';

// Interface pour les horaires de prière
interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

// Interface pour les résultats de ville
interface CityResult {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

interface PrayerTimesData {
  timings: PrayerTimes;
  date: {
    readable: string;
    gregorian: {
      date: string;
      weekday: {
        en: string;
      };
      month: {
        en: string;
      };
      year: string;
    };
    hijri: {
      date: string;
      month: {
        en: string;
      };
      year: string;
    };
  };
  meta: {
    timezone: string;
    method: {
      name: string;
    };
  };
}

// Configuration des prières avec leurs icônes et couleurs
const prayerConfig = {
  Fajr: { name: 'Fajr (Aube)', icon: Sunrise, color: 'bg-blue-500', textColor: 'text-blue-500' },
  Sunrise: { name: 'Lever du soleil', icon: Sun, color: 'bg-orange-400', textColor: 'text-orange-400' },
  Dhuhr: { name: 'Dhuhr (Midi)', icon: Sun, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  Asr: { name: 'Asr (Après-midi)', icon: Sun, color: 'bg-orange-500', textColor: 'text-orange-500' },
  Sunset: { name: 'Coucher du soleil', icon: Sunset, color: 'bg-red-400', textColor: 'text-red-400' },
  Maghrib: { name: 'Maghrib (Soir)', icon: Sunset, color: 'bg-purple-500', textColor: 'text-purple-500' },
  Isha: { name: 'Isha (Nuit)', icon: Moon, color: 'bg-indigo-600', textColor: 'text-indigo-600' },
};

// Fonction pour formater l'heure
function formatTime(time: string): string {
  return time.substring(0, 5); // Retourne HH:MM
}

// Fonction pour calculer le temps restant jusqu'à la prochaine prière
function getTimeUntilNextPrayer(timings: PrayerTimes): { nextPrayer: string; timeRemaining: string } {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const prayerTimes = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Sunrise', time: timings.Sunrise },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];
  
  let nextPrayer = '';
  let minDiff = Infinity;
  
  for (const prayer of prayerTimes) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    let diff = prayerMinutes - currentTime;
    
    // Si la prière est déjà passée aujourd'hui, on passe à la suivante
    if (diff < 0) {
      diff += 24 * 60; // Ajouter 24 heures
    }
    
    if (diff < minDiff) {
      minDiff = diff;
      nextPrayer = prayer.name;
    }
  }
  
  const hours = Math.floor(minDiff / 60);
  const minutes = minDiff % 60;
  const timeRemaining = `${hours}h ${minutes}m`;
  
  return { nextPrayer, timeRemaining };
}

export default function PrayerTimes() {
  const [city, setCity] = useState('Paris');
  const [country, setCountry] = useState('France');
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null);
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<{ nextPrayer: string; timeRemaining: string } | null>(null);

  // Fonction pour récupérer les horaires de prière
  const fetchPrayerTimes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Utiliser la ville sélectionnée ou la ville saisie
      const cityToSearch = selectedCity?.name || city;
      const countryToSearch = selectedCity?.country || country;
      
      const response = await fetch(`/api/prayer-times?city=${encodeURIComponent(cityToSearch)}&country=${encodeURIComponent(countryToSearch)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des horaires');
      }
      
      const data = await response.json();
      setPrayerData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le temps restant toutes les minutes
  useEffect(() => {
    if (prayerData) {
      const updateTimeUntilNext = () => {
        const result = getTimeUntilNextPrayer(prayerData.timings);
        setTimeUntilNext(result);
      };
      
      updateTimeUntilNext();
      const interval = setInterval(updateTimeUntilNext, 60000); // Mise à jour toutes les minutes
      
      return () => clearInterval(interval);
    }
  }, [prayerData]);

  // Charger les horaires au montage du composant
  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  // Gérer la sélection d'une ville
  const handleCitySelect = (selectedCityData: CityResult) => {
    setSelectedCity(selectedCityData);
    setCity(selectedCityData.name);
    setCountry(selectedCityData.country);
    // Automatiquement rechercher les horaires quand une ville est sélectionnée
    setTimeout(() => fetchPrayerTimes(), 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrayerTimes();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white/70 rounded-lg">
      {/* En-tête avec recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Horaires de Prière
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <CityAutocomplete
                value={city}
                onChange={setCity}
                onCitySelect={handleCitySelect}
                placeholder="Entrez votre ville (ex: Corbeil-Essonnes, Paris, Lyon...)"
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Pays (optionnel)"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading} className="whitespace-nowrap">
              {loading ? 'Chargement...' : 'Rechercher'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Affichage des erreurs */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Informations de la ville et de la date */}
      {prayerData && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">
                  {selectedCity ? selectedCity.displayName : `${city}, ${country}`}
                </span>
                <span className="text-sm text-muted-foreground">({prayerData.meta.timezone})</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="text-right">
                  <div className="font-medium">{prayerData.date.gregorian.weekday.en}, {prayerData.date.gregorian.date}</div>
                  <div className="text-sm text-muted-foreground">
                    {prayerData.date.hijri.date} {prayerData.date.hijri.month.en} {prayerData.date.hijri.year} AH
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prochaine prière */}
      {timeUntilNext && prayerData && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Prochaine Prière</h3>
              <div className="text-2xl font-bold text-primary mb-2">
                {prayerConfig[timeUntilNext.nextPrayer as keyof typeof prayerConfig]?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                Dans {timeUntilNext.timeRemaining}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grille des horaires de prière */}
      {prayerData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(prayerConfig).map(([key, config]) => {
            const Icon = config.icon;
            const time = prayerData.timings[key as keyof PrayerTimes];
            const isNextPrayer = timeUntilNext?.nextPrayer === key;
            
            return (
              <Card key={key} className={`transition-all duration-200 ${isNextPrayer ? 'ring-2 ring-primary shadow-lg' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${config.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{config.name}</div>
                        <div className={`text-lg font-bold ${config.textColor}`}>
                          {formatTime(time)}
                        </div>
                      </div>
                    </div>
                    {isNextPrayer && (
                      <div className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        Prochaine
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Informations supplémentaires */}
      {prayerData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations Complémentaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Imsak (Début du jeûne):</strong> {formatTime(prayerData.timings.Imsak)}
              </div>
              <div>
                <strong>Minuit:</strong> {formatTime(prayerData.timings.Midnight)}
              </div>
              <div>
                <strong>Premier tiers de la nuit:</strong> {formatTime(prayerData.timings.Firstthird)}
              </div>
              <div>
                <strong>Dernier tiers de la nuit:</strong> {formatTime(prayerData.timings.Lastthird)}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Méthode de calcul: {prayerData.meta.method.name}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";

// Interface pour une ville
interface City {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

// Interface pour un pays
interface Country {
  name: string;
  code: string;
  flag: string;
}

// Interface pour les préférences de localisation
interface LocationPreferences {
  country: Country;
  city: City;
}

interface LocationContextType {
  preferences: LocationPreferences;
  countries: Country[];
  loading: boolean;
  setCountry: (country: Country) => void;
  setCity: (city: City) => void;
  savePreferences: () => Promise<void>;
  resetToDefaults: () => void;
}

// Pays prédéfinis avec drapeaux
const COUNTRIES: Country[] = [
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Maroc", code: "MA", flag: "🇲🇦" },
  { name: "Algérie", code: "DZ", flag: "🇩🇿" },
  { name: "Tunisie", code: "TN", flag: "🇹🇳" },
  { name: "Belgique", code: "BE", flag: "🇧🇪" },
  { name: "Suisse", code: "CH", flag: "🇨🇭" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Allemagne", code: "DE", flag: "🇩🇪" },
  { name: "Royaume-Uni", code: "GB", flag: "🇬🇧" },
  { name: "Espagne", code: "ES", flag: "🇪🇸" },
  { name: "Italie", code: "IT", flag: "🇮🇹" },
  { name: "Pays-Bas", code: "NL", flag: "🇳🇱" },
  { name: "Turquie", code: "TR", flag: "🇹🇷" },
  { name: "Égypte", code: "EG", flag: "🇪🇬" },
  { name: "Arabie Saoudite", code: "SA", flag: "🇸🇦" },
  { name: "Émirats Arabes Unis", code: "AE", flag: "🇦🇪" },
  { name: "États-Unis", code: "US", flag: "🇺🇸" },
];

// Valeurs par défaut
const DEFAULT_COUNTRY: Country = { name: "France", code: "FR", flag: "🇫🇷" };
const DEFAULT_CITY: City = {
  name: "Paris",
  country: "France",
  latitude: 48.8566,
  longitude: 2.3522,
  displayName: "Paris, France"
};

const DEFAULT_PREFERENCES: LocationPreferences = {
  country: DEFAULT_COUNTRY,
  city: DEFAULT_CITY
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferences, setPreferences] = useState<LocationPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const { user, authenticatedFetch } = useAuth();

  // Charger les préférences au montage
  useEffect(() => {
    loadPreferences();
  }, [user]);

  // Charger les préférences depuis les cookies ou la base de données
  const loadPreferences = async () => {
    setLoading(true);
    try {
      if (user) {
        // Utilisateur connecté : charger depuis la base de données
        const response = await authenticatedFetch("/api/user/location-preferences");
        if (response && response.ok) {
          const data = await response.json();
          if (data.country && data.city) {
            setPreferences({
              country: data.country,
              city: data.city
            });
          }
        }
      } else {
        // Utilisateur non connecté : charger depuis les cookies
        const cookiePreferences = Cookies.get("location-preferences");
        if (cookiePreferences) {
          try {
            const parsed = JSON.parse(cookiePreferences);
            if (parsed.country && parsed.city) {
              setPreferences(parsed);
            }
          } catch (error) {
            console.error("Erreur lors du parsing des préférences:", error);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des préférences:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les préférences
  const savePreferences = async () => {
    try {
      if (user) {
        // Utilisateur connecté : sauvegarder en base de données
        await authenticatedFetch("/api/user/location-preferences", {
          method: "PUT",
          body: JSON.stringify(preferences)
        });
      } else {
        // Utilisateur non connecté : sauvegarder dans les cookies
        Cookies.set("location-preferences", JSON.stringify(preferences), { 
          expires: 365, // 1 an
          sameSite: 'lax'
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des préférences:", error);
    }
  };

  // Définir le pays
 const setCountry = (country: Country) => {
  setPreferences(prev => ({
    ...prev,
    country,
    city: {
      name: "",
      country: country.name,
      latitude: 0,
      longitude: 0,
      displayName: ""
    }
  }));
};

  // Définir la ville
  const setCity = (city: City) => {
    setPreferences(prev => ({
      ...prev,
      city
    }));
  };

  // Réinitialiser aux valeurs par défaut
  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  // Obtenir la ville par défaut pour un pays
  const getDefaultCityForCountry = (country: Country): City => {
    const defaultCities: Record<string, City> = {
      "FR": { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522, displayName: "Paris, France" },
      "MA": { name: "Casablanca", country: "Maroc", latitude: 33.5731, longitude: -7.5898, displayName: "Casablanca, Maroc" },
      "DZ": { name: "Alger", country: "Algérie", latitude: 36.7378, longitude: 3.0875, displayName: "Alger, Algérie" },
      "TN": { name: "Tunis", country: "Tunisie", latitude: 36.8008, longitude: 10.1817, displayName: "Tunis, Tunisie" },
      "BE": { name: "Bruxelles", country: "Belgique", latitude: 50.8503, longitude: 4.3517, displayName: "Bruxelles, Belgique" },
      "CH": { name: "Zurich", country: "Suisse", latitude: 47.3769, longitude: 8.5417, displayName: "Zurich, Suisse" },
      "CA": { name: "Toronto", country: "Canada", latitude: 43.6532, longitude: -79.3832, displayName: "Toronto, Canada" },
      "DE": { name: "Berlin", country: "Allemagne", latitude: 52.5200, longitude: 13.4050, displayName: "Berlin, Allemagne" },
      "GB": { name: "London", country: "Royaume-Uni", latitude: 51.5074, longitude: -0.1278, displayName: "London, Royaume-Uni" },
      "ES": { name: "Madrid", country: "Espagne", latitude: 40.4168, longitude: -3.7038, displayName: "Madrid, Espagne" },
      "IT": { name: "Rome", country: "Italie", latitude: 41.9028, longitude: 12.4964, displayName: "Rome, Italie" },
      "NL": { name: "Amsterdam", country: "Pays-Bas", latitude: 52.3676, longitude: 4.9041, displayName: "Amsterdam, Pays-Bas" },
      "TR": { name: "Istanbul", country: "Turquie", latitude: 41.0082, longitude: 28.9784, displayName: "Istanbul, Turquie" },
      "EG": { name: "Cairo", country: "Égypte", latitude: 30.0444, longitude: 31.2357, displayName: "Cairo, Égypte" },
      "SA": { name: "Riyadh", country: "Arabie Saoudite", latitude: 24.7136, longitude: 46.6753, displayName: "Riyadh, Arabie Saoudite" },
      "AE": { name: "Dubai", country: "Émirats Arabes Unis", latitude: 25.2048, longitude: 55.2708, displayName: "Dubai, Émirats Arabes Unis" },
      "US": { name: "New York", country: "États-Unis", latitude: 40.7128, longitude: -74.0060, displayName: "New York, États-Unis" },
    };

    return defaultCities[country.code] || DEFAULT_CITY;
  };

  // Sauvegarder automatiquement quand les préférences changent
  useEffect(() => {
    if (!loading) {
      savePreferences();
    }
  }, [preferences, user, loading]);

  const value: LocationContextType = {
    preferences,
    countries: COUNTRIES,
    loading,
    setCountry,
    setCity,
    savePreferences,
    resetToDefaults
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
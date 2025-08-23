'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Interface pour les résultats de ville
interface CityResult {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

// Interface pour les props du composant
interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCitySelect: (city: CityResult) => void;
  countryFilter?: string;
  placeholder?: string;
  className?: string;
}

// Fonction pour rechercher les villes avec debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function CityAutocomplete({
  value,
  onChange,
  onCitySelect,
  countryFilter,
  placeholder = "Rechercher une ville...",
  className
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce la recherche pour éviter trop d'appels API
  const debouncedValue = useDebounce(value, 300);

  // Recherche des villes
  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setCities([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const url = `/api/cities/search?q=${encodeURIComponent(query)}${countryFilter ? `&country=${encodeURIComponent(countryFilter)}` : ''}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities || []);
        setIsOpen(data.cities && data.cities.length > 0);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, [countryFilter]);

  // Effectuer la recherche quand la valeur change
  useEffect(() => {
    searchCities(debouncedValue);
  }, [debouncedValue, searchCities]);

  // Gestion des touches clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < cities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && cities[selectedIndex]) {
          handleCitySelect(cities[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Sélectionner une ville
  const handleCitySelect = (city: CityResult) => {
    onChange(city.name);
    onCitySelect(city);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 dark:text-blue-400" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (cities.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={cn(
            "pl-12 pr-10 h-12 text-base bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700", 
            "border-2 border-blue-200 dark:border-gray-600 rounded-xl",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800",
            "hover:border-blue-300 transition-all duration-200",
            "text-blue-700 dark:text-blue-200",
            "placeholder:text-gray-500 dark:placeholder:text-gray-400",
            "shadow-lg hover:shadow-xl",
            className
          )}
        />
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          </div>
        )}
      </div>

      {/* Dropdown des suggestions */}
      {isOpen && cities.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {cities.map((city, index) => (
                <button
                  key={`${city.name}-${city.country}-${index}`}
                  onClick={() => handleCitySelect(city)}
                  className={cn(
                    "w-full px-5 py-4 text-left transition-all duration-200 flex items-center gap-4 group",
                    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20",
                    "first:rounded-t-xl last:rounded-b-xl",
                    selectedIndex === index && "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30"
                  )}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white group-hover:bg-blue-600 transition-colors">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate text-base group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      {city.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      🌍 {city.state ? `${city.state}, ` : ''}{city.country}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-blue-500 text-sm">→</div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucun résultat */}
      {isOpen && !loading && cities.length === 0 && value.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <p className="font-medium">Aucune ville trouvée</p>
                <p className="text-sm">pour "{value}"</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Essayez d'ajuster votre recherche
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
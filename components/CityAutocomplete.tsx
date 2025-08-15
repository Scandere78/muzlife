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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          className={cn("pl-10", className)}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Dropdown des suggestions */}
      {isOpen && cities.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg border-0">
          <CardContent className="p-0">
            <div className="max-h-60 overflow-y-auto">
              {cities.map((city, index) => (
                <button
                  key={`${city.name}-${city.country}-${index}`}
                  onClick={() => handleCitySelect(city)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3",
                    selectedIndex === index && "bg-muted"
                  )}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{city.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {city.state ? `${city.state}, ` : ''}{city.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucun résultat */}
      {isOpen && !loading && cities.length === 0 && value.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
          <CardContent className="p-4 text-center text-muted-foreground">
            Aucune ville trouvée pour "{value}"
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
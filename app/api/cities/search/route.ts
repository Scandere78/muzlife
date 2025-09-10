import { NextRequest, NextResponse } from 'next/server';

// Interface pour les résultats de recherche de villes
interface CityResult {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

// Fonction pour rechercher les villes françaises via l'API Adresse (Gouvernement français)
async function searchFrenchCities(query: string): Promise<CityResult[]> {
  try {
    // Utilisation de l'API Adresse du gouvernement français pour une autocomplétion optimale
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&autocomplete=1&limit=8`,
      {
        headers: {
          'User-Agent': 'MuzLife-PrayerTimes/1.0'
        },
        next: { revalidate: 1800 } // Cache 30 minutes
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche de villes françaises');
    }

    const data = await response.json();

    // Formater les résultats de l'API Adresse française
    const cities: CityResult[] = data.features
      ?.filter((feature: { properties: { type: string } }) => feature.properties.type === 'municipality')
      .map((feature: { properties: any; geometry: { coordinates: number[] } }) => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;
        
        return {
          name: props.city || props.name,
          country: 'France',
          state: props.context?.split(',')[0] || props.department || undefined, // Département
          latitude: coords[1], // Latitude
          longitude: coords[0], // Longitude
          displayName: props.context 
            ? `${props.city || props.name}, ${props.context}`
            : `${props.city || props.name}, France`
        };
      }) || [];

    return cities;
  } catch (error) {
    console.error('Erreur lors de la recherche de villes françaises:', error);
    return [];
  }
}

// Fonction fallback pour rechercher les villes via l'API Nominatim (OpenStreetMap)
async function searchCitiesNominatim(query: string, countryFilter?: string): Promise<CityResult[]> {
  try {
    // Construire la requête avec filtre pays si spécifié
    const searchQuery = countryFilter ? `${query}, ${countryFilter}` : query;
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=10&featuretype=city`,
      {
        headers: {
          'User-Agent': 'MuzLife-PrayerTimes/1.0'
        },
        next: { revalidate: 3600 } // Cache 1 heure
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche de villes');
    }

    const data = await response.json();

    // Filtrer et formater les résultats
    const cities: CityResult[] = data
      .filter((item: { type: string }) => item.type === 'city' || item.type === 'administrative')
      .map((item: { address?: any; display_name: string; lat: string; lon: string }) => {
        const address = item.address || {};
        const cityName = address.city || address.town || address.village || item.display_name.split(',')[0];
        const country = address.country || 'Inconnu';
        const state = address.state || address.province;
        
        return {
          name: cityName,
          country,
          state,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          displayName: state 
            ? `${cityName}, ${state}, ${country}`
            : `${cityName}, ${country}`
        };
      })
      .filter((city: CityResult, index: number, self: CityResult[]) => 
        // Éliminer les doublons basés sur le nom et le pays
        index === self.findIndex(c => c.name === city.name && c.country === city.country)
      )
      .slice(0, 8); // Limiter à 8 résultats

    return cities;
  } catch (error) {
    console.error('Erreur lors de la recherche de villes (Nominatim):', error);
    return [];
  }
}

// Fonction principale pour rechercher les villes avec stratégie France first
async function searchCities(query: string, countryFilter?: string): Promise<CityResult[]> {
  // Si on filtre par France ou pas de filtre de pays, utiliser l'API française en premier
  if (!countryFilter || countryFilter.toLowerCase().includes('france') || countryFilter.toLowerCase().includes('fr')) {
    try {
      const frenchCities = await searchFrenchCities(query);
      if (frenchCities.length > 0) {
        return frenchCities;
      }
    } catch (error) {
      console.warn('API Adresse française indisponible, fallback vers Nominatim', error);
    }
  }
  
  // Fallback vers Nominatim pour autres pays ou si API française échoue
  return await searchCitiesNominatim(query, countryFilter);
}

// Route GET pour rechercher les villes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const countryFilter = searchParams.get('country');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ cities: [] });
    }
    
    const cities = await searchCities(query, countryFilter || undefined);
    
    return NextResponse.json({ 
      cities,
      source: cities.length > 0 && cities[0].country === 'France' ? 'api-adresse' : 'nominatim'
    });
  } catch (error) {
    console.error('Erreur API recherche de villes:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la recherche de villes' },
      { status: 500 }
    );
  }
} 
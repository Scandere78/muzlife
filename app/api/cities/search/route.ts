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

// Fonction pour rechercher les villes via l'API de géocodage
async function searchCities(query: string, countryFilter?: string): Promise<CityResult[]> {
  try {
    // Construire la requête avec le filtre pays si fourni
    let searchQuery = query;
    if (countryFilter) {
      searchQuery = `${query}, ${countryFilter}`;
    }
    
    // Utilisation de l'API Nominatim (OpenStreetMap) pour la recherche de villes
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=15&featuretype=city`,
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
      .filter((item: any) => {
        // Accepter différents types de lieux
        const validTypes = ['city', 'town', 'village', 'municipality', 'administrative'];
        return validTypes.includes(item.type) || validTypes.includes(item.category);
      })
      .map((item: any) => {
        const address = item.address || {};
        const cityName = address.city || address.town || address.village || address.municipality || item.display_name.split(',')[0];
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
      .filter((city: CityResult) => {
        // Filtrer par pays si spécifié
        if (countryFilter && city.country.toLowerCase() !== countryFilter.toLowerCase()) {
          return false;
        }
        return true;
      })
      .filter((city: CityResult, index: number, self: CityResult[]) => 
        // Éliminer les doublons basés sur le nom et le pays
        index === self.findIndex(c => c.name === city.name && c.country === city.country)
      )
      .slice(0, 8); // Limiter à 8 résultats

    return cities;
  } catch (error) {
    console.error('Erreur lors de la recherche de villes:', error);
    return [];
  }
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
    
    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Erreur API recherche de villes:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la recherche de villes' },
      { status: 500 }
    );
  }
} 
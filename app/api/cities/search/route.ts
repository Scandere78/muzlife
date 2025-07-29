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
async function searchCities(query: string): Promise<CityResult[]> {
  try {
    // Utilisation de l'API Nominatim (OpenStreetMap) pour la recherche de villes
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=10&featuretype=city`,
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
      .filter((item: any) => item.type === 'city' || item.type === 'administrative')
      .map((item: any) => {
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
    console.error('Erreur lors de la recherche de villes:', error);
    return [];
  }
}

// Route GET pour rechercher les villes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ cities: [] });
    }
    
    const cities = await searchCities(query);
    
    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Erreur API recherche de villes:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la recherche de villes' },
      { status: 500 }
    );
  }
} 
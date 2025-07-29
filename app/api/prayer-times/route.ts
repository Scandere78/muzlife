import { NextRequest, NextResponse } from 'next/server';

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

interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTimes;
    date: {
      readable: string;
      timestamp: string;
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
        month: {
          number: number;
          en: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
      };
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
        month: {
          number: number;
          en: string;
          ar: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
        holidays: any;
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: {
          Fajr: number;
          Isha: number;
        };
        location: {
          latitude: number;
          longitude: number;
        };
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: any;
    };
  };
}

// Fonction pour récupérer les horaires de prière
async function getPrayerTimes(city: string, country: string = 'France'): Promise<PrayerTimesResponse | null> {
  try {
    // D'abord, on récupère les coordonnées de la ville
    const geocodeUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`;
    
    const response = await fetch(geocodeUrl, {
      next: { revalidate: 3600 } // Cache 1 heure
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des horaires');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires:', error);
    return null;
  }
}

// Route GET pour récupérer les horaires de prière
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const country = searchParams.get('country') || 'France';
    
    if (!city) {
      return NextResponse.json(
        { message: 'Ville requise' },
        { status: 400 }
      );
    }
    
    const prayerTimes = await getPrayerTimes(city, country);
    
    if (!prayerTimes) {
      return NextResponse.json(
        { message: 'Impossible de récupérer les horaires pour cette ville' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(prayerTimes);
  } catch (error) {
    console.error('Erreur API horaires de prière:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 
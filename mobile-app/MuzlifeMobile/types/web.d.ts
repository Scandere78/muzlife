// Types pour les APIs web natives
declare global {
  interface Navigator {
    geolocation: Geolocation;
  }

  interface Geolocation {
    getCurrentPosition(
      successCallback: (position: GeolocationPosition) => void,
      errorCallback?: (error: GeolocationPositionError) => void,
      options?: GeolocationOptions
    ): void;
  }

  interface GeolocationPosition {
    coords: GeolocationCoordinates;
    timestamp: number;
  }

  interface GeolocationCoordinates {
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    latitude: number;
    longitude: number;
    speed: number | null;
  }

  interface GeolocationPositionError {
    code: number;
    message: string;
    PERMISSION_DENIED: number;
    POSITION_UNAVAILABLE: number;
    TIMEOUT: number;
  }

  interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  }
}

export {};
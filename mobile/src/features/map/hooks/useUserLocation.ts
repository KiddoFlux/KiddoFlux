import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import type { LatLng } from '../types';

export type UserLocation = {
  isGranted: boolean;
  /** Null until a position is known, or when location is denied. */
  coordinate: LatLng | null;
  /** For example "Sibiu". Null until it's looked up. */
  city: string | null;
};

const INITIAL: UserLocation = {
  isGranted: false,
  coordinate: null,
  city: null,
};

/**
 * Asks for location when the screen opens, then finds the user and their city.
 * If it's denied, the map still works and stays around the school.
 */
export function useUserLocation(): UserLocation {
  const [location, setLocation] = useState(INITIAL);

  useEffect(() => {
    let isActive = true;

    const locate = async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!isActive || !granted) return;
      setLocation((current) => ({ ...current, isGranted: true }));

      // The last known position is instant; a fresh one can take a few seconds.
      const position =
        (await Location.getLastKnownPositionAsync()) ??
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }));
      if (!isActive) return;

      const coordinate = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setLocation((current) => ({ ...current, coordinate }));

      const [place] = await Location.reverseGeocodeAsync(coordinate);
      if (!isActive) return;
      setLocation((current) => ({
        ...current,
        city: place?.city ?? place?.subregion ?? null,
      }));
    };

    locate().catch(() => {
      // Keeps whatever was found before the failure.
    });

    return () => {
      isActive = false;
    };
  }, []);

  return location;
}

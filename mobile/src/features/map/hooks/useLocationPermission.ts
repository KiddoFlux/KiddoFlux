import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

/**
 * Asks for location when the screen opens. If it's denied, the map still works
 * and simply stays around the school.
 */
export function useLocationPermission(): boolean {
  const [isGranted, setIsGranted] = useState(false);

  useEffect(() => {
    let isActive = true;

    Location.requestForegroundPermissionsAsync()
      .then(({ granted }) => {
        if (isActive) setIsGranted(granted);
      })
      .catch(() => {
        if (isActive) setIsGranted(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return isGranted;
}

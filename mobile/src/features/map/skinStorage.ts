import AsyncStorage from '@react-native-async-storage/async-storage';

import type { MapSkin } from './types';

const MAP_SKIN_KEY = '@kiddoflux:map_skin';
export const DEFAULT_MAP_SKIN: MapSkin = 'mint';

const VALID_SKINS: readonly MapSkin[] = ['mint', 'clean', 'warm', 'standard'];

function isMapSkin(value: unknown): value is MapSkin {
  return typeof value === 'string' && VALID_SKINS.includes(value as MapSkin);
}

/** Loads the persisted skin chosen by the user, or default 'mint'. */
export async function loadSavedMapSkin(): Promise<MapSkin> {
  try {
    const saved = await AsyncStorage.getItem(MAP_SKIN_KEY);
    if (saved && isMapSkin(saved)) {
      return saved;
    }
  } catch {
    // If storage read fails, fallback safely
  }
  return DEFAULT_MAP_SKIN;
}

/** Persists the chosen skin to AsyncStorage across app launches. */
export async function saveMapSkin(skin: MapSkin): Promise<void> {
  try {
    await AsyncStorage.setItem(MAP_SKIN_KEY, skin);
  } catch {
    // Ignore storage write errors
  }
}

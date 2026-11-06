import { router, useNavigation } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';

import { MapScreen } from './MapScreen';
import {
  MOCK_MAP_SCENARIO,
  getMockMapData,
  mockMyChildrenIds,
  mockSchool,
} from './mockData';
import type { MapRide } from './types';

// TODO: connect these once the screens and the Firebase backend exist.
const noop = () => {};

function callDriver(ride: MapRide) {
  Linking.openURL(`tel:${ride.driver.phone}`).catch(() => {
    Alert.alert('Nu am putut iniția apelul', 'Încearcă din nou.');
  });
}

/** Supplies the map's data and actions. MapScreen only draws them. */
export function MapPage() {
  const navigation = useNavigation();
  const [data] = useState(() => getMockMapData(MOCK_MAP_SCENARIO, Date.now()));

  // TabBar hides itself when a screen sets display: 'none'.
  const handleLiveModeChange = useCallback(
    (isLive: boolean) => {
      navigation.setOptions({
        tabBarStyle: isLive ? { display: 'none' } : undefined,
      });
    },
    [navigation],
  );

  return (
    <MapScreen
      rides={data.rides}
      school={mockSchool}
      myChildrenIds={mockMyChildrenIds}
      liveRoutes={data.liveRoutes}
      liveStartProgress={data.liveStartProgress}
      onCallDriver={callDriver}
      onMessageDriver={noop}
      onConfirmArrival={noop}
      onPlanRides={() => router.push('/planifica')}
      onSearch={noop}
      onOpenFilters={noop}
      onLiveModeChange={handleLiveModeChange}
    />
  );
}

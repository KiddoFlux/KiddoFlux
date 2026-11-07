import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking } from 'react-native';

import { MapScreen } from './MapScreen';
import {
  DEFAULT_CENTER,
  getMockRides,
  mockMyChildrenIds,
  mockParents,
  mockSchool,
} from './mockData';
import type { CarpoolParent } from './types';

function callDriver(driver: CarpoolParent) {
  Linking.openURL(`tel:${driver.phone}`).catch(() => {
    Alert.alert('Nu am putut iniția apelul', 'Încearcă din nou.');
  });
}

/** Supplies the map's data and actions. MapScreen only draws them. */
export function MapPage() {
  // TODO: load the group's weekly schedule from Firebase once the backend exists.
  const [rides] = useState(getMockRides);

  return (
    <MapScreen
      rides={rides}
      parents={mockParents}
      school={mockSchool}
      defaultCenter={DEFAULT_CENTER}
      myChildrenIds={mockMyChildrenIds}
      onCallDriver={callDriver}
      onPlanRides={() => router.push('/planifica')}
    />
  );
}

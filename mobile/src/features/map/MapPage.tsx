import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';

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
  const { profil } = useAuth();
  const [rides] = useState(getMockRides);

  const myChildrenIds = useMemo(() => {
    if (!profil) return mockMyChildrenIds;
    return [`copil-${profil.id}`];
  }, [profil]);

  return (
    <MapScreen
      rides={rides}
      parents={mockParents}
      school={mockSchool}
      defaultCenter={DEFAULT_CENTER}
      myChildrenIds={myChildrenIds}
      onCallDriver={callDriver}
      onPlanRides={() => router.push('/planifica')}
    />
  );
}

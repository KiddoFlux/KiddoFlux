import { router } from 'expo-router';
import { useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';

import { AlertMessageSheet } from './components/AlertMessageSheet';
import { ScanCodeSheet } from './components/ScanCodeSheet';
import { HomeScreen } from './HomeScreen';
import { mockHasUnreadNotifications, mockNextRide } from './mockData';
import type { CurrentUser } from './types';

// TODO: connect these once the screens and the Firebase backend exist.
const noop = () => {};

// TODO: pick the greeting from the time of day.
const GREETING = 'Bună dimineața,';

/** Supplies the Home page's data and actions. HomeScreen only draws them. */
export function HomePage() {
  const { profil } = useAuth();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);

  // Briefly null while signing out, until the app switches to the login screen.
  if (!profil) return null;

  const user: CurrentUser = {
    id: profil.id,
    name: profil.prenume,
    initial: profil.prenume.charAt(0).toUpperCase(),
    greeting: GREETING,
  };

  return (
    <>
      <HomeScreen
        user={user}
        nextRide={mockNextRide}
        hasUnreadNotifications={mockHasUnreadNotifications}
        onOpenProfile={() => router.push('/profil')}
        onOpenNotifications={noop}
        // The next ride lives in the Calendar tab, so the card opens it.
        onOpenNextRide={() => router.navigate('/calendar')}
        onOpenSchedule={() => router.navigate('/calendar')}
        onOpenMap={() => router.navigate('/harta')}
        onScanCode={() => setIsScanOpen(true)}
        onReportAlert={() => setIsAlertOpen(true)}
        onPlanRides={() => router.push('/planifica')}
      />
      {isScanOpen ? (
        <ScanCodeSheet onClose={() => setIsScanOpen(false)} />
      ) : null}
      {isAlertOpen ? (
        <AlertMessageSheet onClose={() => setIsAlertOpen(false)} />
      ) : null}
    </>
  );
}

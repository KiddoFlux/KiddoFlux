import { router } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';

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

  // Briefly null while signing out, until the app switches to the login screen.
  if (!profil) return null;

  const user: CurrentUser = {
    id: profil.id,
    name: profil.prenume,
    initial: profil.prenume.charAt(0).toUpperCase(),
    greeting: GREETING,
  };

  return (
    <HomeScreen
      user={user}
      nextRide={mockNextRide}
      hasUnreadNotifications={mockHasUnreadNotifications}
      onOpenProfile={() => router.push('/profil')}
      onOpenNotifications={noop}
      onOpenNextRide={noop}
      onOpenSchedule={() => router.navigate('/calendar')}
      onOpenMap={noop}
      onScanCode={noop}
      onReportAlert={noop}
      onPlanRides={() => router.push('/planifica')}
    />
  );
}

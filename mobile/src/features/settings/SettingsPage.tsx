import { router } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';

import { mockNotificationsEnabled } from './mockData';
import { SettingsScreen } from './SettingsScreen';
import type { SettingsUser } from './types';

// TODO: replace each of these with its real action once the screen/backend exists.
const noop = () => {};

/** Supplies the Settings data and actions. SettingsScreen only draws them. */
export function SettingsPage() {
  const { profil, deconecteaza } = useAuth();

  // Briefly null while signing out, until the app switches to the login screen.
  if (!profil) return null;

  const user: SettingsUser = {
    name: profil.numeComplet,
    email: profil.email,
    initial: profil.prenume.charAt(0).toUpperCase(),
    avatarUrl: null,
  };

  return (
    <SettingsScreen
      user={user}
      notificationsEnabled={mockNotificationsEnabled}
      onOpenProfile={() => router.push('/profil')}
      // TODO: request the OS notification permission (expo-notifications) and
      // save the choice to the user's account. For now it only flips the switch.
      onToggleNotifications={noop}
      onOpenAbout={() => router.push('/despre')}
      // TODO: open the Terms screen once it exists.
      onOpenTerms={noop}
      // TODO: delete the account on the backend, then sign out.
      onDeleteAccount={noop}
      // The app returns to the login screen by itself once the session ends.
      onLogout={() => {
        void deconecteaza();
      }}
    />
  );
}

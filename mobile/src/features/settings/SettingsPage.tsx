import { router } from 'expo-router';

import { mockNotificationsEnabled, mockSettingsUser } from './mockData';
import { SettingsScreen } from './SettingsScreen';

// TODO: replace each of these with its real action once the screen/backend exists.
const noop = () => {};

/** Supplies the Settings data and actions. SettingsScreen only draws them. */
export function SettingsPage() {
  return (
    <SettingsScreen
      user={mockSettingsUser}
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
      // TODO: sign out with Firebase Auth and go back to the login screen.
      onLogout={noop}
    />
  );
}

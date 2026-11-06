import { router } from 'expo-router';

import { mockProfile } from './mockData';
import { ProfileScreen } from './ProfileScreen';

/** Supplies the Profile data and actions. ProfileScreen only draws them. */
export function ProfilePage() {
  return (
    <ProfileScreen
      // TODO: load the real profile (GraphQL) instead of mock data.
      profile={mockProfile}
      // Opened from a deep link there may be nothing to go back to.
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace('/setari')
      }
    />
  );
}

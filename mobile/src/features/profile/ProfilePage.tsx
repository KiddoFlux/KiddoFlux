import { router } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';

import { toProfileData } from './fromProfil';
import { ProfileScreen } from './ProfileScreen';

/** Supplies the Profile data and actions. ProfileScreen only draws them. */
export function ProfilePage() {
  const { profil } = useAuth();

  // Briefly null while signing out, until the app switches to the login screen.
  if (!profil) return null;

  return (
    <ProfileScreen
      profile={toProfileData(profil)}
      // Opened from a deep link there may be nothing to go back to.
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace('/setari')
      }
    />
  );
}

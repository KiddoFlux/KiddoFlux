import { router } from 'expo-router';
import { useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { extrageCopiiProfil } from '@/utils/scaunAuto';

import { HeightDeclarationModal } from './components/HeightDeclarationModal';
import { toProfileData } from './fromProfil';
import { ProfileScreen } from './ProfileScreen';

/** Supplies the Profile data and actions. ProfileScreen only draws them. */
export function ProfilePage() {
  const { profil, salveazaInaltimeCopii } = useAuth();
  const [modalInaltimeDeschis, setModalInaltimeDeschis] = useState(false);

  // Briefly null while signing out, until the app switches to the login screen.
  if (!profil) return null;

  const copii = extrageCopiiProfil(profil);

  return (
    <>
      <ProfileScreen
        profile={toProfileData(profil)}
        onEditHeight={() => setModalInaltimeDeschis(true)}
        // Opened from a deep link there may be nothing to go back to.
        onBack={() =>
          router.canGoBack() ? router.back() : router.replace('/setari')
        }
      />

      <HeightDeclarationModal
        visible={modalInaltimeDeschis}
        isBlocking={false}
        motiv="manual"
        copii={copii}
        onSave={async (actualizati) => {
          await salveazaInaltimeCopii(actualizati);
          setModalInaltimeDeschis(false);
        }}
        onClose={() => setModalInaltimeDeschis(false)}
      />
    </>
  );
}

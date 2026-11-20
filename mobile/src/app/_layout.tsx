import '../../global.css';

import {
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_700Bold,
  useFonts,
} from '@expo-google-fonts/inter-tight';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import LoadingScreen from '@/features/loading/LoadingScreen';
import { HeightDeclarationModal } from '@/features/profile/components/HeightDeclarationModal';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { colors } from '@/theme/colors';
import type { Copil } from '@/types/profil';
import {
  extrageCopiiProfil,
  verificaNecesitateDeclarareInaltime,
} from '@/utils/scaunAuto';

SplashScreen.preventAutoHideAsync();

/** Logged-out users only see the login screen; everything else needs a signed-in parent. */
function AppNavigator() {
  const { stare, profil, salveazaInaltimeCopii, confirmaInaltimeNeschimbata } =
    useAuth();
  const [mesajSucces, setMesajSucces] = useState<string | null>(null);

  // Checking the saved session takes a moment; show the background, not a flash of login.
  if (stare === 'se-incarca') {
    return <View className="flex-1 bg-mint" />;
  }

  const isSignedIn = stare === 'conectat';
  const statusDeclarare = verificaNecesitateDeclarareInaltime(profil);
  const copii = extrageCopiiProfil(profil);

  const handleSaveInaltime = async (copiiActualizati: Copil[]) => {
    await salveazaInaltimeCopii(copiiActualizati);
    setMesajSucces('Înălțimea și categoria de scaun auto au fost actualizate.');
  };

  const handleConfirmUnchanged = async () => {
    await confirmaInaltimeNeschimbata();
    setMesajSucces('Confirmarea lunară a fost înregistrată cu succes.');
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.mint },
        }}
      >
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="planifica"
            options={{ animation: 'fade_from_bottom', animationDuration: 260 }}
          />
          <Stack.Screen
            name="profil"
            options={{ animation: 'slide_from_right', animationDuration: 280 }}
          />
          <Stack.Screen
            name="despre"
            options={{ animation: 'slide_from_right', animationDuration: 280 }}
          />
        </Stack.Protected>

        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen
            name="login"
            options={{ animation: 'fade', animationDuration: 250 }}
          />
        </Stack.Protected>
      </Stack>

      {isSignedIn &&
        statusDeclarare.necesita &&
        statusDeclarare.motiv &&
        copii.length > 0 && (
          <HeightDeclarationModal
            visible
            isBlocking
            motiv={statusDeclarare.motiv}
            copii={copii}
            onSave={handleSaveInaltime}
            onConfirmUnchanged={handleConfirmUnchanged}
          />
        )}

      {mesajSucces && (
        <SuccessModal
          visible
          title="Modificările au fost salvate cu succes!"
          message={mesajSucces}
          onClose={() => setMesajSucces(null)}
        />
      )}
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_700Bold,
  });
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!loadingDone) {
    return (
      <>
        <LoadingScreen onFinished={() => setLoadingDone(true)} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="dark" />
    </AuthProvider>
  );
}

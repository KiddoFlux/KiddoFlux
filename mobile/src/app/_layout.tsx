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

import LoadingScreen from '@/features/loading/LoadingScreen';
import { colors } from '@/theme/colors';

SplashScreen.preventAutoHideAsync();

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
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.mint },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="planifica" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

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
import { colors } from '@/theme/colors';

SplashScreen.preventAutoHideAsync();

/** Logged-out users only see the login screen; everything else needs a signed-in parent. */
function AppNavigator() {
  const { stare } = useAuth();

  // Checking the saved session takes a moment; show the background, not a flash of login.
  if (stare === 'se-incarca') {
    return <View className="flex-1 bg-mint" />;
  }

  const isSignedIn = stare === 'conectat';

  return (
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

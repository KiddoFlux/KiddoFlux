import './global.css';

import {
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_700Bold,
  useFonts,
} from '@expo-google-fonts/inter-tight';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoadingScreen from './src/features/loading/LoadingScreen';
import HomeScreen from './src/screens/HomeScreen';

// Keep the native splash up until the fonts are ready.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  const [loadingDone, setLoadingDone] = useState(false);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      {loadingDone ? (
        // The real app: whatever the team wires in here (HomeScreen, navigation, ...).
        <HomeScreen />
      ) : (
        <LoadingScreen onFinished={() => setLoadingDone(true)} />
      )}
      <StatusBar style={loadingDone ? 'auto' : 'light'} />
    </SafeAreaProvider>
  );
}

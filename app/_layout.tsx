import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '../src/db';
import migrations from '../drizzle/migrations';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (loaded && (success || error)) {
      if (error) {
        console.error('Migration error:', error);
      }
      SplashScreen.hideAsync();
    }
  }, [loaded, success, error]);

  if (!loaded || (!success && !error)) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
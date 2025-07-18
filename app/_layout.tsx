import { useEffect, useState } from 'react';
import { Platform, View, Image } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Rye_400Regular } from '@expo-google-fonts/rye';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [showSplash, setShowSplash] = useState(true);
  
  const [fontsLoaded, fontError] = useFonts({
    'Rye': Rye_400Regular,
  });
  
  useEffect(() => {
    async function prepare() {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await SplashScreen.preventAutoHideAsync();
      }
    }
    prepare();
  }, []);
  
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      
      setTimeout(() => {
        setShowSplash(false);
      }, 1500);
    }
  }, [fontsLoaded, fontError]);
  
  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  if (showSplash) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image
          source={{ uri: 'https://di1v4rx98wr59.cloudfront.net/5dc138fcf6a66/84612f51ef743ff59aa2f71c74b7f2c3448dc010.png' }}
          style={{ width: 240, height: 72, resizeMode: 'contain' }}
        />
      </View>
    );
  }
  
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="landing" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="puzzle/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
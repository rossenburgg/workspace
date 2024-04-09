import React, { Suspense, lazy, useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingFallback from '../components/LoadingFallback';

const ModalScreen = lazy(() => import('./modal'));
const SettingsModalScreen = lazy(() => import('./settingsModal'));
const NotificationsScreen = lazy(() => import('./NotificationsScreen'));
const SigninScreen = lazy(() => import('./SigninScreen'));
const SignupScreen = lazy(() => import('./SignupScreen'));
const SearchScreen = lazy(() => import('./SearchScreen'));
const ProfileEditScreen = lazy(() => import('./ProfileEditScreen'));

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'FontAwesome': require('@expo/vector-icons/FontAwesome').font,
  });

  useEffect(() => {
    if (!loaded) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider value={useColorScheme() === 'dark' ? DarkTheme : DefaultTheme}>
          <NavigationContainer>
            <Suspense fallback={<LoadingFallback />}>
              <Stack.Navigator>
                <Stack.Screen name="modal" component={ModalScreen} options={{ presentation: 'modal' }} />
                <Stack.Screen name="settingsModal" component={SettingsModalScreen} options={{ presentation: 'modal' }} />
                <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} options={{ presentation: 'card', headerBackTitle: 'Notifications', headerTitle: '', }} />
                <Stack.Screen name="SigninScreen" component={SigninScreen} options={{ title: 'Sign In', headerShown: false }} />
                <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ title: 'Sign Up', headerShown: false }} />
                <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: 'Search' }} />
                <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} options={{ title: 'Edit Profile' }} />
              </Stack.Navigator>
            </Suspense>
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
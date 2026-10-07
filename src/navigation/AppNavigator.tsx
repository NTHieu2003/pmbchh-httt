import React from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
  type NavigatorScreenParams,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { setCurrentFeatureUrl } from '@/api';
import { LoginScreen } from '@/screens/auth';
import { useAuthStore } from '@/stores';

import { MainDrawerNavigator, type MainDrawerParamList } from './navigator';
import { APP_ROUTES, FEATURE_URL_BY_ROUTE } from './routes';

export type RootStackParamList = {
  [APP_ROUTES.LOGIN_SCREEN]: undefined;
  [APP_ROUTES.MAIN_DRAWER]: NavigatorScreenParams<MainDrawerParamList> | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const PublicRoutes = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={APP_ROUTES.LOGIN_SCREEN} component={LoginScreen} />
  </Stack.Navigator>
);

const ProtectedRoutes = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={APP_ROUTES.MAIN_DRAWER} component={MainDrawerNavigator} />
  </Stack.Navigator>
);

const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Keeps the API layer's `X-Feature-Url` in step with the focused screen.
const syncFeatureUrl = () => {
  const routeName = navigationRef.getCurrentRoute()?.name;
  setCurrentFeatureUrl((routeName && FEATURE_URL_BY_ROUTE[routeName]) || null);
};

export const AppNavigator = () => {
  const { token, isBootstrapping } = useAuthStore();

  if (isBootstrapping) return null;

  return (
    <NavigationContainer ref={navigationRef} onReady={syncFeatureUrl} onStateChange={syncFeatureUrl}>
      {token ? <ProtectedRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  );
};

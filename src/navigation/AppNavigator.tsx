import React from 'react';
import { NavigationContainer, type NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '@/screens/auth';
import { useAuthStore } from '@/stores';

import { MainDrawerNavigator, type MainDrawerParamList } from './navigator';
import { APP_ROUTES } from './routes';

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

export const AppNavigator = () => {
  const { token, isBootstrapping } = useAuthStore();

  if (isBootstrapping) return null;

  return (
    <NavigationContainer>
      {token ? <ProtectedRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  );
};

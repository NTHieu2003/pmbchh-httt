import React from 'react';
import {
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import type { NavigatorScreenParams } from '@react-navigation/native';

import { MainDrawerContent } from '../drawer';
import { APP_ROUTES } from '../routes';
import { MainStackNavigator, type MainStackParamList } from './MainStackNavigator';

export type MainDrawerParamList = {
  [APP_ROUTES.MAIN_STACK]: NavigatorScreenParams<MainStackParamList> | undefined;
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

// Wraps the whole authenticated app (MainStackNavigator) with a hamburger
// -triggered slide-over menu — mirrors project A's MainDrawerNavigator
// (createDrawerNavigator + custom drawerContent). Add more
// `MainStack.Screen`s + `MENU_ITEMS` entries in `MainDrawerContent.tsx` as
// features are ported.
export const MainDrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerShown: false,
      drawerType: 'front',
      drawerStyle: { width: 360 },
    }}
    drawerContent={(props: DrawerContentComponentProps) => (
      <MainDrawerContent {...props} />
    )}
  >
    <Drawer.Screen name={APP_ROUTES.MAIN_STACK} component={MainStackNavigator} />
  </Drawer.Navigator>
);

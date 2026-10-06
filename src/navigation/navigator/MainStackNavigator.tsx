import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CbrnScenarioScreen } from '@/screens/cbrn-scenario';
import { CbrnSimulationScreen } from '@/screens/cbrn-simulation';
import { CbrnSimulationResultScreen } from '@/screens/cbrn-simulation-result';
import { ChatbotScreen } from '@/screens/chatbot';
import { ChatbotDomainsScreen } from '@/screens/chatbot-domains';
import { ChatbotGuideScreen } from '@/screens/chatbot-guide';
import { ChatbotHistoryScreen } from '@/screens/chatbot-history';
import { DashboardDataProgressScreen } from '@/screens/dashboard-data-progress';
import { DashboardUserStatsScreen } from '@/screens/dashboard-user-stats';
import { MeetingPlanScreen } from '@/screens/meeting-plan';
import { MeetingRoomScreen } from '@/screens/meeting-room';

import { APP_ROUTES } from '../routes';

export type MainStackParamList = {
  [APP_ROUTES.CHATBOT_SCREEN]: undefined;
  [APP_ROUTES.DASHBOARD_USER_STATS_SCREEN]: undefined;
  [APP_ROUTES.DASHBOARD_DATA_PROGRESS_SCREEN]: undefined;
  [APP_ROUTES.CBRN_SIMULATION_SCREEN]: undefined;
  [APP_ROUTES.CBRN_SIMULATION_RESULT_SCREEN]: undefined;
  [APP_ROUTES.CBRN_SCENARIO_SCREEN]: undefined;
  [APP_ROUTES.CHATBOT_DOMAINS_SCREEN]: undefined;
  [APP_ROUTES.CHATBOT_HISTORY_SCREEN]: undefined;
  [APP_ROUTES.CHATBOT_GUIDE_SCREEN]: undefined;
  [APP_ROUTES.MEETING_PLAN_SCREEN]: undefined;
  [APP_ROUTES.MEETING_ROOM_SCREEN]: { khp_gid: number };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

// Screens reachable from the drawer's menu live here as ordinary pushed
// stack screens — e.g. Chatbot pushes on top and gets a real back button
// (see ChatbotScreen's LeftSidebar `onBack`), while the drawer itself
// (hamburger menu) is a separate layer wrapping this whole stack — see
// MainDrawerNavigator. New drawer entries: register the screen here, then
// add it to `MENU_ITEMS` in `../drawer/MainDrawerContent.tsx`.
// Dashboard (user stats) is the first screen listed — native-stack uses
// the first <Stack.Screen> as its default initial route, i.e. the app's
// landing screen. There's no separate "Home" screen anymore.
export const MainStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name={APP_ROUTES.DASHBOARD_USER_STATS_SCREEN}
      component={DashboardUserStatsScreen}
    />
    <Stack.Screen name={APP_ROUTES.CHATBOT_SCREEN} component={ChatbotScreen} />
    <Stack.Screen
      name={APP_ROUTES.DASHBOARD_DATA_PROGRESS_SCREEN}
      component={DashboardDataProgressScreen}
    />
    <Stack.Screen
      name={APP_ROUTES.CBRN_SIMULATION_SCREEN}
      component={CbrnSimulationScreen}
    />
    <Stack.Screen
      name={APP_ROUTES.CBRN_SIMULATION_RESULT_SCREEN}
      component={CbrnSimulationResultScreen}
    />
    <Stack.Screen
      name={APP_ROUTES.CBRN_SCENARIO_SCREEN}
      component={CbrnScenarioScreen}
    />
    <Stack.Screen
      name={APP_ROUTES.CHATBOT_DOMAINS_SCREEN}
      component={ChatbotDomainsScreen}
    />
    <Stack.Screen
      name={APP_ROUTES.CHATBOT_HISTORY_SCREEN}
      component={ChatbotHistoryScreen}
    />
    <Stack.Screen
      name={APP_ROUTES.CHATBOT_GUIDE_SCREEN}
      component={ChatbotGuideScreen}
    />
    <Stack.Screen
      name={APP_ROUTES.MEETING_PLAN_SCREEN}
      component={MeetingPlanScreen}
    />
    <Stack.Screen
      name={APP_ROUTES.MEETING_ROOM_SCREEN}
      component={MeetingRoomScreen}
      // No swipe-back while in a live meeting — "Thoát" is the only exit
      // (it also tells the room's socket the user left); see
      // MeetingRoomScreen's own hardware-back block for Android's side.
      options={{ gestureEnabled: false }}
    />
  </Stack.Navigator>
);

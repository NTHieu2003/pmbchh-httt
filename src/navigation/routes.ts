// Route name constants — mirrors project A's `APP_ROUTES` convention
// (SCREAMING_SNAKE_CASE keys/values) so screen names never get typo'd as
// raw string literals scattered across navigators/components.
export const APP_ROUTES = {
  LOGIN_SCREEN: 'LOGIN_SCREEN',
  CHATBOT_SCREEN: 'CHATBOT_SCREEN',
  MAIN_STACK: 'MAIN_STACK',
  MAIN_DRAWER: 'MAIN_DRAWER',

  // Drawer menu entries — H.126-134 in the requirements table. Screens are
  // placeholders for now (`src/screens/placeholder/PlaceholderScreen.tsx`),
  // filled in feature-by-feature later.
  DASHBOARD_USER_STATS_SCREEN: 'DASHBOARD_USER_STATS_SCREEN',
  DASHBOARD_DATA_PROGRESS_SCREEN: 'DASHBOARD_DATA_PROGRESS_SCREEN',
  CBRN_SIMULATION_SCREEN: 'CBRN_SIMULATION_SCREEN',
  CBRN_SIMULATION_RESULT_SCREEN: 'CBRN_SIMULATION_RESULT_SCREEN',
  CBRN_SCENARIO_SCREEN: 'CBRN_SCENARIO_SCREEN',
  CHATBOT_DOMAINS_SCREEN: 'CHATBOT_DOMAINS_SCREEN',
  CHATBOT_HISTORY_SCREEN: 'CHATBOT_HISTORY_SCREEN',
  CHATBOT_GUIDE_SCREEN: 'CHATBOT_GUIDE_SCREEN',
  MEETING_PLAN_SCREEN: 'MEETING_PLAN_SCREEN',
  MEETING_ROOM_SCREEN: 'MEETING_ROOM_SCREEN',
} as const;

// Web path (`duongDan`) of the pmbc_web feature each screen ports — sent as
// the `X-Feature-Url` header so actions done in the app are counted under
// the same feature as on web (spec CN124). Screens without a web menu
// counterpart are left out: their requests carry no header.
export const FEATURE_URL_BY_ROUTE: Partial<Record<string, string>> = {
  [APP_ROUTES.DASHBOARD_USER_STATS_SCREEN]: '/system/dashboarduser',
  [APP_ROUTES.DASHBOARD_DATA_PROGRESS_SCREEN]: '/quanlykho/dashboard-vanbanphapquy',
  [APP_ROUTES.CBRN_SIMULATION_SCREEN]: '/thongtin/mophongphattan',
  [APP_ROUTES.CBRN_SIMULATION_RESULT_SCREEN]: '/thongtin/mophongphattan',
  [APP_ROUTES.CBRN_SCENARIO_SCREEN]: '/quanlykho/pmbckichbanungphocbrn',
  [APP_ROUTES.CHATBOT_DOMAINS_SCREEN]: '/quanlykho/pmbcquanlylinhvucchatbot',
  [APP_ROUTES.CHATBOT_HISTORY_SCREEN]: '/quanlykho/pmbcquanlylichsuchatbot',
  [APP_ROUTES.CHATBOT_GUIDE_SCREEN]: '/thongtin/pmbchdsdchatbot',
  [APP_ROUTES.MEETING_PLAN_SCREEN]: '/quanlykehoachtochuc/kehoachtochuchop',
};

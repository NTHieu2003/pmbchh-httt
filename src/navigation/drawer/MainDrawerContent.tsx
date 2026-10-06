import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  BarChart3,
  BookOpen,
  Database,
  HelpCircle,
  History,
  LogOut,
  MessageSquare,
  Radiation,
  ShieldAlert,
  Users,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '@/stores';
import { APP_COLORS } from '@/theme';

import { APP_ROUTES } from '../routes';
import { mainDrawerContentStyles as styles } from './MainDrawerContent.styles';

interface DrawerMenuItem {
  route: string;
  label: string;
  icon: typeof MessageSquare;
}

// Order matches the requirements table (H.126-134) top to bottom. Add new
// entries here as features are ported — each just needs a route registered
// on `MainStackNavigator` and an icon/label here.
const MENU_ITEMS: DrawerMenuItem[] = [
  {
    route: APP_ROUTES.DASHBOARD_USER_STATS_SCREEN,
    label: 'Dashboard người dùng',
    icon: BarChart3,
  },
  {
    route: APP_ROUTES.DASHBOARD_DATA_PROGRESS_SCREEN,
    label: 'Tiến độ dữ liệu',
    icon: Database,
  },
  {
    route: APP_ROUTES.CBRN_SIMULATION_SCREEN,
    label: 'Mô phỏng phát tán',
    icon: Radiation,
  },
  {
    route: APP_ROUTES.CBRN_SCENARIO_SCREEN,
    label: 'Kịch bản ứng phó CBRN',
    icon: ShieldAlert,
  },
  {
    route: APP_ROUTES.CHATBOT_DOMAINS_SCREEN,
    label: 'Lĩnh vực Chatbot',
    icon: BookOpen,
  },
  {
    route: APP_ROUTES.CHATBOT_HISTORY_SCREEN,
    label: 'Lịch sử tương tác Chatbot',
    icon: History,
  },
  {
    route: APP_ROUTES.CHATBOT_GUIDE_SCREEN,
    label: 'Hướng dẫn Chatbot',
    icon: HelpCircle,
  },
  { route: APP_ROUTES.CHATBOT_SCREEN, label: 'Chatbot', icon: MessageSquare },
  {
    route: APP_ROUTES.MEETING_PLAN_SCREEN,
    label: 'Họp không giấy',
    icon: Users,
  },
];

export const MainDrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation,
  state,
}) => {
  const { top } = useSafeAreaInsets();
  const logoSource = require('@/assets/images/logo-bchh-chat.png');
  const logout = useAuthStore((state) => state.logout);

  // The drawer's own state only ever has one route (MAIN_STACK) — drill
  // into the nested stack's currently-focused screen name to know which
  // menu item to highlight. Defaults to the stack's initial route (Dashboard
  // user stats) before the nested stack has navigated anywhere yet.
  const activeRouteName =
    getFocusedRouteNameFromRoute(state.routes[state.index]) ??
    APP_ROUTES.DASHBOARD_USER_STATS_SCREEN;

  const navigateTo = (route: string) => {
    navigation.closeDrawer();
    navigation.navigate(APP_ROUTES.MAIN_STACK, { screen: route });
  };

  // "Tạm thời" per request — no dedicated confirm-dialog design yet, so a
  // plain native Alert.alert confirm is used to avoid an accidental tap
  // signing the user out.
  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>HỆ THỐNG THÔNG TIN</Text>
      </View>

      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item) => {
          const isActive = item.route === activeRouteName;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigateTo(item.route)}
            >
              <item.icon size={18} color={APP_COLORS.chatBrandRed} />
              <Text
                style={[
                  styles.menuItemText,
                  isActive && styles.menuItemTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={16} color={APP_COLORS.danger} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.softwareInfo}>
        <Text style={styles.softwareInfoText}>
          Phần mềm báo cáo, điều hành của Bộ Tổng Tham mưu{'\n'}COPYRIGHT VĂN
          PHÒNG BỘ TỔNG THAM MƯU © 2024
        </Text>
        <Text style={styles.supportText}>
          Hỗ trợ: 0965.853.399 (Trần Văn An)
        </Text>
      </View>
    </View>
  );
};

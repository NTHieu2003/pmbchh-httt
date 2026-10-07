import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Info, LogIn, Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { APP_COLORS } from '@/theme';
import { APP_ROUTES } from '@/navigation/routes';
import { AppPopover, type AppPopoverAnchor, type AppPopoverItem } from '@/components/AppPopover';
import { HeaderUserMenu } from '@/components/HeaderUserMenu';

import type { MainStackParamList } from '@/navigation/navigator/MainStackNavigator';
import type { KhtochuchopItem } from '@/types';

import { meetingPlanScreenStyles as styles } from './MeetingPlanScreen.styles';
import MeetingPlanListItem from './MeetingPlanListItem';
import MeetingPlanInfoModal from './MeetingPlanInfoModal';
import { useMeetingPlan } from './useMeetingPlan.hook';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

// "Kế hoạch tổ chức họp" — danh sách kế hoạch họp, giống pmbc_web's
// "Thống kê công tác chuẩn bị" list: mỗi dòng mở kebab menu ("Tham gia
// cuộc họp" / "Xem thông tin") thay vì bấm thẳng vào hàng.
const MeetingPlanScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { items, isLoading, isRefreshing, isError, refetch, onPullToRefresh } = useMeetingPlan();

  const [popoverAnchor, setPopoverAnchor] = useState<AppPopoverAnchor | null>(null);
  const [popoverTarget, setPopoverTarget] = useState<KhtochuchopItem | null>(null);
  const [infoKhpGid, setInfoKhpGid] = useState<number | null>(null);

  const openPopover = (event: GestureResponderEvent, item: KhtochuchopItem) => {
    const { pageX, pageY } = event.nativeEvent;
    setPopoverAnchor({ x: pageX, y: pageY });
    setPopoverTarget(item);
  };

  const closePopover = () => {
    setPopoverAnchor(null);
    setPopoverTarget(null);
  };

  const openMeetingRoom = (item: KhtochuchopItem) => {
    navigation.navigate(APP_ROUTES.MEETING_ROOM_SCREEN, { khp_gid: item.khp_gid });
  };

  const popoverItems: AppPopoverItem[] = popoverTarget
    ? [
        {
          key: 'join',
          label: 'Tham gia cuộc họp',
          icon: LogIn,
          onPress: () => openMeetingRoom(popoverTarget),
        },
        {
          key: 'info',
          label: 'Xem thông tin',
          icon: Info,
          onPress: () => setInfoKhpGid(popoverTarget.khp_gid),
        },
      ]
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Menu size={22} color={APP_COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kế hoạch tổ chức họp</Text>
        <HeaderUserMenu />
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={APP_COLORS.chatBrandRed} />
          <Text style={styles.loadingText}>Đang tải danh sách kế hoạch...</Text>
        </View>
      ) : isError ? (
        <View style={styles.loadingBox}>
          <Text style={styles.errorText}>Không thể tải danh sách kế hoạch.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.khp_gid)}
          renderItem={({ item }) => (
            <MeetingPlanListItem item={item} onOpenMenu={openPopover} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onPullToRefresh}
              colors={[APP_COLORS.chatBrandRed]}
              tintColor={APP_COLORS.chatBrandRed}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Chưa có kế hoạch tổ chức họp nào.</Text>
            </View>
          }
        />
      )}

      <AppPopover
        visible={!!popoverTarget}
        anchor={popoverAnchor}
        items={popoverItems}
        onClose={closePopover}
      />

      <MeetingPlanInfoModal
        visible={infoKhpGid != null}
        khpGid={infoKhpGid}
        onClose={() => setInfoKhpGid(null)}
      />
    </SafeAreaView>
  );
};

export default MeetingPlanScreen;

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LogOut, User } from 'lucide-react-native';

import { appAlert } from '@/components/AppDialog';
import { useAuthStore } from '@/stores';
import { APP_COLORS } from '@/theme';
import type { UserDetail } from '@/types';

import { headerUserMenuStyles as styles } from './HeaderUserMenu.styles';

// Shared logout confirm — used by both this header block and the drawer's
// footer button so the two entry points always ask the same question.
export const useConfirmLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  return () =>
    appAlert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: () => logout() },
    ]);
};

// Top-right block of every drawer screen's header: the signed-in user's
// name (from `/user/detail`, cached in the auth store) + a logout button.
// `marginLeft: 'auto'` on the container pushes it to the right edge no
// matter what else the header row holds.
const HeaderUserMenu: React.FC = () => {
  const user = useAuthStore((s) => s.user) as UserDetail | null;
  const confirmLogout = useConfirmLogout();
  const displayName = user?.fullname || user?.username || 'Người dùng';

  return (
    <View style={styles.container}>
      <View style={styles.userChip}>
        <View style={styles.avatar}>
          <User size={16} color={APP_COLORS.white} />
        </View>
        <Text style={styles.userName} numberOfLines={1}>
          {displayName}
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <LogOut size={16} color={APP_COLORS.danger} />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderUserMenu;

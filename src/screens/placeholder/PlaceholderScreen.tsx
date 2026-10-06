import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_COLORS } from '@/theme';

import { placeholderScreenStyles as styles } from './PlaceholderScreen.styles';

export interface PlaceholderScreenProps {
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

// Shared shell for every not-yet-built drawer menu entry (see
// `src/navigation/routes.ts` + `MainDrawerContent.tsx`): header with the
// hamburger toggle (every screen except Chatbot, which has its own back
// button instead — see ChatbotScreen/LeftSidebar) and a centered
// title/icon. Each route gets its own thin wrapper file
// (`src/screens/<feature>/<Feature>Screen.tsx`) rendering this with its
// title/icon, ready to be filled in with real content feature-by-feature.
const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  title,
  icon: Icon,
}) => {
  const navigation = useNavigation();

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
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon size={32} color={APP_COLORS.chatBrandRed} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Chức năng đang được phát triển</Text>
      </View>
    </SafeAreaView>
  );
};

export default PlaceholderScreen;

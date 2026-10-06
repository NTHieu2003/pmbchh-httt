import React, { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Download,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Lock,
  Settings,
  User,
} from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_COLORS } from '@/theme';
import { useIsTablet } from '@/utils';

import { useLoginScreen } from './LoginScreen.hook';
import { createLoginStyles } from './LoginScreen.styles';

const LoginScreen: React.FC = () => {
  const { isTablet } = useIsTablet();
  const styles = createLoginStyles(isTablet);

  const [leftPanelSize, setLeftPanelSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleLeftPanelLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLeftPanelSize({ width, height });
  };

  const {
    usernameRef,
    passwordRef,
    username,
    setUsername,
    password,
    setPassword,
    isPasswordVisible,
    togglePasswordVisibility,
    isLoading,
    handleLogin,
  } = useLoginScreen();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={50}
        extraHeight={10}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.leftPanel} onLayout={handleLeftPanelLayout}>
            <Image
              source={require('@/assets/images/login-info-bg-placeholder.png')}
              style={[styles.leftPanelBackground, leftPanelSize]}
              resizeMode="cover"
            />
            <View style={styles.leftPanelTitleBlock}>
              <Text style={styles.leftPanelTitle}>HỆ THỐNG THÔNG TIN</Text>
              <Text style={styles.leftPanelSubtitle}>
                Hỗ trợ quản lý, báo cáo điều hành thông tin trong Binh chủng
                Hóa học
              </Text>
              <View style={styles.leftPanelTitleUnderline} />
            </View>

            <View style={styles.supportBlock}>
              <View style={styles.supportSection}>
                <View style={styles.supportRow}>
                  <Settings size={20} color={APP_COLORS.accent} />
                  <Text style={styles.supportHeading}>Hỗ trợ kỹ thuật</Text>
                </View>

                <View style={styles.supportRowIndented}>
                  <User size={14} color={APP_COLORS.accent} />
                  <Text style={styles.supportText}>
                    Ban CNTT/BTM (đ/c Nguyễn Mạnh Hưng – SĐT 0982.061.616)
                  </Text>
                </View>
                <View style={styles.supportRowIndented}>
                  <User size={14} color={APP_COLORS.accent} />
                  <Text style={styles.supportText}>
                    Viện CNTT & TT/HVKTQS (đ/c Trần Văn An – SĐT
                    0965.853.399)
                  </Text>
                </View>
              </View>

              <View style={styles.supportSection}>
                <View style={styles.supportRow}>
                  <FileText size={20} color={APP_COLORS.accent} />
                  <Text style={styles.supportHeading}>Tải về</Text>
                </View>

                <TouchableOpacity style={styles.supportRowIndented}>
                  <Download size={14} color={APP_COLORS.accent} />
                  <Text style={styles.supportText}>
                    Tài liệu hướng dẫn sử dụng
                  </Text>
                </TouchableOpacity>

                <View style={styles.chromeBadgeRow}>
                  <View style={styles.supportRow}>
                    <Globe size={14} color={APP_COLORS.accent} />
                    <Text style={styles.supportText}>Chrome</Text>
                  </View>
                  <View style={styles.chromeBadge}>
                    <Text style={styles.chromeBadgeText}>64-bit</Text>
                  </View>
                  <View style={styles.chromeBadge}>
                    <Text style={styles.chromeBadgeText}>32-bit</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.rightPanel}>
            <Image
              source={require('@/assets/images/logo-bchh.jpg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Đăng nhập hệ thống</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <User size={18} color={APP_COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  ref={usernameRef}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Tài khoản"
                  placeholderTextColor={APP_COLORS.textMuted}
                  style={styles.input}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Lock size={18} color={APP_COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  ref={passwordRef}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mật khẩu"
                  placeholderTextColor={APP_COLORS.textMuted}
                  secureTextEntry={!isPasswordVisible}
                  style={styles.input}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {isPasswordVisible ? (
                    <EyeOff size={18} color={APP_COLORS.textMuted} />
                  ) : (
                    <Eye size={18} color={APP_COLORS.textMuted} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Phần mềm báo cáo, điều hành của Bộ Tổng Tham mưu - COPYRIGHT VĂN
          PHÒNG BỘ TỔNG THAM MƯU © 2024
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

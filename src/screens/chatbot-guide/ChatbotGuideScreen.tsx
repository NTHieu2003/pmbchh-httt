import React from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { FileText, HelpCircle, Menu, Play, Search, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_COLORS } from '@/theme';

import { chatbotGuideScreenStyles as styles } from './ChatbotGuideScreen.styles';
import GuideFaqItem from './GuideFaqItem';
import GuideFileViewerModal from './GuideFileViewerModal';
import { useChatbotGuide } from './useChatbotGuide.hook';

// H.III.133 — "Tra cứu cách sử dụng Chatbot với các ngành đặc thù trong
// BCHH qua giao diện Mobile". Mobile-simplified version of pmbc_web's
// huong_dan_sd management screen: read-only FAQ (question/answer text,
// search) plus a single page-level video/PDF guide card — no
// add/edit/delete/export, those stay admin-only on web.
const ChatbotGuideScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    searchKeyword,
    setSearchKeyword,
    isLoading,
    items,
    isEmpty,
    expandedIds,
    toggleExpanded,
    viewer,
    closeViewer,
    isResolvingGuide,
    openGeneralGuide,
  } = useChatbotGuide();

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
        <Text style={styles.headerTitle}>Hướng dẫn Chatbot</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.column}>
          <View style={styles.searchBox}>
            <Search size={20} color={APP_COLORS.chatIconMuted} />
            <TextInput
              value={searchKeyword}
              onChangeText={setSearchKeyword}
              placeholder="Tìm kiếm câu hỏi, hướng dẫn sử dụng..."
              placeholderTextColor={APP_COLORS.chatIconMuted}
              style={styles.searchInput}
            />
            {searchKeyword.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchKeyword('')}
                style={styles.clearButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={13} color={APP_COLORS.chatSubtitle} />
              </TouchableOpacity>
            )}
          </View>

          {/* Card renders immediately, no upfront fetch — matches web's
              button (click)="openDialogHuongdan('pdf', hdsd?.hdsd_file)":
              the guide record + download only get looked up when the user
              actually taps one of these two buttons. */}
          <View style={styles.generalCard}>
            <View style={styles.generalIconCircle}>
              <HelpCircle size={26} color={APP_COLORS.chatBrandRed} />
            </View>
            <View style={styles.generalTextWrap}>
              <Text style={styles.generalTitle}>Tài liệu hướng dẫn Chatbot</Text>
              <Text style={styles.generalSubtitle}>
                Xem video minh hoạ hoặc tài liệu PDF hướng dẫn sử dụng đầy đủ
              </Text>
            </View>
            <View style={styles.generalActions}>
              <TouchableOpacity
                style={styles.generalButtonFilled}
                onPress={() => openGeneralGuide('video')}
                disabled={isResolvingGuide}
              >
                {isResolvingGuide ? (
                  <ActivityIndicator size="small" color={APP_COLORS.white} />
                ) : (
                  <Play size={14} color={APP_COLORS.white} fill={APP_COLORS.white} />
                )}
                <Text style={styles.generalButtonFilledText}>Xem video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.generalButtonOutline}
                onPress={() => openGeneralGuide('pdf')}
                disabled={isResolvingGuide}
              >
                <FileText size={14} color={APP_COLORS.chatBrandRed} />
                <Text style={styles.generalButtonOutlineText}>Xem PDF</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>CÂU HỎI THƯỜNG GẶP</Text>
            <Text style={styles.sectionCount}>
              {searchKeyword.trim() ? `${items.length} kết quả` : `${items.length} câu hỏi`}
            </Text>
          </View>

          {isLoading && items.length === 0 ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={APP_COLORS.chatBrandRed} />
            </View>
          ) : isEmpty ? (
            <View style={styles.emptyState}>
              <Search size={36} color={APP_COLORS.chatIconMuted} />
              <Text style={styles.emptyText}>
                {searchKeyword.trim()
                  ? `Không tìm thấy câu hỏi nào phù hợp với "${searchKeyword.trim()}".`
                  : 'Chưa có câu hỏi hướng dẫn nào.'}
              </Text>
            </View>
          ) : (
            <View style={styles.faqList}>
              {items.map((item) => (
                <GuideFaqItem
                  key={item.gid}
                  item={item}
                  expanded={!!expandedIds[item.gid]}
                  onToggle={() => toggleExpanded(item.gid)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <GuideFileViewerModal viewer={viewer} onClose={closeViewer} />
    </SafeAreaView>
  );
};

export default ChatbotGuideScreen;

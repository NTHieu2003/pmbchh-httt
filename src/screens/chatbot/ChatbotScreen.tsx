import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronsRight,
  Lightbulb,
  Mic,
  Plus,
  Square,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_COLORS } from '@/theme';
import { useIsTablet } from '@/utils';

import { ChatMessageList, useChat } from './chat';
import { SuggestedQuestionsPanel } from './components';
import { createChatbotStyles } from './ChatbotScreen.styles';
import { LeftSidebar } from './leftSidebar';
import { RightSidebar } from './rightSidebar';

// Pushed from Home's drawer menu ("Chatbot" item) — see AppNavigator.tsx.
// Middle (chat) column is pixel-matched against the desktop reference mock
// and wired to the real streaming chat API (see `./chat/useChat.hook.ts`,
// mirrors pmbc_web's chatbot.component.ts send/stream/stop flow). Left
// (conversation list) and right ("Ngành đặc thù" picker) are both wired up;
// left only has the new-conversation action for now (no history API yet).
// "Admin" greeting is still a hardcoded placeholder name (no user API yet).
const ChatbotScreen: React.FC = () => {
  const { isTablet } = useIsTablet();
  const styles = createChatbotStyles(isTablet);
  const navigation = useNavigation();

  const {
    listChat,
    message,
    setMessage,
    isSendingMessage,
    isStopping,
    showTypingIndicator,
    sendMessage,
    stopGen,
    startNewConversation,
    loadConversation,
    historyVersion,
  } = useChat();

  const hasMessages = listChat.length > 0;

  // Same `minHeight`-measured-viewport trick as before: only needed while
  // showing the centered greeting (empty conversation) — once there are
  // messages the list owns the scrolling instead.
  const [viewportHeight, setViewportHeight] = useState(0);
  const handleViewportLayout = (event: LayoutChangeEvent) => {
    setViewportHeight(event.nativeEvent.layout.height);
  };

  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const toggleSuggestions = () => setIsSuggestionsOpen((prev) => !prev);
  const closeSuggestions = () => setIsSuggestionsOpen(false);
  // Matches pmbc_web's pickSuggestion: fill the composer, then close.
  const selectSuggestion = (question: string) => {
    setMessage(question);
    setIsSuggestionsOpen(false);
  };

  const composer = (
    <View>
      {isSuggestionsOpen && (
        <SuggestedQuestionsPanel
          onSelect={selectSuggestion}
          onClose={closeSuggestions}
        />
      )}
      <View style={styles.composer}>
        <TouchableOpacity style={styles.composerAddButton}>
          <Plus size={18} color={APP_COLORS.chatIconMuted} />
        </TouchableOpacity>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Hỏi bất kỳ điều gì..."
          placeholderTextColor={APP_COLORS.chatIconMuted}
          style={styles.composerInput}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
          editable={!isSendingMessage}
        />

        <View style={styles.composerActions}>
          <TouchableOpacity
            style={[
              styles.composerIconButton,
              isSuggestionsOpen && styles.composerIconButtonActive,
            ]}
            onPress={toggleSuggestions}
          >
            <Lightbulb
              size={20}
              color={
                isSuggestionsOpen ? APP_COLORS.chatAmber : APP_COLORS.chatIconMuted
              }
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.composerIconButton}>
            <Mic size={20} color={APP_COLORS.chatIconMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.composerSendButton}
            onPress={isSendingMessage ? stopGen : sendMessage}
            disabled={isSendingMessage ? isStopping : !message.trim()}
          >
            {isSendingMessage ? (
              <Square
                size={16}
                color={APP_COLORS.white}
                fill={APP_COLORS.white}
              />
            ) : (
              <ChevronsRight size={20} color={APP_COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        {isTablet && (
          <LeftSidebar
            onNewConversation={startNewConversation}
            onSelectConversation={loadConversation}
            onBack={navigation.goBack}
            refreshSignal={historyVersion}
          />
        )}

        {hasMessages ? (
          <KeyboardAvoidingView style={styles.chatColumn} behavior="padding">
            <ChatMessageList
              listChat={listChat}
              showTypingIndicator={showTypingIndicator}
            />

            {isSendingMessage && (
              <View style={styles.stopButtonRow}>
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={stopGen}
                  disabled={isStopping}
                >
                  {isStopping ? (
                    <ActivityIndicator
                      size="small"
                      color={APP_COLORS.chatBrandRed}
                    />
                  ) : (
                    <Square
                      size={12}
                      color={APP_COLORS.chatBrandRed}
                      fill={APP_COLORS.chatBrandRed}
                    />
                  )}
                  <Text style={styles.stopButtonText}>
                    {isStopping ? 'Đang dừng...' : 'Dừng phản hồi'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.composerDocked}>{composer}</View>
          </KeyboardAvoidingView>
        ) : (
          <KeyboardAwareScrollView
            style={styles.middleScroll}
            contentContainerStyle={styles.middleScrollContent}
            onLayout={handleViewportLayout}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            enableAutomaticScroll
            extraScrollHeight={100}
            extraHeight={70}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.centerWrapper, { minHeight: viewportHeight }]}>
              <View style={styles.middleContent}>
                <Image
                  source={require('@/assets/images/logo-bchh-chat.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.greeting}>Xin chào Admin</Text>
                <Text style={styles.subtitle}>
                  Tôi có thể hỗ trợ gì cho bạn hôm nay?
                </Text>

                <View style={styles.composerGreetingSpacing}>{composer}</View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}

        {isTablet && <RightSidebar />}
      </View>
    </SafeAreaView>
  );
};

export default ChatbotScreen;

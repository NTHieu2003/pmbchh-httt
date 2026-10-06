import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AlarmClock, Circle, Mic, MicOff } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { participantListItemStyles as styles } from './ParticipantListItem.styles';

import type { ThanhPhanThamGiaItem } from '@/types';

const SPEAKING_COLOR = '#22c55e';

export interface ParticipantListItemProps {
  item: ThanhPhanThamGiaItem;
  isJoined: boolean;
  // Mic/reminder actions only ever show for the "Đã tham gia" list, and
  // only to chủ trì/trợ lý (mirrors pmbc_mobile's UserItem:
  // `type === 'thamgia' && (userVaitro === 1 || userVaitro === 2)`).
  canDriveRoom?: boolean;
  isSpeaking?: boolean;
  onToggleMic?: () => void;
  onToggleReminder?: () => void;
}

// Mirrors pmbc_mobile's UserItem row (cấp bậc + tên/tên khác + đơn vị),
// plus the mic/nhắc nhở action icons chủ trì/trợ lý use to spotlight who's
// speaking (tên chuyển xanh khi đang nói, giống web/pmbc_mobile).
const ParticipantListItem: React.FC<ParticipantListItemProps> = ({
  item,
  isJoined,
  canDriveRoom = false,
  isSpeaking = false,
  onToggleMic,
  onToggleReminder,
}) => {
  const nameLine = [item.capbacST, item.thanhvienST || item.tenkhac].filter(Boolean).join(' ');
  const unitLine = item.donvitochuc1ST || item.thanhphanthu3 || '';
  const showActions = isJoined && canDriveRoom;

  return (
    <View style={styles.row}>
      <Circle
        size={8}
        color={isJoined ? SPEAKING_COLOR : APP_COLORS.chatIconMuted}
        fill={isJoined ? SPEAKING_COLOR : 'transparent'}
      />
      <View style={styles.info}>
        <Text
          style={[styles.name, isSpeaking && { color: SPEAKING_COLOR }]}
          numberOfLines={1}
        >
          {nameLine || 'Chưa rõ'}
        </Text>
        {!!unitLine && (
          <Text style={styles.unit} numberOfLines={1}>
            {unitLine}
          </Text>
        )}
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onToggleReminder}
            hitSlop={8}
          >
            <AlarmClock size={18} color={APP_COLORS.chatIconMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onToggleMic} hitSlop={8}>
            {isSpeaking ? (
              <Mic size={18} color={SPEAKING_COLOR} />
            ) : (
              <MicOff size={18} color={APP_COLORS.chatIconMuted} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ParticipantListItem;

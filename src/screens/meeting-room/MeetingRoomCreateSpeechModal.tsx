import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { Mic, Paperclip } from 'lucide-react-native';
import { pick, types } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';

import { CommonApi } from '@/api/common';
import { AppModal, AppModalButton } from '@/components/AppModal';
import { appAlert } from '@/components/AppDialog';
import { APP_COLORS } from '@/theme';
import { AppSelect, type AppSelectOption } from '@/components/AppSelect';

import { meetingRoomCreateSpeechModalStyles as styles } from './MeetingRoomCreateSpeechModal.styles';

import type { ThanhPhanThamGiaItem } from '@/types';

export interface MeetingRoomCreateSpeechModalProps {
  visible: boolean;
  onClose: () => void;
  participants: ThanhPhanThamGiaItem[];
  onSubmit: (input: {
    nguoithamgia: number;
    thoigian: number;
    noidung: string;
    filedinhkem?: string;
  }) => Promise<void>;
}

const participantLabel = (item: ThanhPhanThamGiaItem): string =>
  [item.capbacST, item.thanhvienST || item.tenkhac].filter(Boolean).join(' ');

// "Thêm mới phát biểu cá nhân" — mirrors pmbc_web's
// CreateNoiDungPhatBieuBoxComponent: chọn người phát biểu (autocomplete
// trên danh sách thành phần tham gia), thời gian (phút), nội dung, tài
// liệu đính kèm (chọn file thật từ thiết bị, upload qua
// insertFileAndConverCommon trước khi insert bản ghi).
const MeetingRoomCreateSpeechModal: React.FC<MeetingRoomCreateSpeechModalProps> = ({
  visible,
  onClose,
  participants,
  onSubmit,
}) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ThanhPhanThamGiaItem | null>(null);
  const [minutes, setMinutes] = useState('');
  const [content, setContent] = useState('');
  const [pickedFileName, setPickedFileName] = useState<string | null>(null);
  const [pickedFileUri, setPickedFileUri] = useState<string | null>(null);
  const [pickedFileType, setPickedFileType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!visible) return null;

  const options: AppSelectOption[] = participants.map((item) => ({
    key: String(item.gid),
    label: participantLabel(item) || item.thanhphanthu3 || '(Không rõ)',
    raw: item,
  }));

  const resetAndClose = () => {
    setQuery('');
    setSelected(null);
    setMinutes('');
    setContent('');
    setPickedFileName(null);
    setPickedFileUri(null);
    setPickedFileType(null);
    onClose();
  };

  const onPickFile = async () => {
    try {
      const [result] = await pick({ type: [types.allFiles] });
      if (result) {
        setPickedFileName(result.name ?? 'tệp đính kèm');
        setPickedFileUri(result.uri);
        setPickedFileType(result.type ?? 'application/octet-stream');
      }
    } catch {
      // User cancelled the picker — not an error.
    }
  };

  const onAccept = async () => {
    if (!selected) {
      appAlert('Thiếu thông tin', 'Vui lòng chọn người phát biểu.', undefined, { tone: 'warning' });
      return;
    }
    const thoigian = Number(minutes);
    if (!minutes || Number.isNaN(thoigian) || thoigian <= 0) {
      appAlert('Thiếu thông tin', 'Vui lòng nhập thời gian phát biểu (phút).', undefined, {
        tone: 'warning',
      });
      return;
    }
    if (!content.trim()) {
      appAlert('Thiếu thông tin', 'Vui lòng nhập nội dung phát biểu.', undefined, { tone: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      let filedinhkem: string | undefined;
      if (pickedFileUri && pickedFileName) {
        const base64 = await RNFS.readFile(pickedFileUri, 'base64');
        const dataUrl = `data:${pickedFileType || 'application/octet-stream'};base64,${base64}`;
        filedinhkem = (await CommonApi.insertFileAndConvert(pickedFileName, dataUrl)) ?? undefined;
      }

      await onSubmit({
        nguoithamgia: selected.gid,
        thoigian,
        noidung: content.trim(),
        filedinhkem,
      });
      resetAndClose();
    } catch {
      appAlert('Lỗi', 'Không thể thêm mới nội dung phát biểu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      visible
      onClose={resetAndClose}
      icon={Mic}
      title="Thêm mới phát biểu cá nhân"
      size="md"
      avoidKeyboard
      dismissOnBackdrop={false}
      bodyStyle={styles.body}
      footer={
        <>
          <AppModalButton label="Hủy" onPress={resetAndClose} disabled={isSubmitting} />
          <AppModalButton label="Lưu" variant="primary" onPress={onAccept} loading={isSubmitting} />
        </>
      }
    >
      <Text style={styles.label}>Người phát biểu</Text>
      <AppSelect
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setSelected(null);
        }}
        onSelect={(option) => {
          const item = option.raw as ThanhPhanThamGiaItem;
          setSelected(item);
          setQuery(option.label);
        }}
        options={options}
        filterLocally
        placeholder="Tìm theo tên"
        emptyText="Không tìm thấy người tham gia"
      />

      <Text style={styles.label}>Thời gian (phút)</Text>
      <TextInput
        style={styles.input}
        value={minutes}
        onChangeText={setMinutes}
        keyboardType="numeric"
        placeholder="VD: 10"
        placeholderTextColor={APP_COLORS.chatIconMuted}
      />

      <Text style={styles.label}>Nội dung</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        placeholder="Nhập nội dung phát biểu"
        placeholderTextColor={APP_COLORS.chatIconMuted}
        multiline
      />

      <Text style={styles.label}>Tài liệu đính kèm</Text>
      <TouchableOpacity style={styles.filePickerButton} onPress={onPickFile}>
        <Paperclip size={16} color={APP_COLORS.primary} />
        <Text style={styles.filePickerText} numberOfLines={1}>
          {pickedFileName || 'Chọn tệp từ thiết bị'}
        </Text>
      </TouchableOpacity>
    </AppModal>
  );
};

export default MeetingRoomCreateSpeechModal;

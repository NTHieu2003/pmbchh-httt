import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import { Download } from 'lucide-react-native';
import RNFS from 'react-native-fs';

import { CommonApi } from '@/api/common';
import { APP_COLORS } from '@/theme';

import { downloadFileButtonStyles as styles } from './DownloadFileButton.styles';

export interface DownloadFileButtonProps {
  fileName: string;
}

// Same download-and-save-to-Downloads flow as the CBRN export feature,
// reused here for arbitrary meeting attachments (tài liệu họp cá nhân/chung).
const DownloadFileButton: React.FC<DownloadFileButtonProps> = ({ fileName }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const onPress = () => {
    if (isDownloading) return;
    setIsDownloading(true);

    CommonApi.downloadFileByName(fileName)
      .then(async (base64) => {
        if (!base64) throw new Error('empty blob');
        const dir = RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath;
        const path = `${dir}/${fileName}`;
        await RNFS.writeFile(path, base64, 'base64');
        Alert.alert('Tải xuống thành công', `Đã lưu "${fileName}" vào thư mục Downloads.`);
      })
      .catch(() => {
        Alert.alert('Lỗi', `Không thể tải tệp "${fileName}".`);
      })
      .finally(() => setIsDownloading(false));
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={isDownloading}>
      {isDownloading ? (
        <ActivityIndicator size="small" color={APP_COLORS.primary} />
      ) : (
        <Download size={14} color={APP_COLORS.primary} />
      )}
      <Text style={styles.text} numberOfLines={1}>
        {fileName}
      </Text>
    </TouchableOpacity>
  );
};

export default DownloadFileButton;

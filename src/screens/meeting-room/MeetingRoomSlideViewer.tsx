import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';

import { CommonApi } from '@/api/common';
import { APP_COLORS } from '@/theme';

import { meetingRoomSlideViewerStyles as styles } from './MeetingRoomSlideViewer.styles';

export interface MeetingRoomSlideViewerProps {
  fileName?: string;
  // Controlled page — chủ trì/trợ lý turning a page broadcasts it over the
  // socket, and every device (including their own) re-renders this prop to
  // actually jump there (matches pmbc_mobile's `pdfRef.current.setPage`).
  page?: number;
  onPageChanged?: (page: number) => void;
}

// "Slide trình chiếu" — downloads the current agenda item's attachment and
// renders it with `react-native-pdf`, same download-to-cache-file approach
// as chatbot-guide's GuideFileViewerModal (Android's WebView has no PDF
// plugin, so a real PDF renderer is required either way).
const MeetingRoomSlideViewer: React.FC<MeetingRoomSlideViewerProps> = ({
  fileName,
  page,
  onPageChanged,
}) => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!fileName) {
      setFilePath(null);
      setHasError(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setFilePath(null);

    CommonApi.downloadFileByName(fileName)
      .then(async (base64) => {
        if (!base64) throw new Error('empty blob');
        const ext = fileName.split('.').pop() || 'pdf';
        const localPath = `${RNFS.CachesDirectoryPath}/phonghop_slide_${Date.now()}.${ext}`;
        await RNFS.writeFile(localPath, base64, 'base64');
        if (!cancelled) setFilePath(localPath);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fileName]);

  useEffect(() => {
    return () => {
      if (filePath) RNFS.unlink(filePath).catch(() => {});
    };
  }, [filePath]);

  if (!fileName) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.placeholderText}>Mục này không có tài liệu đính kèm.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator color={APP_COLORS.chatBrandRed} />
      </View>
    );
  }

  if (hasError || !filePath) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.errorText}>Không tải được tài liệu "{fileName}".</Text>
      </View>
    );
  }

  return (
    <Pdf
      source={{ uri: `file://${filePath}` }}
      page={page}
      style={styles.pdf}
      onPageChanged={(pageNumber) => onPageChanged?.(pageNumber)}
      onError={() => setHasError(true)}
    />
  );
};

export default MeetingRoomSlideViewer;

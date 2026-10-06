import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';

import { CommonApi } from '@/api/common';
import { APP_COLORS } from '@/theme';

import { getMimeType } from './fileMimeType';
import { guideFileViewerModalStyles as styles } from './GuideFileViewerModal.styles';

import type { GuideViewerState } from './useChatbotGuide.hook';

export interface GuideFileViewerModalProps {
  viewer: GuideViewerState | null;
  onClose: () => void;
}

// Fetches the file as base64 (matches web's CommonService.downloadFileByName)
// then writes it to a local cache file before rendering it — NOT embedded
// directly as a base64 `data:` URI. Two real bugs forced this:
//  1. Android's embedded WebView (react-native-webview) has no PDF plugin
//     at all (unlike full Chrome), so a `data:application/pdf;base64,...`
//     `<embed>` silently renders nothing — needs a real PDF renderer
//     (react-native-pdf), which takes a local file `uri`, not inline base64.
//  2. A multi-MB base64 string passed as a WebView `source.html` prop goes
//     across the RN bridge as a giant serialized string on every render —
//     slow, then OOM-crashes for anything video-sized. Writing to disk
//     first means only a short file path crosses the bridge.
const GuideFileViewerModal: React.FC<GuideFileViewerModalProps> = ({
  viewer,
  onClose,
}) => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!viewer) {
      setFilePath(null);
      setHasError(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setFilePath(null);

    CommonApi.downloadFileByName(viewer.fileName)
      .then(async (base64) => {
        if (!base64) throw new Error('empty blob');
        const ext = viewer.fileName.split('.').pop() || (viewer.type === 'pdf' ? 'pdf' : 'mp4');
        const localPath = `${RNFS.CachesDirectoryPath}/guide_${Date.now()}.${ext}`;
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
  }, [viewer]);

  // Clean up the cache file once the viewer closes/changes, no need to keep
  // downloaded guide files around between opens.
  useEffect(() => {
    return () => {
      if (filePath) RNFS.unlink(filePath).catch(() => {});
    };
  }, [filePath]);

  if (!viewer) return null;

  const renderBody = () => {
    if (isLoading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator color={APP_COLORS.white} />
          <Text style={styles.loadingText}>Đang tải tệp...</Text>
        </View>
      );
    }
    if (hasError || !filePath) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>
            Không tải được tệp "{viewer.fileName}". Vui lòng thử lại sau.
          </Text>
        </View>
      );
    }
    if (viewer.type === 'pdf') {
      return (
        <Pdf
          source={{ uri: `file://${filePath}` }}
          style={styles.webview}
          onError={() => setHasError(true)}
        />
      );
    }
    const mimeType = getMimeType(viewer.fileName, 'video/mp4');
    return (
      <WebView
        source={{
          html: `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;">
              <video src="file://${filePath}" type="${mimeType}" controls autoplay style="max-width:100%;max-height:100%;"></video>
            </body></html>`,
        }}
        style={styles.webview}
        originWhitelist={['*']}
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onError={() => setHasError(true)}
      />
    );
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {viewer.title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={18} color={APP_COLORS.white} />
            </TouchableOpacity>
          </View>
          {renderBody()}
        </View>
      </View>
    </Modal>
  );
};

export default GuideFileViewerModal;

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AlertTriangle, FileText, PlayCircle } from 'lucide-react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';

import { CommonApi } from '@/api/common';
import { AppModal } from '@/components/AppModal';
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
          <ActivityIndicator color={APP_COLORS.chatSubtitle} />
          <Text style={styles.stateText}>Đang tải tệp...</Text>
        </View>
      );
    }
    if (hasError || !filePath) {
      return (
        <View style={styles.centerBox}>
          <AlertTriangle size={32} color={APP_COLORS.chatSubtitle} />
          <Text style={styles.stateText}>
            Không tải được tệp "{viewer.fileName}". Vui lòng thử lại sau.
          </Text>
        </View>
      );
    }
    if (viewer.type === 'pdf') {
      return (
        <Pdf
          source={{ uri: `file://${filePath}` }}
          style={styles.pdf}
          onError={() => setHasError(true)}
        />
      );
    }
    const mimeType = getMimeType(viewer.fileName, 'video/mp4');
    // Video stays on black — playback looks best letterboxed in the dark.
    return (
      <WebView
        source={{
          html: `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;">
              <video src="file://${filePath}" type="${mimeType}" controls autoplay style="max-width:100%;max-height:100%;"></video>
            </body></html>`,
        }}
        style={styles.video}
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

  const showVideoCanvas = viewer.type === 'video' && !isLoading && !hasError && !!filePath;

  return (
    <AppModal
      visible
      onClose={onClose}
      icon={viewer.type === 'pdf' ? FileText : PlayCircle}
      title={viewer.title}
      subtitle={viewer.fileName}
      size="xl"
      scrollable={false}
      heightRatio={0.9}
      bodyStyle={[styles.canvas, showVideoCanvas && styles.canvasVideo]}
    >
      {renderBody()}
    </AppModal>
  );
};

export default GuideFileViewerModal;

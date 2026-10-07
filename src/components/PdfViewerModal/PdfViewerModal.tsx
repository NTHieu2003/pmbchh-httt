import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { AlertTriangle, FileText } from 'lucide-react-native';
import Pdf from 'react-native-pdf';

import { AppModal } from '@/components/AppModal';
import { APP_COLORS } from '@/theme';

import { pdfViewerModalStyles as styles } from './PdfViewerModal.styles';

export interface PdfViewerFile {
  // Absolute local path of an already-written PDF (e.g. an export saved to
  // Downloads) — react-native-pdf needs a real file `uri`, not inline base64.
  path: string;
  fileName: string;
}

export interface PdfViewerModalProps {
  file: PdfViewerFile | null;
  onClose: () => void;
}

// In-app viewer for a PDF that has just been exported/downloaded. Unlike
// chatbot-guide's GuideFileViewerModal (which downloads into the cache and
// deletes on close), this one only displays — the file stays in Downloads
// so the user keeps their export.
const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ file, onClose }) => {
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setPage(0);
    setPageCount(0);
    setHasError(false);
  }, [file]);

  if (!file) return null;

  return (
    <AppModal
      visible
      onClose={onClose}
      icon={FileText}
      title={file.fileName}
      subtitle={`Đã lưu vào thư mục Downloads${
        pageCount > 0 ? `  ·  Trang ${page}/${pageCount}` : ''
      }`}
      size="xl"
      scrollable={false}
      heightRatio={0.9}
      bodyStyle={styles.canvas}
    >
      {hasError ? (
        <View style={styles.centerBox}>
          <AlertTriangle size={32} color={APP_COLORS.chatSubtitle} />
          <Text style={styles.errorText}>
            Không mở được tệp PDF. Tệp vẫn được lưu trong thư mục Downloads.
          </Text>
        </View>
      ) : (
        <Pdf
          source={{ uri: `file://${file.path}` }}
          style={styles.pdf}
          onLoadComplete={(numberOfPages) => setPageCount(numberOfPages)}
          onPageChanged={(current) => setPage(current)}
          onError={() => setHasError(true)}
        />
      )}
    </AppModal>
  );
};

export default PdfViewerModal;

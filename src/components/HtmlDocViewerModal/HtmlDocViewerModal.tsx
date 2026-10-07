import React, { useMemo } from 'react';
import { FileText } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

import { AppModal } from '@/components/AppModal';

import { htmlDocViewerModalStyles as styles } from './HtmlDocViewerModal.styles';

export interface HtmlDocViewerFile {
  fileName: string;
  // The complete HTML document that was written to disk as the .doc file.
  html: string;
}

export interface HtmlDocViewerModalProps {
  file: HtmlDocViewerFile | null;
  onClose: () => void;
}

// Fits the document to the dialog width and lays it out as a white page on
// the gray canvas — preview only, the saved file is untouched.
const PREVIEW_HEAD = `
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html { background: #f1f3f6; }
    body { background: #fff; max-width: 800px; margin: 16px auto !important; padding: 32px !important; }
  </style>
</head>`;

// In-app preview for a "HTML saved as .doc" export (the CBRN simulation's
// Word reports) — react-native-pdf can't open those, but since the file is
// plain HTML a WebView renders it as-is. Like PdfViewerModal, this only
// displays: the file stays in Downloads.
const HtmlDocViewerModal: React.FC<HtmlDocViewerModalProps> = ({ file, onClose }) => {
  const source = useMemo(
    () => (file ? { html: file.html.replace('</head>', PREVIEW_HEAD) } : null),
    [file]
  );

  if (!file || !source) return null;

  return (
    <AppModal
      visible
      onClose={onClose}
      icon={FileText}
      title={file.fileName}
      subtitle="Đã lưu vào thư mục Downloads"
      size="xl"
      scrollable={false}
      heightRatio={0.9}
      bodyStyle={styles.canvas}
    >
      <WebView source={source} style={styles.webview} originWhitelist={['*']} />
    </AppModal>
  );
};

export default HtmlDocViewerModal;

import React from 'react';
import { FileBarChart } from 'lucide-react-native';

import { PlaceholderScreen } from '@/screens/placeholder';

// H.II.129 — "Trích xuất, xử lý kết quả mô phỏng phát tán và lan truyền hóa
// học, phóng xạ trên bản đồ qua giao diện Mobile".
const CbrnSimulationResultScreen: React.FC = () => (
  <PlaceholderScreen title="Kết quả mô phỏng" icon={FileBarChart} />
);

export default CbrnSimulationResultScreen;

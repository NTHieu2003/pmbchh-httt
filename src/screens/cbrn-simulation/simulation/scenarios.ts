import type { ScenarioKey } from './types';

export interface ScenarioTab {
  key: ScenarioKey;
  label: string;
  description: string;
}

// Order/labels match the web tab row exactly: #1 Cơ bản - Direct, #6 Nâng
// cao - Vũng đổ tràn, #2 Nâng cao - Bồn lỏng rò rỉ, #4/#5 Nâng cao - Bồn
// quá nhiệt, #7 Nâng cao - Đường ống khí.
export const SCENARIO_TABS: ScenarioTab[] = [
  {
    key: 'direct',
    label: '#1 Cơ bản - Direct',
    description:
      'Người dùng tự khai báo thẳng lưu lượng phát thải — không qua mô hình vật lý nào. Thời gian phát tán được tự tính = khối lượng ban đầu ÷ lưu lượng.',
  },
  {
    key: 'puddle',
    label: '#6 Nâng cao - Vũng đổ tràn',
    description:
      'Vũng đổ tràn diện tích CỐ ĐỊNH — bay hơi tính bằng công thức Brighton đầy đủ. Áp suất hơi tự động tính lại theo nhiệt độ môi trường.',
  },
  {
    key: 'tank_liquid_spreading',
    label: '#2 Nâng cao - Bồn lỏng rò rỉ',
    description:
      'Bồn rò rỉ LỎNG dưới mức → #2 Bernoulli tính lưu lượng theo độ sâu ngập thực (áp suất = áp suất hơi + ρ·g·h, mực lỏng hạ dần theo thời gian) → vũng LAN RỘNG.',
  },
  {
    key: 'tank_pressurized',
    label: '#4/#5 Nâng cao - Bồn quá nhiệt',
    description:
      'Bồn rò rỉ ở khoảng không, QUÁ NHIỆT → nếu là NH3/Cl2 qua #5 DIERS rồi #3 LEAKR/#4 HNE; hóa chất khác đi thẳng #4 HNE.',
  },
  {
    key: 'pipeline',
    label: '#7 Nâng cao - Đường ống khí',
    description:
      'Đường ống khí vỡ tại 1 điểm → #7 Newton-Raphson (Wilson) tự sinh ≤5 bước ổn định.',
  },
];

// `puddle`/`tank_liquid_spreading` are "liquid scenarios" — invalid for a
// chemical that's a gas at room temp (vp_pa >= P_ATM).
export function isLiquidScenario(scenario: ScenarioKey): boolean {
  return scenario === 'puddle' || scenario === 'tank_liquid_spreading';
}

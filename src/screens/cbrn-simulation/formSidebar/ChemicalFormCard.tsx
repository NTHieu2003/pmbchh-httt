import React from 'react';

import { AppSelect } from '@/components/AppSelect';

import ChemicalInfoCard from './ChemicalInfoCard';
import FormCard from './FormCard';

import type { AppSelectOption } from '@/components/AppSelect';
import type { Chemical } from '../simulation';

export interface ChemicalFormCardProps {
  chemQuery: string;
  onChangeChemQuery: (value: string) => void;
  filteredChems: Chemical[];
  isChemSearching: boolean;
  selectedChem: Chemical | null;
  onSelectChemical: (chem: Chemical) => void;
}

// Card "1 HÓA CHẤT" — remote-search chemical picker (AppSelect, debounced
// by the parent hook) + the selected chemical's detail card (matches
// pmbc_web's "Selected Chemical Info Card" — see ChemicalInfoCard).
const ChemicalFormCard: React.FC<ChemicalFormCardProps> = ({
  chemQuery,
  onChangeChemQuery,
  filteredChems,
  isChemSearching,
  selectedChem,
  onSelectChemical,
}) => {
  const options: AppSelectOption[] = filteredChems.map((chem) => ({
    key: `${chem.cas}-${chem.name}`,
    label: chem.name,
    subLabel: chem.cas ? `CAS ${chem.cas}` : undefined,
    raw: chem,
  }));

  return (
    <FormCard number={1} title="HÓA CHẤT">
      <AppSelect
        value={chemQuery}
        onChangeText={onChangeChemQuery}
        onSelect={(option) => onSelectChemical(option.raw as Chemical)}
        options={options}
        loading={isChemSearching}
        placeholder="Gõ tên hóa chất (vd. chlorine,...)"
        emptyText='Không tìm thấy — thử tên khác (vd. "chlorine", "ammonia", "propane")'
      />

      {selectedChem && <ChemicalInfoCard chem={selectedChem} />}
    </FormCard>
  );
};

export default ChemicalFormCard;

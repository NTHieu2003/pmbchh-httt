import { ApiClient } from '../axiosInstance';
import { CHEMICAL_ENDPOINTS } from './chemical.endpoints';

import type { Chemical, ChemicalSearchRequest } from '@/types';

interface ChemicalSearchResponseWrapped {
  lstChemical?: Chemical[];
}

export const ChemicalApi = {
  // Matches pmbc_web's ChemicalService.searchLists — POST body
  // { keyword, pageIndex, pageSize }, response `{ lstChemical: Chemical[] }`.
  search: async (request: ChemicalSearchRequest): Promise<Chemical[]> => {
    const response = await ApiClient.post(CHEMICAL_ENDPOINTS.SEARCH, request);
    const data = response as unknown as
      | ChemicalSearchResponseWrapped
      | Chemical[]
      | null
      | undefined;
    if (Array.isArray(data)) return data;
    return data?.lstChemical ?? [];
  },
};

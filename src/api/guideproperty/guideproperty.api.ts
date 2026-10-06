import { ApiClient } from '../axiosInstance';
import { GUIDEPROPERTY_ENDPOINTS } from './guideproperty.endpoints';

import type { GuidePropertyDetail } from '@/types';

export const GuidePropertyApi = {
  // Matches pmbc_web's GuidePropertyService.getOneByCode — POST
  // /gateway/guideproperty/getOneByCode with { name_gui }, response
  // `{ result: { code }, guidePropertyDTO: { file_dinhkem, ... } }`.
  getOneByCode: async (nameGui: string): Promise<GuidePropertyDetail | null> => {
    const response = await ApiClient.post(GUIDEPROPERTY_ENDPOINTS.GET_ONE_BY_CODE, {
      name_gui: nameGui,
    });
    const data = response as unknown as
      | { result?: { code?: string }; guidePropertyDTO?: GuidePropertyDetail }
      | null
      | undefined;
    if (data?.result?.code !== '00') return null;
    return data?.guidePropertyDTO ?? null;
  },
};

import { ApiClient } from '../axiosInstance';
import { DEPARTMENT_ENDPOINTS } from './department.endpoints';

import type { DepartmentItem } from '@/types';

export const DepartmentApi = {
  // Matches pmbc_web's DepartmentService.getListDepartment() —
  // POST /gateway/department/data with a null body.
  getListDepartment: async (): Promise<DepartmentItem[]> => {
    const response = await ApiClient.post(DEPARTMENT_ENDPOINTS.GET_LIST, {});
    const data = response as unknown as { listDepartment?: DepartmentItem[] } | null | undefined;
    return data?.listDepartment ?? [];
  },
};

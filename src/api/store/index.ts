import type { IStoreListResponse } from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/stores';

export const storeApi = {
  list: async () => {
    const response = await apiService.get<IStoreListResponse>(BASE_ENDPOINT);
    return response;
  },
};

import { type ILoginRequest, type ILoginResponse } from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/auth';

export const authApi = {
  login: async (body: ILoginRequest) => {
    const response = await apiService.post<ILoginResponse>(
      `${BASE_ENDPOINT}/customer/login`,
      body,
    );

    return response;
  },
};

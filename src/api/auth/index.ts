import {
  type ICustomerRegisterRequest,
  type ICustomerRegisterResponse,
  type ICustomerUpdateProfileRequest,
  type ICustomerUpdateProfileResponse,
  type ILoginRequest,
  type ILoginResponse,
} from '@/dtos';
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

  register: async (body: ICustomerRegisterRequest) => {
    const response = await apiService.post<ICustomerRegisterResponse>(
      `/customers/register`,
      body,
    );

    return response;
  },

  updateProfile: async (body: ICustomerUpdateProfileRequest) => {
    const response = await apiService.put<ICustomerUpdateProfileResponse>(
      `/customers/my-profile`,
      body,
    );

    return response;
  },
};

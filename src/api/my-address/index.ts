import type {
  IMyAddressCreateRequest,
  IMyAddressCreateResponse,
  IMyAddressDeleteRequest,
  IMyAddressDeleteResponse,
  IMyAddressDetailRequest,
  IMyAddressDetailResponse,
  IMyAddressListRequest,
  IMyAddressListResponse,
  IMyAddressUpdateRequest,
  IMyAddressUpdateResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/my-addresses';

export const myAddressApi = {
  list: async (params?: IMyAddressListRequest) => {
    const response = await apiService.get<IMyAddressListResponse>(
      BASE_ENDPOINT,
      { params },
    );
    return response;
  },

  detail: async ({ addressId }: IMyAddressDetailRequest) => {
    const response = await apiService.get<IMyAddressDetailResponse>(
      `${BASE_ENDPOINT}/${addressId}`,
    );
    return response;
  },

  create: async (body: IMyAddressCreateRequest) => {
    const response = await apiService.post<IMyAddressCreateResponse>(
      BASE_ENDPOINT,
      body,
    );
    return response;
  },

  update: async ({ addressId, ...body }: IMyAddressUpdateRequest) => {
    const response = await apiService.put<IMyAddressUpdateResponse>(
      `${BASE_ENDPOINT}/${addressId}`,
      body,
    );
    return response;
  },

  delete: async ({ addressId }: IMyAddressDeleteRequest) => {
    const response = await apiService.delete<IMyAddressDeleteResponse>(
      `${BASE_ENDPOINT}/${addressId}`,
    );
    return response;
  },

  setDefault: async (addressId: number) => {
    const response = await apiService.post<IMyAddressUpdateResponse>(
      `${BASE_ENDPOINT}/${addressId}/set-default`,
    );
    return response;
  },
};

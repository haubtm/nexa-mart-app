import type {
  IOrderByIdRequest,
  IOrderByIdResponse,
  IOrderCreateRequest,
  IOrderCreateResponse,
  IOrderListRequest,
  IOrderListResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/checkout';

export const orderApi = {
  list: async (body: IOrderListRequest) => {
    const response = await apiService.get<IOrderListResponse>(
      `${BASE_ENDPOINT}`,
      {
        params: {
          ...body,
        },
      },
    );

    return response;
  },

  byId: async (body: IOrderByIdRequest) => {
    const response = await apiService.get<IOrderByIdResponse>(
      `${BASE_ENDPOINT}/${body.orderId}`,
      {
        params: {
          ...body,
        },
      },
    );

    return response;
  },

  create: async (body: IOrderCreateRequest) => {
    const response = await apiService.post<IOrderCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },
};

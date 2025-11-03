import type {
  ICartCreateRequest,
  ICartCreateResponse,
  ICartDeleteProductRequest,
  ICartDeleteResponse,
  ICartListResponse,
  ICartUpdateRequest,
  ICartUpdateResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/cart';

export const cartApi = {
  list: async () => {
    const response = await apiService.get<ICartListResponse>(
      `${BASE_ENDPOINT}`,
    );

    return response;
  },

  create: async (body: ICartCreateRequest) => {
    const response = await apiService.post<ICartCreateResponse>(
      `${BASE_ENDPOINT}/items`,
      body,
    );

    return response;
  },

  update: async (body: ICartUpdateRequest) => {
    const response = await apiService.put<ICartUpdateResponse>(
      `${BASE_ENDPOINT}/items/${body.productUnitId}`,
      body,
    );

    return response;
  },

  delete: async () => {
    const response = await apiService.delete<ICartDeleteResponse>(
      `${BASE_ENDPOINT}`,
    );

    return response;
  },

  deleteProduct: async (body: ICartDeleteProductRequest) => {
    const response = await apiService.delete<ICartDeleteResponse>(
      `${BASE_ENDPOINT}/items/${body.productUnitId}`,
      { data: body },
    );

    return response;
  },
};

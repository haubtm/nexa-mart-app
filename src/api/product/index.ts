import type {
  IProductByBrandIdRequest,
  IProductByBrandIdResponse,
  IProductByCategoryIdRequest,
  IProductByCategoryIdResponse,
  IProductByIdRequest,
  IProductByIdResponse,
  IProductListRequest,
  IProductListResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/products';

export const productApi = {
  list: async (body: IProductListRequest) => {
    const response = await apiService.post<IProductListResponse>(
      `${BASE_ENDPOINT}/search`,
      body,
    );

    return response;
  },
  byId: async (body: IProductByIdRequest) => {
    const response = await apiService.get<IProductByIdResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
      {
        params: {
          ...body,
        },
      },
    );

    return response;
  },

  byCategoryId: async (body: IProductByCategoryIdRequest) => {
    const response = await apiService.get<IProductByCategoryIdResponse>(
      `${BASE_ENDPOINT}/category/${body.categoryId}`,
      {
        params: {
          ...body,
        },
      },
    );

    return response;
  },

  byBrandId: async (body: IProductByBrandIdRequest) => {
    const response = await apiService.get<IProductByBrandIdResponse>(
      `${BASE_ENDPOINT}/brand/${body.brandId}`,
      {
        params: {
          ...body,
        },
      },
    );

    return response;
  },
};

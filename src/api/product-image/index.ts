import type {
  IProductImageByIdRequest,
  IProductImageByIdResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/product-images';

export const productImageApi = {
  byId: async (body: IProductImageByIdRequest) => {
    const response = await apiService.get<IProductImageByIdResponse>(
      `${BASE_ENDPOINT}/${body.productId}`,
    );

    return response;
  },
};

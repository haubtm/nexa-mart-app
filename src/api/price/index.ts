import type {
  IPriceByProductIdRequest,
  IPriceByProductIdResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/prices';

export const priceApi = {
  byProductId: async (body: IPriceByProductIdRequest) => {
    const response = await apiService.get<IPriceByProductIdResponse>(
      `${BASE_ENDPOINT}/product-unit/${body.productUnitId}/current-price`,
      {
        params: {
          ...body,
        },
      },
    );

    return response;
  },
};

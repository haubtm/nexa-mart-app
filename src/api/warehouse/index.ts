import type {
  IWarehouseStockByProductUnitIdRequest,
  IWarehouseStockByProductUnitIdResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/warehouse';

export const warehouseApi = {
  stockByProductUnitId: async (body: IWarehouseStockByProductUnitIdRequest) => {
    const response =
      await apiService.get<IWarehouseStockByProductUnitIdResponse>(
        `${BASE_ENDPOINT}/product-unit/${body.productUnitId}/stock`,
      );

    return response;
  },
};

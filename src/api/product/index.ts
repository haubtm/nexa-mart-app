import type {
  IProductByBarcodeRequest,
  IProductByBarcodeResponse,
  IProductByBrandIdRequest,
  IProductByBrandIdResponse,
  IProductByCategoryIdRequest,
  IProductByCategoryIdResponse,
  IProductByIdRequest,
  IProductByIdResponse,
  IProductDetailRequest,
  IProductDetailResponse,
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

  detail: async (body: IProductDetailRequest) => {
    const response = await apiService.get<IProductDetailResponse>(
      `${BASE_ENDPOINT}/units/${body.productUnitId}/details`,
      {
        params: {
          ...body,
        },
      },
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

  byBarcode: async (body: IProductByBarcodeRequest) => {
    const response = await apiService.get<IProductByBarcodeResponse>(
      `${BASE_ENDPOINT}/barcode/${body.barcode}`,
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

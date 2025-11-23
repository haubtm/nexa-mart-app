import { productApi } from '@/api';
import type {
  IProductByBarcodeRequest,
  IProductByBrandIdRequest,
  IProductByCategoryIdRequest,
  IProductByIdRequest,
  IProductDetailRequest,
  IProductListRequest,
} from '@/dtos';
import { useQuery } from '@tanstack/react-query';
import { productKeys } from '../query-keys';

export const useProductList = (filters: IProductListRequest) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => await productApi.list(filters),
  });
};

export const useProductUnitById = (body: IProductDetailRequest) => {
  return useQuery({
    queryKey: productKeys.detail(body.productUnitId),
    queryFn: async () => await productApi.detail(body),
  });
};

export const useProductById = (body: IProductByIdRequest) => {
  return useQuery({
    queryKey: productKeys.byId(body.id),
    queryFn: async () => await productApi.byId(body),
  });
};

export const useProductByBarcode = (body: IProductByBarcodeRequest) => {
  return useQuery({
    queryKey: productKeys.byBarcodeId(body),
    queryFn: async () => await productApi.byBarcode(body),
    enabled: !!body.barcode,
  });
};

export const useProductByCategoryId = (body: IProductByCategoryIdRequest) => {
  return useQuery({
    queryKey: productKeys.byCategoryId(body),
    queryFn: async () => await productApi.byCategoryId(body),
  });
};

export const useProductByBrandId = (body: IProductByBrandIdRequest) => {
  return useQuery({
    queryKey: productKeys.byBrandId(body),
    queryFn: async () => await productApi.byBrandId(body),
  });
};

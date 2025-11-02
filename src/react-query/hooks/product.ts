import { productApi } from '@/api';
import type {
  IProductByBrandIdRequest,
  IProductByCategoryIdRequest,
  IProductByIdRequest,
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

export const useProductById = (body: IProductByIdRequest) => {
  return useQuery({
    queryKey: productKeys.detail(body.id),
    queryFn: async () => await productApi.byId(body),
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

import { productImageApi } from '@/api';
import type { IProductImageByIdRequest } from '@/dtos';
import { useQuery } from '@tanstack/react-query';
import { productImageKeys } from '../query-keys';

export const useProductImageById = (body: IProductImageByIdRequest) => {
  return useQuery({
    queryKey: productImageKeys.detail(body.productId),
    queryFn: async () => await productImageApi.byId(body),
    enabled: !!body.productId,
  });
};

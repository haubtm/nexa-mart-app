import { priceApi } from '@/api';
import type { IPriceByProductIdRequest } from '@/dtos';
import { useQuery } from '@tanstack/react-query';
import { priceKeys } from '../query-keys';

export const usePriceByProductId = (body: IPriceByProductIdRequest) => {
  return useQuery({
    queryKey: priceKeys.byProductId(body.productUnitId),
    queryFn: async () => await priceApi.byProductId(body),
  });
};

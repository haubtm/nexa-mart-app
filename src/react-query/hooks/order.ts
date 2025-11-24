import { orderApi } from '@/api';
import type {
  IOrderByIdRequest,
  IOrderByIdResponse,
  IOrderListRequest,
} from '@/dtos';
import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { orderKeys } from '../query-keys';

export const useOrderList = (body: IOrderListRequest) => {
  return useQuery({
    queryKey: orderKeys.list(body),
    queryFn: async () => await orderApi.list(body),
  });
};

export const useOrderById = (
  body: IOrderByIdRequest,
  options?: Omit<UseQueryOptions<IOrderByIdResponse>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: orderKeys.byId(body),
    queryFn: async () => await orderApi.byId(body),
    enabled: !!body.orderId,
    ...options,
  });
};

export const useOrderCreate = () => {
  return useMutation({
    mutationFn: orderApi.create,
  });
};

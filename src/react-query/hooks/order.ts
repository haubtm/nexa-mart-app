import { orderApi } from '@/api';
import type { IOrderByIdRequest, IOrderListRequest } from '@/dtos';
import { useMutation, useQuery } from '@tanstack/react-query';
import { orderKeys } from '../query-keys';

export const useOrderList = (body: IOrderListRequest) => {
  return useQuery({
    queryKey: orderKeys.list(body),
    queryFn: async () => await orderApi.list(body),
  });
};

export const useOrderById = (body: IOrderByIdRequest) => {
  return useQuery({
    queryKey: orderKeys.byId(body),
    queryFn: async () => await orderApi.byId(body),
  });
};

export const useOrderCreate = () => {
  return useMutation({
    mutationFn: orderApi.create,
  });
};

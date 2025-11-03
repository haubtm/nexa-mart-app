import { cartApi } from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { cartKeys } from '../query-keys/cart';

export const useCartList = () => {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: async () => await cartApi.list(),
  });
};

export const useCartCreate = () => {
  return useMutation({
    mutationFn: cartApi.create,
  });
};

export const useCartUpdate = () => {
  return useMutation({
    mutationFn: cartApi.update,
  });
};

export const useCartDelete = () => {
  return useMutation({
    mutationFn: cartApi.delete,
  });
};

export const useCartDeleteProduct = () => {
  return useMutation({
    mutationFn: cartApi.deleteProduct,
  });
};

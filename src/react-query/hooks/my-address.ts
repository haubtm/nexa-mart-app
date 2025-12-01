import { myAddressApi } from '@/api';
import type { IMyAddressListRequest } from '@/dtos';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { myAddressKeys } from '../query-keys/my-address';

export const useMyAddressList = (params?: IMyAddressListRequest) => {
  return useQuery({
    queryKey: myAddressKeys.lists(),
    queryFn: () => myAddressApi.list(params),
  });
};

export const useMyAddressDetail = (addressId: number) => {
  return useQuery({
    queryKey: myAddressKeys.detail(String(addressId)),
    queryFn: () => myAddressApi.detail({ addressId }),
    enabled: !!addressId,
  });
};

export const useMyAddressCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: myAddressApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myAddressKeys.all });
    },
  });
};

export const useMyAddressUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: myAddressApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myAddressKeys.all });
    },
  });
};

export const useMyAddressDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: myAddressApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myAddressKeys.all });
    },
  });
};

export const useMyAddressSetDefault = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: myAddressApi.setDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myAddressKeys.all });
    },
  });
};

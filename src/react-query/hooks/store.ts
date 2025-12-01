import { storeApi } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { storeKeys } from '../query-keys/store';

export const useStoreList = () => {
  return useQuery({
    queryKey: storeKeys.lists(),
    queryFn: () => storeApi.list(),
  });
};

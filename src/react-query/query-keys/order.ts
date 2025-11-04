import { IOrderByIdRequest, IOrderListRequest } from '@/dtos';

export const orderKeys = {
  all: ['order'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (body: IOrderListRequest) => [...orderKeys.lists(), body] as const,
  byIds: () => [...orderKeys.all, 'byId'] as const,
  byId: (body: IOrderByIdRequest) => [...orderKeys.byIds(), body] as const,
};

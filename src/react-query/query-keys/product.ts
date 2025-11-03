import {
  IProductByBrandIdRequest,
  IProductByCategoryIdRequest,
  IProductListRequest,
} from '@/dtos';

export const productKeys = {
  all: ['product'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: IProductListRequest) =>
    [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  byIds: () => [...productKeys.all, 'byIds'] as const,
  byId: (id: number) => [...productKeys.byIds(), id] as const,
  byCategory: () => [...productKeys.all, 'byCategory'] as const,
  byCategoryId: (body: IProductByCategoryIdRequest) =>
    [...productKeys.byCategory(), { ...body }] as const,
  byBrand: () => [...productKeys.all, 'byBrand'] as const,
  byBrandId: (body: IProductByBrandIdRequest) =>
    [...productKeys.byBrand(), { ...body }] as const,
};

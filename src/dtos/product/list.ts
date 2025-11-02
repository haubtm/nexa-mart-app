import type { IResponse } from '../common';
import type { IPageable, IProductResponseData } from './common';

export interface IProductListRequest {
  page?: number;
  size?: number;
  searchTerm?: string;
  categoryId?: number;
  brandId?: number;
  isActive?: boolean;
  sort?: string[];
}

export interface IProductListResponse
  extends IResponse<
    {
      products: IProductResponseData[];
    } & IPageable
  > {}

import { EOrderStatus } from '@/lib';
import { IPageable, IResponse } from '../common';
import { IOrderResponseData } from './common';

export interface IOrderListRequest {
  status?: EOrderStatus;
  page?: number;
  limit?: number;
}

export interface IOrderListResponse
  extends IResponse<
    {
      content: IOrderResponseData[];
    } & IPageable
  > {}

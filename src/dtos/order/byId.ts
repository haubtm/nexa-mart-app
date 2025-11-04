import { IResponse } from '../common';
import { IOrderResponseData } from './common';

export interface IOrderByIdRequest {
  orderId: number;
}

export interface IOrderByIdResponse extends IResponse<IOrderResponseData> {}

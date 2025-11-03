import { IResponse } from '../common';
import { ICartResponseData } from './common';

export interface ICartCreateRequest {
  productUnitId: number;
  quantity: number;
}

export interface ICartCreateResponse extends IResponse<ICartResponseData> {}

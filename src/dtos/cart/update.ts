import { IResponse } from '../common';
import { ICartResponseData } from './common';

export interface ICartUpdateRequest {
  productUnitId: number;
  quantity: number;
}

export interface ICartUpdateResponse extends IResponse<ICartResponseData> {}

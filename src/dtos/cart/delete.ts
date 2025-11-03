import { IResponse } from '../common';
import { ICartResponseData } from './common';

export interface ICartDeleteResponse extends IResponse<null> {}

export interface ICartDeleteProductRequest {
  productUnitId: number;
}

export interface ICartDeleteProductResponse
  extends IResponse<ICartResponseData> {}

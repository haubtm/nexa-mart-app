import type { IResponse } from '../common';
import type { IPriceDetail } from './common';

export interface IPriceByProductIdRequest {
  productUnitId: number;
}

export interface IPriceByProductIdResponse extends IResponse<IPriceDetail> {}

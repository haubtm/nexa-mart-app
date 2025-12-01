import type { IResponse } from '../common';
import type { IMyAddress } from './types';

export interface IMyAddressDetailRequest {
  addressId: number;
}

export type IMyAddressDetailResponse = IResponse<IMyAddress>;

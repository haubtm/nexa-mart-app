import type { IResponse } from '../common';

export interface IMyAddressDeleteRequest {
  addressId: number;
}

export type IMyAddressDeleteResponse = IResponse<null>;

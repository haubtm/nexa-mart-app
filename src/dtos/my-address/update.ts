import type { IResponse } from '../common';
import type { AddressLabel, IMyAddress } from './types';

export interface IMyAddressUpdateRequest {
  addressId: number;
  recipientName?: string;
  recipientPhone?: string;
  addressLine?: string;
  ward?: string;
  city?: string;
  isDefault?: boolean;
  label?: AddressLabel;
}

export type IMyAddressUpdateResponse = IResponse<IMyAddress>;

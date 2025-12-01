import { EDeliveryType, EPaymentMethod } from '@/lib';
import { IResponse } from '../common';
import { IOrderResponseData } from './common';

export interface IOrderCreateRequest {
  deliveryType: EDeliveryType;
  paymentMethod: EPaymentMethod;
  addressId?: number;
  storeId?: number;
  orderNote?: string;
}

export interface IOrderCreateResponse extends IResponse<IOrderResponseData> {}

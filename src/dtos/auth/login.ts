import { ECustomerType } from '@/lib';
import type { IResponse } from '../common';

export interface ILoginRequest {
  emailOrPhone: string;
  password: string;
}

interface IResponseData {
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  customer?: {
    customerId?: number;
    name?: string;
    email?: string;
    phone?: string;
    customerType?: ECustomerType;
  };
}

export interface ILoginResponse extends IResponse<IResponseData> {}

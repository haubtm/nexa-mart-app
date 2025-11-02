import { EGender } from '@/lib';
import type { IResponse } from '../common';
import type { ICustomerResponseData } from './common';

export interface ICustomerRegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender?: EGender;
  address?: string;
  dateOfBirth?: string;
}

export interface ICustomerRegisterResponse extends IResponse<ICustomerResponseData> {}

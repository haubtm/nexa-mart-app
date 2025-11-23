import { EGender } from '@/lib';
import type { IResponse } from '../common';
import type { ICustomerResponseData } from './common';

export interface IAddressDetail {
  houseNumber: string; // Số nhà
  wardCode: number; // Mã phường/xã
  wardName: string; // Tên phường/xã
  provinceCode: number; // Mã tỉnh/thành phố
  provinceName: string; // Tên tỉnh/thành phố
}

export interface ICustomerUpdateProfileRequest {
  name: string;
  email: string;
  phone: string;
  customerCode?: string;
  password?: string;
  confirmPassword?: string;
  gender?: EGender;
  address?: string;
  dateOfBirth?: string;
  addressDetail?: IAddressDetail;
}

export interface ICustomerUpdateProfileResponse
  extends IResponse<ICustomerResponseData> {}

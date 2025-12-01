import type { IBaseListRequest, IResponse } from '../common';
import type { IMyAddress } from './types';

export interface IMyAddressListRequest extends IBaseListRequest {}

export type IMyAddressListResponse = IResponse<IMyAddress[]>;

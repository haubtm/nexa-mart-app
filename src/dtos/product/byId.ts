import type { IResponse } from '../common';
import type { IPageable, IProductResponseData } from './common';

interface IProductByIdResponseData {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  isRewardPoint: boolean;
  createdDate: string;
  updatedAt: string;
  brand: {
    brandId: number;
    name: string;
    brandCode: string;
    logoUrl: string | null;
  };
  category: {
    categoryId: number;
    name: string;
    description: string | null;
  };
  unitCount: number;
  imageCount: number;
  productUnits: Array<{
    id: number;
    barcode: string;
    conversionValue: number;
    isBaseUnit: boolean;
    isActive: boolean;
    unitName: string;
  }>;
}

export interface IProductByIdRequest {
  id: number;
}

export interface IProductByIdResponse
  extends IResponse<IProductByIdResponseData> {}

export interface IProductByCategoryIdRequest {
  categoryId: number;
  pageable?: {
    page?: number;
    size?: number;
    sort?: string[];
  };
}

export interface IProductByCategoryIdResponse
  extends IResponse<
    {
      products: IProductResponseData[];
    } & IPageable
  > {}

export interface IProductByBrandIdRequest {
  brandId: number;
  pageable?: {
    page?: number;
    size?: number;
    sort?: string[];
  };
}

export interface IProductByBrandIdResponse
  extends IResponse<
    {
      products: IProductResponseData[];
    } & IPageable
  > {}

interface IUnit {
  id?: number;
  barcode?: string;
  conversionValue: number;
  isBaseUnit: boolean;
  isActive: boolean;
  unitName: string;
}

export interface IProductResponseData {
  id: number;
  productCode: string;
  name: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  unitCount: number;
  imageCount: number;
  mainImageUrl: string;
  units: IUnit[];
}

export interface IUnitResponseData {
  id: number;
  code: string;
  barcode: string;
  conversionValue: number;
  isBaseUnit: boolean;
  isActive: boolean;
  unit: {
    id: number;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
    createAt: string;
    updateAt: string;
  };
  productId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPageable {
  pageInfo: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isFirst: boolean;
    isLast: boolean;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

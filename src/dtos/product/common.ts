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

export interface IProductImage {
  id: number;
  displayOrder: number;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  productUnitId: number;
  productImage: {
    imageId: number;
    imageUrl: string;
    imageAlt: string | null;
    sortOrder: number;
    createdAt: string;
    productId: number;
    variantId: number | null;
  };
}
export interface IProductDetailResponseData {
  productUnitId: number;
  barcode: string;
  conversionValue: number;
  isBaseUnit: boolean;
  isActive: boolean;
  productId: number;
  productName: string;
  productCode: string;
  description: string;
  unitId: number;
  unitName: string;
  quantityOnHand: number;
  currentPrice: number;
  priceId: number | null;
  priceCode: string | null;
  priceName: string | null;
  images: IProductImage[];
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

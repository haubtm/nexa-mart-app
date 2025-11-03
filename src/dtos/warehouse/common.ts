interface IProductUnit {
  productUnitId: number;
  code?: string | null;
  barcode?: string | null;
  conversionValue: number;
  isBaseUnit: boolean;
  productName: string;
  unit: string;
}

export interface IWarehouseResponseData {
  warehouseId: number;
  quantityOnHand: number;
  updatedAt: string;
  productUnit: IProductUnit;
}

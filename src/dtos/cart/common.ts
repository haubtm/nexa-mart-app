import { EDiscountType } from '@/lib';

interface IAppliedPromotion {
  promotionId: string;
  promotionName: string;
  promotionDetailId: number;
  promotionSummary: string;
  discountType: EDiscountType;
  discountValue: number;
  sourceLineItemId?: number;
}

interface ICartItem {
  lineItemId: number;
  productUnitId: number;
  productName: string;
  unitName: string;
  quantity: number;
  unitPrice: number;
  originalTotal: number;
  finalTotal: number;
  imageUrl: string | null;
  stockQuantity: number;
  hasPromotion: boolean;
  promotionApplied: IAppliedPromotion | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICartResponseData {
  cartId: number;
  customerId: number;
  items: ICartItem[];
  totalItems: number;
  subTotal: number;
  lineItemDiscount: number;
  orderDiscount: number;
  totalPayable: number;
  appliedOrderPromotions: IAppliedPromotion[];
  createdAt: string;
  updatedAt: string;
}

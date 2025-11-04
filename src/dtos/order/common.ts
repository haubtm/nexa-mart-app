import {
  EDeliveryType,
  EDiscountType,
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
} from '@/lib';

interface IAppliedPromotion {
  promotionId: string;
  promotionName: string;
  promotionDetailId: number;
  promotionSummary: string;
  discountType: EDiscountType;
  discountValue: number;
  sourceLineItemId?: number;
}

export interface IOrderResponseData {
  orderId: number;
  orderCode: string;
  orderStatus: EOrderStatus;
  deliveryType: EDeliveryType;
  paymentMethod: EPaymentMethod;
  paymentStatus: EPaymentStatus;
  transactionId: string | null;
  customerInfo: {
    customerId: number;
    customerName: string;
    phoneNumber: string;
    email: string;
    currentLoyaltyPoints: number;
  };
  deliveryInfo: {
    recipientName: string;
    deliveryPhone: string;
    deliveryAddress: string;
    deliveryNote?: string;
  } | null;
  orderItems: {
    productUnitId: number;
    productName: string;
    unitName: string;
    barcode: string;
    quantity: number;
    originalPrice: number;
    discountedPrice: number;
    discountAmount: number;
    lineTotal: number;
    promotionInfo: string | null;
  }[];
  subtotal: number;
  totalDiscount: number;
  shippingFee: number;
  loyaltyPointsUsed: number;
  loyaltyPointsDiscount: number;
  totalAmount: number;
  amountPaid: number;
  changeAmount: number;
  onlinePaymentInfo: {
    transactionId: string;
    paymentProvider: string;
    paymentStatus: EPaymentStatus;
    paymentUrl: string;
    qrCode: string;
    expirationTime: string;
  } | null;
  appliedPromotions: IAppliedPromotion[];
  loyaltyPointsEarned: number;
  createdAt: string;
  updatedAt: string;
}

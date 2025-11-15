import { ESenderType } from '@/lib';
import { IResponse } from '../common';
import {
  IStructuredCartData,
  IStructuredOrderData,
  IStructuredPolicyData,
  IStructuredProductData,
  IStructuredPromotionData,
  IStructuredStockData,
} from './common';

export interface IConversationByIdRequest {
  customerId: number;
  conversationId: string;
}

export interface IChatMessage {
  id: string | number;
  senderType: ESenderType;
  content: string;
  data: {
    products?: IStructuredProductData[];
    orders?: IStructuredOrderData[];
    promotions?: IStructuredPromotionData[];
    stock?: IStructuredStockData[];
    policy?: IStructuredPolicyData[];
    cart?: IStructuredCartData[];
  } | null;
  suggestions?: string[];
  timestamp: string;
}

export interface IConversationByIdResponse extends IResponse<IChatMessage[]> {}

export interface IConversationMessageRequest {
  customerId: number;
  conversationId: string;
  message: string;
}

export interface IConversationMessageResponse
  extends IResponse<{
    conversationId: string;
    messageId: string;
    message: string;
    createdAt: string;
    structuredData: {
      response_type: string;
      message: string;
      data: {
        products: IStructuredProductData[] | null;
        orders: IStructuredOrderData[] | null;
        promotions: IStructuredPromotionData[] | null;
        stock: IStructuredStockData[] | null;
        policy: IStructuredPolicyData[] | null;
        cart: IStructuredCartData[] | null;
      };
      suggestions: string[];
      metadata: {
        result_count: number;
        has_more: boolean;
        confidence: number;
        tools_used: string;
        additional_info: string;
      };
      timestamp: string;
    };
  }> {}

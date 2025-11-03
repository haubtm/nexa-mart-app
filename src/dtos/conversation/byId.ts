import { ESenderType } from '@/lib';
import { IResponse } from '../common';

export interface IConversationByIdRequest {
  customerId: number;
  conversationId: string;
}

export interface IConversationByIdResponse
  extends IResponse<{
    id: string;
    senderType: ESenderType;
    content: string;
    timestamp: string;
  }> {}

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
  }> {}

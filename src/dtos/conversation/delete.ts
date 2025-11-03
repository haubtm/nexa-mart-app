import { IResponse } from '../common';

export interface IConversationDeleteRequest {
  customerId: number;
  conversationId: string;
}

export interface IConversationDeleteResponse extends IResponse<null> {}

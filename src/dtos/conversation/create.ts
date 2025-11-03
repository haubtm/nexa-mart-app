import { IResponse } from '../common';
import { IConversationResponseData } from './common';

export interface IConversationCreateRequest {
  customerId: number;
}

export interface IConversationCreateResponse
  extends IResponse<IConversationResponseData> {}

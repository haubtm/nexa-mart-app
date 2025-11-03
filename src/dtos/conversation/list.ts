import { IResponse } from '../common';
import { IConversationResponseData } from './common';

export interface IConversationListRequest {
  customerId: number;
}

export interface IConversationListResponse
  extends IResponse<IConversationResponseData[]> {}

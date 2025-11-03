import type {
  IConversationByIdRequest,
  IConversationByIdResponse,
  IConversationCreateRequest,
  IConversationCreateResponse,
  IConversationDeleteRequest,
  IConversationListRequest,
  IConversationListResponse,
  IConversationMessageRequest,
  IConversationMessageResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/chat/conversations';

export const conversationApi = {
  list: async (body: IConversationListRequest) => {
    const response = await apiService.get<IConversationListResponse>(
      `${BASE_ENDPOINT}`,
      {
        params: {
          ...body,
        },
      },
    );

    return response;
  },

  byId: async (body: IConversationByIdRequest) => {
    const response = await apiService.get<IConversationByIdResponse>(
      `${BASE_ENDPOINT}/${body.conversationId}/history?customerId=${body.customerId}`,
      {
        params: {
          ...body,
        },
      },
    );

    return response;
  },

  create: async (body: IConversationCreateRequest) => {
    const response = await apiService.post<IConversationCreateResponse>(
      `${BASE_ENDPOINT}?customerId=${body.customerId}`,
      body,
    );
    return response;
  },

  chat: async (body: IConversationMessageRequest) => {
    const response = await apiService.post<IConversationMessageResponse>(
      `/chat/message`,
      body,
    );
    return response;
  },

  delete: async (body: IConversationDeleteRequest) => {
    const response = await apiService.delete<IConversationMessageResponse>(
      `${BASE_ENDPOINT}/${body.conversationId}`,
      {
        params: {
          ...body,
        },
      },
    );
    return response;
  },
};

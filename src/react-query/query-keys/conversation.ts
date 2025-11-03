import { IConversationByIdRequest, IConversationListRequest } from '@/dtos';

export const conversationKeys = {
  all: ['conversation'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (body: IConversationListRequest) =>
    [...conversationKeys.lists(), body] as const,
  byIds: () => [...conversationKeys.all, 'byId'] as const,
  byId: (body: IConversationByIdRequest) =>
    [...conversationKeys.byIds(), body] as const,
};

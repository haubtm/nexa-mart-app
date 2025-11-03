import { conversationApi } from '@/api';
import type {
  IConversationByIdRequest,
  IConversationListRequest,
} from '@/dtos';
import { useMutation, useQuery } from '@tanstack/react-query';
import { conversationKeys } from '../query-keys';

export const useConversationList = (body: IConversationListRequest) => {
  return useQuery({
    queryKey: conversationKeys.list(body),
    queryFn: async () => await conversationApi.list(body),
  });
};

export const useConversationById = (body: IConversationByIdRequest) => {
  return useQuery({
    queryKey: conversationKeys.byId(body),
    queryFn: async () => await conversationApi.byId(body),
  });
};

export const useConversationCreate = () => {
  return useMutation({
    mutationFn: conversationApi.create,
  });
};

export const useConversationChat = () => {
  return useMutation({
    mutationFn: conversationApi.chat,
  });
};

export const useConversationDelete = () => {
  return useMutation({
    mutationFn: conversationApi.delete,
  });
};

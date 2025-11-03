import { queryClient } from '@/providers/ReactQuery';
import {
  conversationKeys,
  useConversationCreate,
  useConversationDelete,
  useConversationList,
} from '@/react-query';
import { useAppSelector } from '@/redux/hooks';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

export default function ConversationListScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user).profile;
  console.log(user);
  const customerId = 2;

  const { data, isPending } = useConversationList({ customerId });
  const { mutateAsync: createConversation, isPending: creating } =
    useConversationCreate();
  const { mutateAsync: deleteConversation, isPending: deleting } =
    useConversationDelete();

  const list = data?.data ?? [];

  const onNewChat = async () => {
    const res = await createConversation(
      { customerId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: conversationKeys.all });
        },
      },
    );
    const id = res?.data?.id;
    if (id) router.push(`/chat/${id}`);
  };

  const onOpen = (id: string) => router.push(`/chat/${id}`);

  const onDelete = async (id: string) => {
    await deleteConversation(
      { customerId, conversationId: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: conversationKeys.all });
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-red-600 pt-12 pb-3 px-3">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <MaterialIcons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text className="text-white text-lg font-semibold">Trò chuyện</Text>
          <Pressable
            disabled={creating}
            onPress={onNewChat}
            className="px-3 h-10 rounded-full bg-white items-center justify-center"
          >
            <Text className="text-red-600 font-medium">Tạo mới</Text>
          </Pressable>
        </View>
      </View>

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(it) => it.id}
          ItemSeparatorComponent={() => <View className="h-px bg-zinc-100" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onOpen(item.id)}
              className="px-4 py-3 flex-row items-center justify-between"
            >
              <View className="flex-1 pr-3">
                <Text className="text-[15px] font-semibold" numberOfLines={1}>
                  {item.title || `Cuộc hội thoại #${item.id}`}
                </Text>
                {!!item.lastMessage && (
                  <Text className="text-[13px] text-zinc-500" numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                )}
              </View>
              <Pressable
                onPress={() => onDelete(item.id)}
                className="w-9 h-9 rounded-full bg-zinc-100 items-center justify-center"
              >
                <Feather name="trash-2" size={18} color="#111" />
              </Pressable>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

import { ESenderType } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import {
  conversationKeys,
  useConversationById,
  useConversationChat,
} from '@/react-query';
import { useAppSelector } from '@/redux/hooks';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ChatRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAppSelector((state) => state.user).profile;

  const customerId = 2;

  const { data, isPending } = useConversationById({
    conversationId: String(id),
    customerId,
  });
  const messages = data?.data ?? [];

  const { mutateAsync: chatWithConversation, isPending: sending } =
    useConversationChat();

  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const send = async () => {
    const value = text.trim();
    if (!value) return;
    setText('');

    await chatWithConversation(
      {
        customerId,
        conversationId: String(id),
        message: value,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: conversationKeys.all });
        },
      },
    );

    // kéo xuống cuối sau khi gửi
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const renderItem = ({ item }) => {
    const mine = item.senderType === ESenderType.USER;
    return (
      <View className={`px-4 py-1 ${mine ? 'items-end' : 'items-start'}`}>
        <View
          className={`max-w-[80%] rounded-2xl px-3 py-2 ${
            mine ? 'bg-red-600' : 'bg-zinc-100'
          }`}
        >
          <Text className={`${mine ? 'text-white' : 'text-zinc-900'}`}>
            {item.content}
          </Text>
        </View>
        <Text className="text-[11px] text-zinc-400 mt-1">
          {new Date(item.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
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
          <Text className="text-white text-lg font-semibold">Chat với AI</Text>
          <View className="w-10" />
        </View>
      </View>

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
          <FlatList
            ref={listRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(m) => String(m.id)}
            contentContainerStyle={{ paddingVertical: 8 }}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
          />

          {/* Input */}
          <View className="border-t border-zinc-200 px-3 py-2 flex-row items-center gap-6">
            <View className="flex-1 bg-zinc-100 rounded-full px-3">
              <TextInput
                placeholder="Nhập tin nhắn..."
                value={text}
                onChangeText={setText}
                className="h-11"
                multiline
              />
            </View>
            <Pressable
              disabled={sending || !text.trim()}
              onPress={send}
              className={`w-11 h-11 rounded-full items-center justify-center ${text.trim() ? 'bg-red-600' : 'bg-zinc-300'}`}
            >
              <Feather name="send" size={18} color="#fff" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

import { ProductCard } from '@/components/ProductCard';
import { PromotionCard } from '@/components/PromotionCard';
import { SuggestionCard } from '@/components/SuggestionCard';
import type { IChatMessage } from '@/dtos';
import { ESenderType } from '@/lib';
import { useConversationById, useConversationChat } from '@/react-query';
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

  const customerId = 2;

  const [text, setText] = useState('');
  const [optimisticMessages, setOptimisticMessages] = useState<IChatMessage[]>(
    [],
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const listRef = useRef<FlatList>(null);

  const { data, isPending, refetch } = useConversationById({
    conversationId: String(id),
    customerId,
  });

  // Type cast API returns array directly in data
  const allMessages = Array.isArray(data?.data) ? data.data : [];
  const messages: IChatMessage[] = [...allMessages, ...optimisticMessages];

  const { mutateAsync: chatWithConversation, isPending: sending } =
    useConversationChat();

  const send = async () => {
    const value = text.trim();
    if (!value) return;
    setText('');

    // Thêm user message vào optimistic
    const userMessage: IChatMessage = {
      id: Date.now(),
      senderType: ESenderType.USER,
      content: value,
      data: null,
      timestamp: new Date().toISOString(),
    };
    setOptimisticMessages((prev) => [...prev, userMessage]);

    // Thêm loading message
    const loadingMessage: IChatMessage = {
      id: Date.now() + 1,
      senderType: ESenderType.AI,
      content: 'Đang xử lý...',
      data: null,
      timestamp: new Date().toISOString(),
    };
    setOptimisticMessages((prev) => [...prev, loadingMessage]);

    // Kéo xuống cuối
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const response = await chatWithConversation({
        customerId,
        conversationId: String(id),
        message: value,
      });

      // Lấy suggestions từ response
      const newSuggestions = response?.data?.structuredData?.suggestions ?? [];
      setSuggestions(newSuggestions);

      // Xóa optimistic messages
      setOptimisticMessages([]);
      // Reload danh sách tin nhắn từ server
      refetch();
    } catch (error) {
      // Nếu lỗi, xóa optimistic messages
      setOptimisticMessages([]);
      setSuggestions([]);
    }

    // Kéo xuống cuối sau khi gửi xong
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setText(suggestion);
    // Auto-scroll khi focus vào input
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderItem = ({ item }: { item: IChatMessage }) => {
    const mine = item.senderType === ESenderType.USER;
    const isLoading = item.content === 'Đang xử lý...';

    return (
      <View className={`px-4 py-2 ${mine ? 'items-end' : 'items-start'}`}>
        {/* Tin nhắn */}
        <View
          className={`max-w-[85%] rounded-2xl px-3 py-2 ${
            mine ? 'bg-red-600' : 'bg-zinc-100'
          }`}
        >
          {isLoading ? (
            <View className="flex-row items-center gap-1">
              <ActivityIndicator
                size="small"
                color={mine ? '#fff' : '#111827'}
              />
              <Text className={`${mine ? 'text-white' : 'text-zinc-900'}`}>
                {item.content}
              </Text>
            </View>
          ) : (
            <Text className={`${mine ? 'text-white' : 'text-zinc-900'}`}>
              {item.content}
            </Text>
          )}
        </View>

        {/* Thời gian */}
        <Text className="text-[11px] text-zinc-400 mt-1">
          {new Date(item.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>

        {/* Hiển thị sản phẩm nếu có */}
        {!mine && item.data?.products && item.data.products.length > 0 && (
          <View className="mt-2 w-full">
            <FlatList
              scrollEnabled={false}
              data={item.data.products}
              keyExtractor={(p) => String(p.product_id)}
              renderItem={({ item: product }) => <ProductCard item={product} />}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          </View>
        )}

        {/* Hiển thị khuyến mãi nếu có */}
        {!mine && item.data?.promotions && item.data.promotions.length > 0 && (
          <View className="mt-2 w-full">
            {item.data.promotions.map((promo, idx) => (
              <PromotionCard key={idx} item={promo} />
            ))}
          </View>
        )}
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList<IChatMessage>
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

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <View className="border-t border-zinc-200 px-3 py-2">
              <Text className="text-[12px] text-zinc-500 mb-1">
                Gợi ý tiếp theo:
              </Text>
              <View className="max-h-32">
                {suggestions.map((suggestion, idx) => (
                  <SuggestionCard
                    key={`suggestion-${idx}`}
                    text={suggestion}
                    onPress={handleSuggestionPress}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Input */}
          <View className="border-t border-zinc-200 px-3 py-2 flex-row items-center gap-6">
            <View className="flex-1 bg-zinc-100 rounded-full px-3 max-h-20">
              <TextInput
                placeholder="Nhập tin nhắn..."
                value={text}
                onChangeText={setText}
                onFocus={() => {
                  // Auto-scroll xuống cuối khi focus vào input
                  setTimeout(
                    () => listRef.current?.scrollToEnd({ animated: true }),
                    150,
                  );
                }}
                className="h-11"
                multiline
                maxLength={500}
                scrollEnabled={true}
                placeholderTextColor="#a1a1a1"
              />
            </View>
            <Pressable
              disabled={
                sending || !text.trim() || optimisticMessages.length > 0
              }
              onPress={send}
              className={`w-11 h-11 rounded-full items-center justify-center ${text.trim() && optimisticMessages.length === 0 ? 'bg-red-600' : 'bg-zinc-300'}`}
            >
              {sending || optimisticMessages.length > 0 ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Feather name="send" size={18} color="#fff" />
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

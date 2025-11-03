import { useProductList } from '@/react-query';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

const debounce = (fn: (...args: any[]) => void, ms = 300) => {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export default function SearchScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [term, setTerm] = useState('');
  const debounced = useRef(
    debounce((v: string) => setTerm(v.trim()), 300),
  ).current;

  // Dùng useProductList để lấy gợi ý theo term (size nhỏ)
  const { data } = useProductList({
    page: 0,
    size: 10,
    searchTerm: term || undefined,
  });
  const suggestions = useMemo(() => {
    const products = data?.data?.products ?? [];
    return products.map(
      (p: any) => `${p.name}${p.brandName ? ' - ' + p.brandName : ''}`,
    );
  }, [data]);

  const goResults = (q: string) => {
    const query = encodeURIComponent(q.trim());
    router.push(`/search/results?query=${query}`);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="pt-12 px-4 pb-3 bg-red-600">
        <View className="bg-white rounded-full px-4 py-2">
          <TextInput
            value={text}
            onChangeText={(v) => {
              setText(v);
              debounced(v);
            }}
            placeholder="Nhập tên sản phẩm"
            returnKeyType="search"
            onSubmitEditing={() => text.trim() && goResults(text)}
            className="text-[16px]"
            autoFocus
          />
        </View>
      </View>
      <FlatList
        data={suggestions}
        keyExtractor={(s, i) => s + i}
        renderItem={({ item }) => (
          <Pressable
            className="px-4 py-3 border-b border-zinc-100"
            onPress={() => goResults(item.split(' - ')[0])}
          >
            <Text className="text-zinc-800">{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

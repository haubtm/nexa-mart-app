import type { IProductListRequest } from '@/dtos';
import {
  productKeys,
  useCartList,
  useProductList,
  useProductUnitById,
} from '@/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

type UnitCardItemR = {
  id: number;
  key: string;
  productId: number;
  name: string;
  unitName: string;
};

function ResultCard({ item }: { item: UnitCardItemR }) {
  const router = useRouter();
  const { data: unitData, isPending: unitLoading } = useProductUnitById({
    productUnitId: item.id,
  });

  const imgUrl = unitData?.data?.images?.find((i: any) => i.isPrimary)
    ?.productImage?.imageUrl;
  const salePrice = unitData?.data?.currentPrice;
  const unitName = unitData?.data?.unitName ?? item.unitName;
  const productName = unitData?.data?.productName ?? item.name;
  const productId = unitData?.data?.productId ?? item.productId;

  const openDetail = () => {
    router.push({
      pathname: '/detail',
      params: {
        productUnitId: String(item.id),
        productId: String(productId),
        productName,
        unitName,
      },
    });
  };

  return (
    <View className="bg-white rounded-2xl p-3 m-2 w-[48%] shadow-sm">
      <View className="w-full aspect-square items-center justify-center rounded-xl overflow-hidden bg-zinc-50">
        {unitLoading ? (
          <ActivityIndicator />
        ) : imgUrl ? (
          <Image
            source={{ uri: imgUrl }}
            resizeMode="contain"
            className="w-full h-full"
          />
        ) : (
          <Text className="text-zinc-400">No image</Text>
        )}
      </View>
      <View className="mt-2">
        <Text
          numberOfLines={2}
          className="text-[15px] font-medium text-zinc-900"
        >
          {productName}
        </Text>
        <Text className="text-[13px] text-zinc-500 mt-0.5">
          Đơn vị: {unitName}
        </Text>

        <View className="mt-1 h-5 justify-center">
          {unitLoading ? (
            <ActivityIndicator size="small" />
          ) : salePrice ? (
            <Text className="text-[15px] font-semibold text-red-600">
              {salePrice.toLocaleString('vi-VN')}₫
            </Text>
          ) : (
            <Text className="text-[13px] text-zinc-400 italic">
              Chưa có giá
            </Text>
          )}
        </View>

        <Pressable
          disabled={!salePrice}
          onPress={openDetail}
          className={`mt-2 py-2 rounded-full items-center ${!salePrice ? 'bg-zinc-300' : 'bg-red-600'}`}
        >
          <Text className="text-white font-semibold">Thêm vào giỏ</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function SearchResultsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { query: qParam } = useLocalSearchParams<{ query?: string }>();
  const initialTerm = decodeURIComponent(qParam ?? '');

  const [req, setReq] = useState<IProductListRequest>({
    page: 0,
    size: 12,
    searchTerm: initialTerm,
  });
  const { data, isPending, isFetching } = useProductList(req);

  const items: UnitCardItemR[] = useMemo(() => {
    const products = data?.data?.products ?? [];
    const arr: UnitCardItemR[] = [];
    for (const p of products)
      for (const u of p.units ?? [])
        arr.push({
          id: u.id!,
          key: `${p.id}-${u.id}`,
          productId: p.id,
          name: p.name,
          unitName: u.unitName,
        });
    return arr;
  }, [data]);
  const { data: cartData } = useCartList();
  const totalItems = cartData?.data?.totalItems ?? 0;
  const totalElements = data?.data?.pageInfo?.totalElements ?? 0;
  const canGrow = (req.size ?? 0) < totalElements;
  const handleEndReached = useCallback(() => {
    if (!canGrow || isFetching) return;
    setReq((prev) => ({
      ...prev,
      size: Math.min((prev.size ?? 0) + 12, totalElements),
    }));
  }, [canGrow, isFetching, totalElements]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <View className="flex-1 bg-zinc-100">
      <View className="pt-12 pb-3 px-4 bg-red-600 flex-row items-center justify-between">
        <Pressable
          className="bg-white rounded-full px-4 py-2"
          onPress={() => router.back()}
        >
          <Text>← {initialTerm}</Text>
        </Pressable>
        <Link href="/cart" asChild>
          <Pressable className="ml-3 relative">
            <Text className="text-white text-2xl">🛒</Text>
            {totalItems > 0 && (
              <View className="absolute -top-1 -right-2 bg-white rounded-full px-1.5">
                <Text className="text-red-600 text-[12px] font-bold">
                  {totalItems}
                </Text>
              </View>
            )}
          </Pressable>
        </Link>
      </View>
      {isPending && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingTop: 8,
            paddingBottom: 24,
          }}
          data={items}
          numColumns={2}
          keyExtractor={(it) => it.key}
          renderItem={({ item }) => <ResultCard item={item} />}
          onEndReachedThreshold={0.4}
          onEndReached={handleEndReached}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={
            isFetching && canGrow ? (
              <View className="py-4 items-center">
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

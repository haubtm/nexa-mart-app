import type { IProductListRequest } from '@/dtos';
import { useCartList, useProductList, useProductUnitById } from '@/react-query';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

export type UnitCardItem = {
  id: number;
  key: string;
  productId: number;
  name: string;
  unitName: string;
};

function ProductUnitCard({ item }: { item: UnitCardItem }) {
  const router = useRouter();
  const { data: unitData, isPending: unitLoading } = useProductUnitById({
    productUnitId: item.id,
  });
  const primaryImage = unitData?.data?.images?.find((img: any) => img.isPrimary)
    ?.productImage?.imageUrl;
  const salePrice = unitData?.data?.currentPrice;

  const goDetailPage = () => {
    router.push({
      pathname: '/product/[productUnitId]',
      params: { productUnitId: String(item.id) },
    });
  };

  const openAddSheet = () => {
    router.push({
      pathname: '/detail',
      params: {
        productUnitId: String(item.id),
        productId: String(unitData?.data?.productId ?? item.productId),
        productName: unitData?.data?.productName ?? item.name,
        unitName: unitData?.data?.unitName ?? item.unitName,
      },
    });
  };

  return (
    <View className="bg-white rounded-2xl p-3 m-2 w-[48%] shadow-sm relative">
      {/* Nhấn ảnh để vào trang chi tiết */}
      <Pressable
        onPress={goDetailPage}
        className="w-full aspect-square items-center justify-center rounded-xl overflow-hidden bg-zinc-50"
      >
        {unitLoading ? (
          <ActivityIndicator />
        ) : primaryImage ? (
          <Image
            source={{ uri: primaryImage }}
            resizeMode="contain"
            className="w-full h-full"
          />
        ) : (
          <Text className="text-zinc-400">No image</Text>
        )}
      </Pressable>

      {/* Nhấn tên cũng vào chi tiết */}
      <Pressable onPress={goDetailPage} className="mt-2">
        <Text
          numberOfLines={2}
          className="text-[15px] font-medium text-zinc-900"
        >
          {unitData?.data?.productName || item.name}
        </Text>
      </Pressable>

      <Text className="text-[13px] text-zinc-500 mt-0.5">
        Đơn vị: {unitData?.data?.unitName || item.unitName}
      </Text>

      <View className="mt-1 h-5 justify-center">
        {unitLoading ? (
          <ActivityIndicator size="small" />
        ) : salePrice ? (
          <Text className="text-[15px] font-semibold text-red-600">
            {salePrice.toLocaleString('vi-VN')}₫
          </Text>
        ) : (
          <Text className="text-[13px] text-zinc-400 italic">Chưa có giá</Text>
        )}
      </View>

      {/* Nút vẫn mở sheet modal '/detail' như ngoài list */}
      <Pressable
        disabled={!salePrice}
        onPress={openAddSheet}
        className={`mt-2 py-2 rounded-full items-center ${!salePrice ? 'bg-zinc-300' : 'bg-red-600'}`}
      >
        <Text className="text-white font-semibold">Thêm vào giỏ</Text>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState<IProductListRequest>({
    page: 0,
    size: 12,
    searchTerm: '',
  });
  const { data, isPending, isFetching } = useProductList(query);
  const { data: cartData } = useCartList();
  const totalItems = cartData?.data?.totalItems ?? 0;
  const unitItems: UnitCardItem[] = useMemo(() => {
    const products = data?.data?.products ?? [];
    const items: UnitCardItem[] = [];
    for (const p of products)
      for (const u of p.units ?? [])
        items.push({
          id: u.id!,
          key: `${p.id}-${u.id}`,
          productId: p.id,
          name: p.name,
          unitName: u.unitName,
        });
    return items;
  }, [data]);

  const totalElements = data?.data?.pageInfo?.totalElements ?? 0;
  const canGrow = (query.size ?? 0) < totalElements;
  const handleEndReached = useCallback(() => {
    if (!canGrow || isFetching) return;
    setQuery((prev) => ({
      ...prev,
      size: Math.min((prev.size ?? 0) + 12, totalElements),
    }));
  }, [canGrow, isFetching, totalElements]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await queryClient.invalidateQueries();
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <View className="flex-1 bg-zinc-100">
      <View className="pt-12 pb-3 px-4 bg-red-600 flex-row items-center">
        <Pressable
          className="flex-1 bg-white rounded-full px-4 py-2"
          onPress={() => router.push('/search')}
        >
          <Text className="text-[16px] text-zinc-500">
            Hi Hậu, bạn muốn tìm gì hôm nay
          </Text>
        </Pressable>
        <Link href="/cart" asChild>
          <Pressable className="ml-3 relative">
            <Feather
              className="ml-3 relative"
              name="shopping-cart"
              size={22}
              color="#fff"
            />
            {totalItems > 0 && (
              <View className="absolute -top-2 -right-3 bg-white rounded-full px-1.5">
                <Text className="text-red-600 text-[12px] font-bold">
                  {totalItems}
                </Text>
              </View>
            )}
          </Pressable>
        </Link>
      </View>

      {isPending && unitItems.length === 0 ? (
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
          data={unitItems}
          numColumns={2}
          keyExtractor={(it) => it.key}
          renderItem={({ item }) => <ProductUnitCard item={item} />}
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
      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', right: 16, bottom: 20 }}
      >
        <Pressable
          onPress={() => router.push('/chat')}
          className="w-20 h-20 rounded-full bg-red-600 items-center justify-center shadow"
          android_ripple={{ color: '#fff' }}
        >
          <MaterialCommunityIcons
            name="chat-processing-outline"
            size={40}
            color="#fff"
          />
        </Pressable>
      </View>
    </View>
  );
}

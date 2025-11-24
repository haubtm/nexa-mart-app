// app/detail.tsx
import { queryClient } from '@/providers/ReactQuery';
import { cartKeys, useCartCreate, useProductUnitById } from '@/react-query';
import { showToast } from '@/lib/utils/toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';

export default function DetailSheetScreen() {
  const router = useRouter();
  const { productUnitId, productId, productName, unitName } =
    useLocalSearchParams<{
      productUnitId: string;
      productId?: string;
      productName?: string;
      unitName?: string;
    }>();

  const id = Number(productUnitId);

  const { data: unitData, isPending: unitLoading } = useProductUnitById({
    productUnitId: id,
  });

  const img = unitData?.data?.images?.find((i: any) => i.isPrimary)
    ?.productImage?.imageUrl;
  const name = unitData?.data?.productName ?? productName ?? '';
  const uName = unitData?.data?.unitName ?? unitName ?? '';
  const salePrice = unitData?.data?.currentPrice ?? null;
  const stockQty = unitData?.data?.quantityOnHand ?? 0;

  const { mutateAsync: createCart, isPending: createLoading } = useCartCreate();

  const [qty, setQty] = useState(1);
  useEffect(() => setQty(1), [id]);

  const total = useMemo(
    () => (salePrice ? salePrice * qty : 0),
    [salePrice, qty],
  );
  const disabledMain = !salePrice || qty === 0 || createLoading;
  const plusDisabled = qty >= stockQty || !salePrice;

  const handleAdd = async () => {
    if (disabledMain) return;
    try {
      await createCart({ productUnitId: id, quantity: qty });
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      showToast.success(
        'Thêm thành công',
        `${name} (${qty}x) đã được thêm vào giỏ hàng`,
      );
      router.back();
    } catch (error) {
      showToast.error('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  const close = () => router.back();

  return (
    <View className="flex-1">
      {/* backdrop */}
      <Pressable className="absolute inset-0 bg-black/40" onPress={close} />
      {/* sheet */}
      <View className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl p-4">
        <View className="items-end">
          <Pressable onPress={close}>
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        <View className="items-center mt-1">
          <View className="w-40 h-40 items-center justify-center">
            {unitLoading ? (
              <ActivityIndicator />
            ) : img ? (
              <Image
                source={{ uri: img }}
                resizeMode="contain"
                className="w-full h-full"
              />
            ) : (
              <Text>No image</Text>
            )}
          </View>
          <Text className="mt-2 text-center text-lg font-medium">
            {name} - {uName}
          </Text>
          <View className="mt-1 h-6 justify-center">
            {unitLoading ? (
              <ActivityIndicator />
            ) : salePrice ? (
              <Text className="text-xl font-semibold text-orange-500">
                {salePrice.toLocaleString('vi-VN')}đ
              </Text>
            ) : (
              <Text className="text-sm text-zinc-400 italic">Chưa có giá</Text>
            )}
          </View>
        </View>

        <View className="mt-4 flex-row items-center gap-3">
          {qty > 0 && (
            <Pressable
              onPress={() => setQty(Math.max(0, qty - 1))}
              className="w-12 h-12 rounded-full bg-zinc-100 items-center justify-center"
            >
              <Text className="text-2xl">−</Text>
            </Pressable>
          )}
          <Text className="text-xl w-10 text-center">{qty}</Text>
          <Pressable
            disabled={plusDisabled}
            onPress={() => setQty((q) => Math.min(stockQty, q + 1))}
            className={`w-12 h-12 rounded-full items-center justify-center ${plusDisabled ? 'bg-zinc-200' : 'bg-zinc-100'}`}
          >
            <Text className="text-2xl">＋</Text>
          </Pressable>

          {qty > 0 && (
            <Pressable
              disabled={disabledMain}
              onPress={handleAdd}
              className={`flex-1 h-12 rounded-full items-center justify-center ${disabledMain ? 'bg-zinc-300' : 'bg-red-600'}`}
            >
              {createLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">
                  THÊM VÀO GIỎ HÀNG
                </Text>
              )}
            </Pressable>
          )}
        </View>

        <View className="mt-2">
          <Text className="text-xs text-zinc-500">Tồn kho: {stockQty}</Text>
        </View>
      </View>
    </View>
  );
}

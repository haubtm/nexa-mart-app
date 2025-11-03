import { queryClient } from '@/providers/ReactQuery';
import {
  cartKeys,
  useCartDelete,
  useCartDeleteProduct,
  useCartList,
  useCartUpdate,
} from '@/react-query';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

export default function CartScreen() {
  const router = useRouter();

  const { data, isPending } = useCartList();
  const { mutateAsync: updateCart, isPending: updating } = useCartUpdate();
  const { mutateAsync: clearAll, isPending: clearing } = useCartDelete();
  const { mutateAsync: deleteLine, isPending: deleting } =
    useCartDeleteProduct();

  const cart = data?.data;
  const items = cart?.items ?? [];

  const totals = useMemo(() => {
    const sub = cart?.subTotal ?? 0;
    const lineDiscount = cart?.lineItemDiscount ?? 0;
    const orderDiscount = cart?.orderDiscount ?? 0;
    const payable = cart?.totalPayable ?? 0;
    return { sub, lineDiscount, orderDiscount, payable };
  }, [cart]);

  // Loading theo từng dòng khi +/−
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const inc = async (id: number, cur: number, stock: number) => {
    const next = Math.min(cur + 1, stock);
    try {
      setUpdatingId(id);
      await updateCart({ productUnitId: id, quantity: next });
    } finally {
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      setUpdatingId(null);
    }
  };

  const dec = async (id: number, cur: number) => {
    const next = Math.max(cur - 1, 0);
    try {
      setUpdatingId(id);
      await updateCart({ productUnitId: id, quantity: next });
    } finally {
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      setUpdatingId(null);
    }
  };

  const remove = async (id: number) => {
    await deleteLine({ productUnitId: id });
    await queryClient.invalidateQueries({ queryKey: cartKeys.all });
  };

  const removeAll = async () => {
    Alert.alert('Xoá giỏ hàng', 'Bạn có chắc muốn xoá tất cả sản phẩm?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await clearAll();
          await queryClient.invalidateQueries({ queryKey: cartKeys.all });
        },
      },
    ]);
  };

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  const EmptyState = () => (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-12 pb-3 bg-red-600 flex-row items-center justify-between">
        <Text className="text-white text-xl font-semibold">Giỏ hàng</Text>
      </View>

      <View className="flex-1 items-center justify-center px-10">
        <View className="w-20 h-20 rounded-full bg-zinc-100 items-center justify-center mb-4">
          <Text className="text-3xl text-zinc-400">＋</Text>
        </View>
        <Text className="text-[18px] text-zinc-700 mb-4">Chưa có sản phẩm</Text>

        <Pressable
          onPress={() => router.push('/')}
          className="px-6 py-3 rounded-2xl bg-red-600"
        >
          <Text className="text-white font-semibold">THÊM SẢN PHẨM</Text>
        </Pressable>
      </View>
    </View>
  );

  if (!items.length || (cart?.totalItems ?? 0) === 0) {
    return <EmptyState />;
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="px-4 pt-12 pb-3 bg-red-600 flex-row items-center justify-between">
        <Text className="text-white text-xl font-semibold">
          Giỏ hàng của bạn ({cart?.totalItems ?? 0})
        </Text>
        <Pressable
          onPress={removeAll}
          className="px-3 py-2 rounded-full bg-white"
          disabled={clearing}
        >
          <Text className="text-red-600 font-medium">Xoá tất cả</Text>
        </Pressable>
      </View>

      {/* CONTENT (scroll) */}
      <View className="flex-1">
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.lineItemId)}
          ItemSeparatorComponent={() => <View className="h-px bg-zinc-100" />}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => {
            const discounted =
              (item.finalTotal ?? item.originalTotal) < item.originalTotal;

            // Dòng quà tặng (tặng miễn phí 100%) → ẩn controls
            const isGiftLine =
              !!item.promotionApplied &&
              item.promotionApplied.discountType === 'percentage' &&
              item.promotionApplied.discountValue === 100;

            const canPlus =
              !isGiftLine && item.quantity < (item.stockQuantity ?? 0);
            const canMinus = !isGiftLine && item.quantity > 0;

            const rowBusy = updatingId === item.productUnitId;

            return (
              <View className="px-4 py-3 flex-row gap-3 items-center">
                <View className="w-16 h-16 bg-zinc-50 rounded-xl items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      resizeMode="contain"
                      className="w-full h-full"
                    />
                  ) : (
                    <Text className="text-zinc-400">No image</Text>
                  )}
                </View>

                <View className="flex-1">
                  <Text className="font-medium" numberOfLines={1}>
                    {item.productName} - {item.unitName}
                  </Text>

                  <View className="flex-row items-center gap-2">
                    {discounted && (
                      <Text className="text-zinc-400 line-through">
                        {item.originalTotal.toLocaleString('vi-VN')}đ
                      </Text>
                    )}
                    <Text className="text-orange-600 font-semibold">
                      {(item.finalTotal ?? item.originalTotal).toLocaleString(
                        'vi-VN',
                      )}
                      đ
                    </Text>
                  </View>

                  {item.promotionApplied?.promotionSummary && (
                    <Text className="text-xs text-teal-700 mt-1">
                      🎁 {item.promotionApplied.promotionSummary}
                    </Text>
                  )}
                </View>

                {/* Quantity controls: ẨN nếu là quà tặng */}
                {!isGiftLine ? (
                  <View className="flex-row items-center gap-2">
                    {canMinus && (
                      <Pressable
                        disabled={updating || rowBusy}
                        onPress={() => dec(item.productUnitId, item.quantity)}
                        className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center"
                      >
                        <Text>−</Text>
                      </Pressable>
                    )}

                    {rowBusy ? (
                      <View className="w-6 items-center">
                        <ActivityIndicator />
                      </View>
                    ) : (
                      <Text className="w-6 text-center">{item.quantity}</Text>
                    )}

                    <Pressable
                      disabled={updating || rowBusy || !canPlus}
                      onPress={() =>
                        inc(
                          item.productUnitId,
                          item.quantity,
                          item.stockQuantity ?? 0,
                        )
                      }
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        canPlus ? 'bg-zinc-100' : 'bg-zinc-200'
                      }`}
                    >
                      <Text>＋</Text>
                    </Pressable>

                    <Pressable
                      disabled={deleting || rowBusy}
                      onPress={() => remove(item.productUnitId)}
                      className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center ml-1"
                    >
                      <Text>🗑️</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View className="px-2 py-1 rounded-full bg-zinc-100">
                    <Text className="text-zinc-700">x{item.quantity}</Text>
                  </View>
                )}
              </View>
            );
          }}
        />
      </View>

      {/* FOOTER (tự co giãn theo nội dung, luôn ở đáy) */}
      <View className="border-t border-zinc-200 bg-white px-4 pt-3 pb-4">
        <View className="bg-zinc-50 rounded-2xl p-3">
          <Row
            label="Tạm tính"
            value={`${totals.sub.toLocaleString('vi-VN')}đ`}
          />
          {!!totals.orderDiscount && (
            <Row
              label="Khuyến mãi hoá đơn"
              value={`−${totals.orderDiscount.toLocaleString('vi-VN')}đ`}
              highlight
            />
          )}
          <Row
            label="Tổng tiền"
            value={`${totals.payable.toLocaleString('vi-VN')}đ`}
            bold
          />
        </View>

        {(cart?.appliedOrderPromotions?.length ?? 0) > 0 && (
          <View className="mt-3 border border-orange-200 rounded-2xl p-3">
            {cart!.appliedOrderPromotions!.map((p, idx) => (
              <Text key={idx} className="text-xs text-orange-700">
                % {p.promotionSummary}
              </Text>
            ))}
          </View>
        )}

        <Pressable className="mt-3 h-12 rounded-full bg-red-600 items-center justify-center">
          <Text className="text-white font-semibold">
            ĐẶT HÀNG {totals.payable.toLocaleString('vi-VN')}đ
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text className={`text-zinc-700 ${bold ? 'font-semibold' : ''}`}>
        {label}
      </Text>
      <Text
        className={`${bold ? 'font-semibold text-zinc-900' : ''} ${highlight ? 'text-teal-700' : ''}`}
      >
        {value}
      </Text>
    </View>
  );
}

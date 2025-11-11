import { EPaymentMethod, orderStatusMap, paymentStatusMap } from '@/lib';
import { useOrderById } from '@/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const money = (n?: number | null) => (n ?? 0).toLocaleString('vi-VN') + 'đ';

export function Badge({ text }: { text: string }) {
  return (
    <View className="px-2 py-1 rounded-full bg-white/10 border border-white/30">
      <Text className="text-white text-xs">{text}</Text>
    </View>
  );
}

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Number(id);

  const { data: orderData, isPending: orderPending } = useOrderById({
    orderId,
  } as any);
  const order = orderData?.data;

  if (orderPending) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-100">
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-100">
        <Text>Không tìm thấy đơn hàng</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-zinc-100"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header đỏ theo theme Home */}
      <View className="px-4 pt-12 pb-4 bg-red-600">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">
              Đơn hàng #{order.orderCode || order.orderId}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/')}
            className="ml-2 p-2"
          >
            <MaterialIcons name="home" size={24} color="white" />
          </Pressable>
        </View>
        <View className="mt-2 flex-row gap-2">
          <Badge text={orderStatusMap[order.orderStatus]} />
        </View>
        {!!order.createdAt && (
          <Text className="text-white/80 mt-1">
            Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
          </Text>
        )}
      </View>

      {/* Customer & delivery */}
      <View className="mx-4 -mt-4 p-4 bg-white rounded-2xl border border-zinc-200 shadow-xs">
        <Text className="font-semibold mb-1">Thông tin khách hàng</Text>
        <Text>
          {order.customerInfo?.customerName} — {order.customerInfo?.phoneNumber}
        </Text>
        {!!order.deliveryInfo?.deliveryAddress && (
          <Text className="text-zinc-600 mt-1">
            {order.deliveryInfo.deliveryAddress}
          </Text>
        )}
      </View>

      {/* Items */}
      <View className="mx-4 mt-4 p-4 bg-white rounded-2xl border border-zinc-200">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-semibold">Sản phẩm</Text>
          <Text className="text-zinc-500">SL</Text>
        </View>
        <FlatList
          scrollEnabled={false}
          data={order.orderItems}
          keyExtractor={(_, idx) => String(idx)}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-zinc-100 my-2" />
          )}
          renderItem={({ item }) => (
            <View className="flex-row items-start gap-3">
              {/* Ảnh sản phẩm */}
              {item.imageUrl ? (
                <View className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-50">
                  <Image
                    source={{ uri: item.imageUrl }}
                    resizeMode="contain"
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              ) : (
                <View className="w-20 h-20 rounded-lg bg-zinc-100 items-center justify-center">
                  <Text className="text-zinc-400 text-xs">No image</Text>
                </View>
              )}

              {/* Thông tin sản phẩm */}
              <View className="flex-1">
                <Text className="font-medium">
                  {item.productName} • {item.unitName}
                </Text>
                {!!item.promotionInfo && (
                  <Text className="text-xs text-teal-700 mt-1">
                    🎁 {item.promotionInfo}
                  </Text>
                )}

                {/* Giá và SL */}
                <View className="mt-2 flex-row items-center justify-between">
                  <View>
                    {item.discountAmount ? (
                      <>
                        <Text className="text-zinc-400 line-through text-xs">
                          {money(item.originalPrice)}
                        </Text>
                        <Text className="font-semibold text-orange-600">
                          {money(item.originalPrice - item.discountAmount)}
                        </Text>
                      </>
                    ) : (
                      <Text className="font-semibold">
                        {money(item.originalPrice)}
                      </Text>
                    )}
                  </View>
                  <Text className="text-zinc-500 text-sm">SL: {item.quantity}</Text>
                </View>
              </View>
            </View>
          )}
        />

        <View className="mt-3 items-end">
          <Text className="text-zinc-500">
            Tạm tính: {money(order.subtotal)}
          </Text>
          {!!order.totalDiscount && (
            <Text className="text-teal-700">
              Giảm giá: −{money(order.totalDiscount)}
            </Text>
          )}
          {!!order.shippingFee && (
            <Text className="text-zinc-500">
              Phí vận chuyển: {money(order.shippingFee)}
            </Text>
          )}
          <Text className="text-lg font-semibold mt-1">
            Tổng tiền: {money(order.totalAmount)}
          </Text>
        </View>
      </View>

      {/* Applied promotions */}
      {!!order.appliedPromotions?.length && (
        <View className="mx-4 mt-4 p-4 bg-white rounded-2xl border border-emerald-200">
          <Text className="font-semibold mb-2">Khuyến mãi áp dụng</Text>
          {order.appliedPromotions.map((p: any, idx: number) => (
            <Text key={idx} className="text-sm text-emerald-700">
              • {p.promotionSummary}
            </Text>
          ))}
        </View>
      )}

      {/* Payment summary */}
      <View className="mx-4 mt-4 p-4 bg-white rounded-2xl border border-zinc-200">
        <Text className="font-semibold mb-2">Thanh toán</Text>
        <Text className="text-zinc-700">
          Phương thức:{' '}
          {order.paymentMethod === EPaymentMethod.CASH
            ? 'Tiền mặt'
            : 'Chuyển khoản'}
        </Text>
        <Text className="text-zinc-700">
          Trạng thái: {paymentStatusMap[order.paymentStatus]}
        </Text>
        {!!order.amountPaid && (
          <Text className="text-zinc-700">
            Đã thanh toán: {money(order.amountPaid)}
          </Text>
        )}
        {!!order.changeAmount && (
          <Text className="text-zinc-700">
            Tiền trả lại: {money(order.changeAmount)}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

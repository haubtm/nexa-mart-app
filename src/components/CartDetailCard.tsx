import type { IStructuredCartData } from '@/dtos';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';

interface CartDetailCardProps {
  cart: IStructuredCartData;
}

const money = (n?: number | null) => (n ?? 0).toLocaleString('vi-VN') + 'đ';

export function CartDetailCard({ cart }: CartDetailCardProps) {
  return (
    <View className="bg-white rounded-lg p-4 m-2 shadow-sm border border-zinc-200">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-[12px] text-zinc-500 mb-0.5">Giỏ hàng</Text>
          <Text className="text-[14px] font-semibold text-zinc-900">
            {cart.total_items} sản phẩm
          </Text>
        </View>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        scrollEnabled={false}
        data={cart.items}
        keyExtractor={(_, idx) => String(idx)}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-zinc-100 my-2" />
        )}
        renderItem={({ item }) => (
          <View className="flex-row items-start gap-3 py-2">
            {/* Ảnh sản phẩm */}
            {item.image_url ? (
              <View className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-50">
                <Image
                  source={{ uri: item.image_url }}
                  resizeMode="contain"
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            ) : (
              <View className="w-16 h-16 rounded-lg bg-zinc-100 items-center justify-center">
                <MaterialIcons name="image" size={20} color="#d4d4d8" />
              </View>
            )}

            {/* Thông tin sản phẩm */}
            <View className="flex-1">
              <View className="flex-row items-start justify-between mb-1">
                <Text className="text-[13px] font-semibold text-zinc-900 flex-1">
                  {item.product_name}
                </Text>
                <Text className="text-[11px] text-zinc-500 ml-1">
                  x{item.quantity}
                </Text>
              </View>

              <Text className="text-[11px] text-zinc-600 mb-1.5">
                {item.unit_name}
              </Text>

              {item.promotion_name && (
                <Text className="text-[10px] text-emerald-700 mb-1">
                  🎁 {item.promotion_name}
                </Text>
              )}

              {/* Giá */}
              <View className="flex-row items-baseline gap-1">
                <Text className="text-[12px] font-semibold text-zinc-900">
                  {money(item.final_total)}
                </Text>
                {item.original_total > item.final_total && (
                  <Text className="text-[10px] text-zinc-400 line-through">
                    {money(item.original_total)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      />

      {/* Divider */}
      <View className="h-px bg-zinc-100 my-3" />

      {/* Thông tin tiền */}
      <View className="space-y-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-[12px] text-zinc-600">Tạm tính:</Text>
          <Text className="text-[12px] text-zinc-900">
            {money(cart.sub_total)}
          </Text>
        </View>

        {cart.line_item_discount > 0 && (
          <View className="flex-row items-center justify-between">
            <Text className="text-[12px] text-zinc-600">Giảm sản phẩm:</Text>
            <Text className="text-[12px] text-emerald-700 font-semibold">
              −{money(cart.line_item_discount)}
            </Text>
          </View>
        )}

        {cart.order_discount > 0 && (
          <View className="flex-row items-center justify-between">
            <Text className="text-[12px] text-zinc-600">Giảm đơn hàng:</Text>
            <Text className="text-[12px] text-emerald-700 font-semibold">
              −{money(cart.order_discount)}
            </Text>
          </View>
        )}

        {(cart.line_item_discount > 0 || cart.order_discount > 0) && (
          <View className="h-px bg-zinc-100 my-1" />
        )}

        <View className="flex-row items-center justify-between pt-1">
          <Text className="text-[13px] font-semibold text-zinc-900">
            Tổng cộng:
          </Text>
          <Text className="text-[14px] font-bold text-red-600">
            {money(cart.total_payable)}
          </Text>
        </View>
      </View>

      {/* Cập nhật lần cuối */}
      <Text className="text-[10px] text-zinc-500 mt-2.5 text-right">
        Cập nhật: {new Date(cart.updated_at).toLocaleDateString('vi-VN')}
      </Text>
    </View>
  );
}

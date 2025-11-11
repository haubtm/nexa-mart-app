import type { IStructuredPromotionData } from '@/dtos';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface PromotionCardProps {
  item: IStructuredPromotionData;
}

export function PromotionCard({ item }: PromotionCardProps) {
  const isExpired = new Date(item.end_date) < new Date();

  return (
    <View className="bg-orange-50 border border-orange-200 rounded-lg p-4 m-2 shadow-sm">
      {/* Header */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-[16px] font-bold text-orange-900">
            {item.name}
          </Text>
          <Text className="text-[13px] text-orange-700 mt-0.5">
            {item.type}
          </Text>
        </View>
        {isExpired && (
          <View className="bg-red-600 rounded px-2 py-1 ml-2">
            <Text className="text-white text-[11px] font-bold">Hết hạn</Text>
          </View>
        )}
      </View>

      {/* Mô tả */}
      {item.description && (
        <Text className="text-[13px] text-zinc-700 mb-3">
          {item.description}
        </Text>
      )}

      {/* Điều kiện */}
      <View className="bg-white rounded p-3 mb-3">
        <View className="flex-row items-start">
          <MaterialIcons
            name="info"
            size={16}
            color="#111827"
            style={{ marginTop: 2, marginRight: 8 }}
          />
          <Text className="flex-1 text-[12px] text-zinc-800 leading-5">
            {item.conditions}
          </Text>
        </View>
      </View>

      {/* Thời gian */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-[11px] text-zinc-500">
            Từ: {new Date(item.start_date).toLocaleDateString('vi-VN')}
          </Text>
          <Text className="text-[11px] text-zinc-500">
            Đến: {new Date(item.end_date).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        {item.discount_value && (
          <View className="bg-red-600 rounded-lg px-3 py-2 ml-3">
            <Text className="text-white text-[15px] font-bold">
              -{item.discount_value}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

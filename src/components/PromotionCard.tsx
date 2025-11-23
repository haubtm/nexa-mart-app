import type { IStructuredPromotionData } from '@/dtos';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface PromotionCardProps {
  item: IStructuredPromotionData;
}

const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'BUY_X_GET_Y':
      return 'Mua Tặng';
    case 'PRODUCT_DISCOUNT':
      return 'Giảm Sản Phẩm';
    case 'ORDER_DISCOUNT':
      return 'Giảm Đơn Hàng';
    default:
      return type;
  }
};

const getDiscountDisplay = (item: IStructuredPromotionData): string => {
  if (item.buy_x_get_y_detail?.gift_discount_type === 'FREE') {
    return 'Tặng miễn phí';
  }
  if (item.product_discount_detail?.discount_type === 'PERCENTAGE') {
    return `${item.product_discount_detail.discount_value}%`;
  }
  if (item.product_discount_detail?.discount_type === 'FIXED_AMOUNT') {
    return `${item.product_discount_detail.discount_value.toLocaleString('vi-VN')}đ`;
  }
  if (item.order_discount_detail?.discount_type === 'PERCENTAGE') {
    return `${item.order_discount_detail.discount_value}%`;
  }
  if (item.order_discount_detail?.discount_type === 'FIXED_AMOUNT') {
    return `${item.order_discount_detail.discount_value.toLocaleString('vi-VN')}đ`;
  }
  if (item.buy_x_get_y_detail?.gift_discount_type === 'FIXED_AMOUNT') {
    return `${item.buy_x_get_y_detail.gift_discount_value?.toLocaleString('vi-VN')}đ`;
  }
  return '';
};

const getConditionText = (item: IStructuredPromotionData): string => {
  if (item.buy_x_get_y_detail) {
    return `Mua ${item.buy_x_get_y_detail.buy_min_quantity} ${item.buy_x_get_y_detail.buy_product_name} tặng ${item.buy_x_get_y_detail.gift_quantity} ${item.buy_x_get_y_detail.gift_product_name}`;
  }
  if (item.product_discount_detail) {
    return `Giảm ${item.product_discount_detail.discount_value}${item.product_discount_detail.discount_type === 'PERCENTAGE' ? '%' : 'đ'} cho ${item.product_discount_detail.apply_to_product_name} khi mua từ ${item.product_discount_detail.min_order_value.toLocaleString('vi-VN')}đ`;
  }
  if (item.order_discount_detail) {
    return `Giảm ${item.order_discount_detail.discount_value}${item.order_discount_detail.discount_type === 'PERCENTAGE' ? '%' : 'đ'} (tối đa ${item.order_discount_detail.max_discount.toLocaleString('vi-VN')}đ) khi mua từ ${item.order_discount_detail.min_order_value.toLocaleString('vi-VN')}đ`;
  }
  return item.description;
};

export function PromotionCard({ item }: PromotionCardProps) {
  const isExpired = new Date(item.end_date) < new Date();
  const discountDisplay = getDiscountDisplay(item);
  const conditionText = getConditionText(item);

  return (
    <View className="bg-orange-50 border border-orange-200 rounded-lg p-4 m-2 shadow-sm">
      {/* Header */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-[14px] font-bold text-orange-900">
            {item.summary}
          </Text>
          <Text className="text-[12px] text-orange-700 mt-0.5">
            {getTypeLabel(item.type)}
          </Text>
        </View>
        {isExpired && (
          <View className="bg-red-600 rounded px-2 py-1 ml-2">
            <Text className="text-white text-[10px] font-bold">Hết hạn</Text>
          </View>
        )}
      </View>

      {/* Điều kiện */}
      <View className="bg-white rounded p-3 mb-3">
        <View className="flex-row items-start">
          <MaterialIcons
            name="local-offer"
            size={14}
            color="#ea580c"
            style={{ marginTop: 2, marginRight: 6 }}
          />
          <Text className="flex-1 text-[12px] text-zinc-800 leading-5">
            {conditionText}
          </Text>
        </View>
      </View>

      {/* Thời gian & Giảm giá */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-[11px] text-zinc-500">
            Từ: {new Date(item.start_date).toLocaleDateString('vi-VN')}
          </Text>
          <Text className="text-[11px] text-zinc-500">
            Đến: {new Date(item.end_date).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        {discountDisplay && (
          <View className="bg-red-600 rounded-lg px-3 py-2 ml-3">
            <Text className="text-white text-[13px] font-bold">
              {discountDisplay}
            </Text>
          </View>
        )}
      </View>

      {/* Sử dụng */}
      {item.usage_limit && (
        <Text className="text-[10px] text-zinc-500 mt-2 text-right">
          Đã dùng: {item.usage_count}/{item.usage_limit}
        </Text>
      )}
    </View>
  );
}

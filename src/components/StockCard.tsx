import type { IStructuredStockData } from '@/dtos';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface StockCardProps {
  item: IStructuredStockData;
}

const getStockStatus = (
  quantity: number,
  status: string,
): { color: string; icon: string } => {
  if (quantity === 0 || status.toLowerCase() === 'hết hàng') {
    return { color: '#991b1b', icon: 'close-circle' };
  }
  if (quantity < 10) {
    return { color: '#ea580c', icon: 'warning' };
  }
  return { color: '#166534', icon: 'check-circle' };
};

const getStockLabel = (quantity: number): string => {
  if (quantity === 0) return 'Hết hàng';
  if (quantity < 10) return 'Sắp hết';
  if (quantity < 50) return 'Còn ít';
  return 'Còn hàng';
};

export function StockCard({ item }: StockCardProps) {
  const stockInfo = getStockStatus(item.quantity, item.status);
  const stockLabel = getStockLabel(item.quantity);

  return (
    <View className="bg-white rounded-lg p-4 m-2 shadow-sm border border-zinc-200">
      {/* Header: Tên sản phẩm & Trạng thái */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-[13px] text-zinc-500 mb-0.5">Sản phẩm</Text>
          <Text className="text-[14px] font-semibold text-zinc-900">
            {item.product_name}
          </Text>
          {item.product_code && (
            <Text className="text-[11px] text-zinc-500 mt-1">
              Mã: {item.product_code}
            </Text>
          )}
        </View>
        <View
          className="px-2.5 py-1.5 rounded-full flex-row items-center gap-1"
          style={{ backgroundColor: `${stockInfo.color}20` }}
        >
          <MaterialIcons
            name={stockInfo.icon as any}
            size={14}
            color={stockInfo.color}
          />
          <Text
            className="text-[11px] font-semibold"
            style={{ color: stockInfo.color }}
          >
            {stockLabel}
          </Text>
        </View>
      </View>

      {/* Tồn kho */}
      <View className="bg-zinc-50 rounded-lg p-3 mb-3">
        <View className="flex-row items-baseline gap-2">
          <Text className="text-[12px] text-zinc-600">Tồn kho:</Text>
          <Text className="text-[16px] font-bold text-zinc-900">
            {item.quantity}
          </Text>
          <Text className="text-[12px] text-zinc-600">{item.unit}</Text>
        </View>
      </View>

      {/* Trạng thái kho */}
      <View className="flex-row items-center gap-2 mb-2">
        <MaterialIcons name="inventory-2" size={14} color="#6b7280" />
        <Text className="text-[12px] text-zinc-700">{item.status}</Text>
      </View>

      {/* Vị trí kho */}
      {item.warehouse_location && (
        <View className="flex-row items-start gap-2 mb-2">
          <MaterialIcons
            name="location-on"
            size={14}
            color="#6b7280"
            style={{ marginTop: 1 }}
          />
          <Text className="flex-1 text-[12px] text-zinc-700">
            {item.warehouse_location}
          </Text>
        </View>
      )}

      {/* Ghi chú */}
      {item.note && (
        <View className="flex-row items-start gap-2 pt-2 border-t border-zinc-100 mt-2">
          <MaterialIcons
            name="note"
            size={14}
            color="#6b7280"
            style={{ marginTop: 1 }}
          />
          <Text className="flex-1 text-[11px] text-zinc-600 italic">
            {item.note}
          </Text>
        </View>
      )}
    </View>
  );
}

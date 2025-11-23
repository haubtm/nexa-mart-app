import type { IStructuredOrderData } from '@/dtos';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface OrderCardProps {
  item: IStructuredOrderData;
}

const getStatusColor = (
  status: string,
): { bg: string; text: string; icon: string } => {
  switch (status.toLowerCase()) {
    case 'chưa thanh toán':
      return { bg: '#fed7aa', text: '#92400e', icon: 'schedule' };
    case 'đang xử lý':
    case 'pending':
      return { bg: '#fef3c7', text: '#92400e', icon: 'pending' };
    case 'đã chuẩn bị':
    case 'prepared':
      return { bg: '#cffafe', text: '#164e63', icon: 'done' };
    case 'đang giao hàng':
    case 'shipping':
      return { bg: '#dbeafe', text: '#1e3a8a', icon: 'local-shipping' };
    case 'đã giao hàng':
    case 'delivered':
      return { bg: '#dcfce7', text: '#166534', icon: 'done-all' };
    case 'hoàn thành':
    case 'completed':
      return { bg: '#dcfce7', text: '#166534', icon: 'verified' };
    case 'đã hủy':
    case 'cancelled':
      return { bg: '#fee2e2', text: '#991b1b', icon: 'cancel' };
    default:
      return { bg: '#f3f4f6', text: '#374151', icon: 'info' };
  }
};

const getDeliveryLabel = (method: string | null): string => {
  if (!method) return 'Chưa xác định';
  if (method === 'PICKUP_AT_STORE') return 'Lấy tại cửa hàng';
  if (method.includes('Giao')) return method;
  return method;
};

const money = (n?: number | null) => (n ?? 0).toLocaleString('vi-VN') + 'đ';

export function OrderCard({ item }: OrderCardProps) {
  const router = useRouter();
  const statusInfo = getStatusColor(item.status);

  const handlePress = () => {
    if (item.order_id) {
      router.push(`/orders/${item.order_id}`);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View className="bg-white rounded-lg p-4 m-2 shadow-sm border border-zinc-200">
        {/* Header: Mã đơn & Trạng thái */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-[12px] text-zinc-500 mb-0.5">
              Mã đơn hàng
            </Text>
            <Text className="text-[14px] font-semibold text-zinc-900">
              {item.order_code}
            </Text>
          </View>
          <View
            className="px-3 py-1.5 rounded-full flex-row items-center gap-1"
            style={{ backgroundColor: statusInfo.bg }}
          >
            <MaterialIcons
              name={statusInfo.icon as any}
              size={14}
              color={statusInfo.text}
            />
            <Text
              className="text-[12px] font-semibold"
              style={{ color: statusInfo.text }}
            >
              {item.status}
            </Text>
          </View>
        </View>

        {/* Ngày đặt hàng */}
        <View className="flex-row items-center gap-2 mb-2.5">
          <MaterialIcons name="calendar-today" size={14} color="#6b7280" />
          <Text className="text-[11px] text-zinc-600">
            {new Date(item.order_date).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Phương thức giao hàng */}
        {item.delivery_method && (
          <View className="flex-row items-center gap-2 mb-2.5">
            <MaterialIcons name="local-shipping" size={14} color="#6b7280" />
            <Text className="text-[11px] text-zinc-600">
              {getDeliveryLabel(item.delivery_method)}
            </Text>
          </View>
        )}

        {/* Địa chỉ giao hàng */}
        {item.delivery_address && (
          <View className="flex-row items-start gap-2 mb-3">
            <MaterialIcons
              name="location-on"
              size={14}
              color="#6b7280"
              style={{ marginTop: 1 }}
            />
            <Text className="flex-1 text-[11px] text-zinc-600">
              {item.delivery_address}
            </Text>
          </View>
        )}

        {/* Divider */}
        <View className="h-px bg-zinc-100 my-2.5" />

        {/* Tổng tiền */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[12px] text-zinc-600">Tổng cộng:</Text>
          <Text className="text-[14px] font-bold text-red-600">
            {money(item.total_amount)}
          </Text>
        </View>

        {/* Tap để xem chi tiết */}
        {item.order_id && (
          <Text className="text-[10px] text-blue-600 mt-2 text-right font-medium">
            Tap để xem chi tiết →
          </Text>
        )}
      </View>
    </Pressable>
  );
}

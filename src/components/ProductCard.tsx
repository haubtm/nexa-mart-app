import type { IStructuredProductData } from '@/dtos';
import { useRouter } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

interface ProductCardProps {
  item: IStructuredProductData;
}

export function ProductCard({ item }: ProductCardProps) {
  const router = useRouter();

  const handlePress = () => {
    // Điều hướng đến trang chi tiết sản phẩm
    // Tìm productUnitId từ product_id nếu cần hoặc sử dụng product_id trực tiếp
    router.push({
      pathname: '/product/[productUnitId]',
      params: { productUnitId: String(item.product_id) },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-lg p-3 m-2 shadow-sm border border-zinc-100"
    >
      {/* Ảnh sản phẩm */}
      <View className="w-full aspect-square items-center justify-center rounded-lg overflow-hidden bg-zinc-50 mb-2">
        {item.image_url ? (
          <Image
            source={{ uri: item.image_url }}
            resizeMode="contain"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <Text className="text-zinc-400">Không có ảnh</Text>
        )}
      </View>

      {/* Tên sản phẩm */}
      <Text
        numberOfLines={2}
        className="text-[14px] font-semibold text-zinc-900"
      >
        {item.name}
      </Text>

      {/* Thương hiệu */}
      {item.brand && (
        <Text className="text-[12px] text-zinc-500 mt-0.5">{item.brand}</Text>
      )}

      {/* Đơn vị */}
      {item.unit && (
        <Text className="text-[12px] text-zinc-500">Đơn vị: {item.unit}</Text>
      )}

      {/* Giá */}
      <View className="mt-2">
        {item.promotion_price ? (
          <View>
            <Text className="text-[12px] text-zinc-400 line-through">
              {item.price.toLocaleString('vi-VN')}đ
            </Text>
            <Text className="text-[15px] font-bold text-red-600">
              {item.promotion_price.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        ) : (
          <Text className="text-[15px] font-semibold text-red-600">
            {item.price.toLocaleString('vi-VN')}đ
          </Text>
        )}
      </View>

      {/* Trạng thái kho */}
      <View className="mt-2 bg-zinc-50 rounded px-2 py-1">
        <Text
          className={`text-[12px] font-medium ${item.stock_status === 'Còn hàng' ? 'text-green-600' : 'text-red-600'}`}
        >
          {item.stock_status}
        </Text>
      </View>

      {/* Nhãn khuyến mãi */}
      {item.has_promotion && (
        <View className="absolute top-2 right-2 bg-red-600 rounded-full px-2 py-1">
          <Text className="text-white text-[11px] font-bold">KM</Text>
        </View>
      )}
    </Pressable>
  );
}

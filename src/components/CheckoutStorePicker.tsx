import type { IStore } from '@/dtos';
import { useStoreList } from '@/react-query/hooks';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';

interface CheckoutStorePickerProps {
  selectedStoreId?: number;
  onStoreChange: (store: IStore) => void;
}

export const CheckoutStorePicker = ({
  selectedStoreId,
  onStoreChange,
}: CheckoutStorePickerProps) => {
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useStoreList();
  const stores = data?.data ?? [];

  // Tự động chọn cửa hàng đầu tiên khi load xong
  useEffect(() => {
    if (!selectedStoreId && stores.length > 0) {
      onStoreChange(stores[0]);
    }
  }, [stores, selectedStoreId, onStoreChange]);

  const selectedStore = stores.find((s) => s.storeId === selectedStoreId);

  const handleSelect = (store: IStore) => {
    onStoreChange(store);
    setShowModal(false);
  };

  const renderStoreItem = ({ item }: { item: IStore }) => {
    const isSelected = item.storeId === selectedStoreId;
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        className={`p-4 border-b border-gray-100 ${isSelected ? 'bg-red-50' : ''}`}
      >
        <View className="flex-row items-center justify-between mb-1">
          <Text className="font-semibold text-zinc-900">{item.storeName}</Text>
          {isSelected && <Ionicons name="checkmark" size={20} color="#dc2626" />}
        </View>
        <Text className="text-zinc-600 text-sm">{item.address}</Text>
        {item.phone && (
          <Text className="text-zinc-500 text-sm mt-1">{item.phone}</Text>
        )}
        {item.openingTime && item.closingTime && (
          <Text className="text-zinc-500 text-xs mt-1">
            {item.openingTime} - {item.closingTime}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <View>
      <Text className="mb-1 text-zinc-700">Cửa hàng nhận hàng</Text>
      <Pressable
        onPress={() => setShowModal(true)}
        className="flex-row items-center bg-zinc-100 rounded-xl px-3 py-3"
      >
        <Ionicons name="storefront-outline" size={18} color="#dc2626" />
        {selectedStore ? (
          <View className="ml-2 flex-1">
            <Text className="text-zinc-800 font-medium">
              {selectedStore.storeName}
            </Text>
            <Text className="text-zinc-600 text-sm" numberOfLines={1}>
              {selectedStore.address}
            </Text>
          </View>
        ) : (
          <Text className="ml-2 text-zinc-500 flex-1">Chọn cửa hàng</Text>
        )}
        <Ionicons name="chevron-forward" size={18} color="#64748b" />
      </Pressable>

      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[80%]">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">Chọn cửa hàng</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color="#dc2626" className="py-8" />
            ) : stores.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-zinc-500">Không có cửa hàng nào</Text>
              </View>
            ) : (
              <FlatList
                data={stores}
                keyExtractor={(item) => String(item.storeId)}
                renderItem={renderStoreItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

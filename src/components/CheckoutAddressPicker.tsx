import type { IMyAddress } from '@/dtos';
import { useMyAddressList } from '@/react-query/hooks';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';

interface CheckoutAddressPickerProps {
  selectedAddressId?: number;
  onAddressChange: (address: IMyAddress) => void;
}

export const CheckoutAddressPicker = ({
  selectedAddressId,
  onAddressChange,
}: CheckoutAddressPickerProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useMyAddressList();
  const addresses = data?.data ?? [];

  // Tự động chọn địa chỉ mặc định khi load xong
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
      onAddressChange(defaultAddress);
    }
  }, [addresses, selectedAddressId, onAddressChange]);

  const selectedAddress = addresses.find(
    (a) => a.addressId === selectedAddressId,
  );

  const handleSelect = (address: IMyAddress) => {
    onAddressChange(address);
    setShowModal(false);
  };

  const renderAddressItem = ({ item }: { item: IMyAddress }) => {
    const isSelected = item.addressId === selectedAddressId;
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        className={`p-4 border-b border-gray-100 ${isSelected ? 'bg-red-50' : ''}`}
      >
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center gap-2">
            <Text className="font-semibold text-zinc-900">
              {item.recipientName}
            </Text>
            {item.isDefault && (
              <View className="px-2 py-0.5 bg-red-100 rounded">
                <Text className="text-xs text-red-600">Mặc định</Text>
              </View>
            )}
          </View>
          {isSelected && <Ionicons name="checkmark" size={20} color="#dc2626" />}
        </View>
        <Text className="text-zinc-600 text-sm">{item.recipientPhone}</Text>
        <Text className="text-zinc-700 mt-1">{item.fullAddress}</Text>
      </Pressable>
    );
  };

  return (
    <View>
      <Text className="mb-1 text-zinc-700">Địa chỉ giao hàng</Text>
      <Pressable
        onPress={() => setShowModal(true)}
        className="flex-row items-center bg-zinc-100 rounded-xl px-3 py-3"
      >
        <Ionicons name="location-outline" size={18} color="#dc2626" />
        {selectedAddress ? (
          <View className="ml-2 flex-1">
            <Text className="text-zinc-800 font-medium">
              {selectedAddress.recipientName} - {selectedAddress.recipientPhone}
            </Text>
            <Text className="text-zinc-600 text-sm" numberOfLines={1}>
              {selectedAddress.fullAddress}
            </Text>
          </View>
        ) : (
          <Text className="ml-2 text-zinc-500 flex-1">Chọn địa chỉ giao hàng</Text>
        )}
        <Ionicons name="chevron-forward" size={18} color="#64748b" />
      </Pressable>

      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[80%]">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">Chọn địa chỉ</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color="#dc2626" className="py-8" />
            ) : addresses.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-zinc-500 mb-4">Chưa có địa chỉ nào</Text>
                <Pressable
                  onPress={() => {
                    setShowModal(false);
                    router.push('/address/add');
                  }}
                  className="px-4 py-2 bg-red-600 rounded-full"
                >
                  <Text className="text-white font-medium">Thêm địa chỉ</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <FlatList
                  data={addresses}
                  keyExtractor={(item) => String(item.addressId)}
                  renderItem={renderAddressItem}
                  showsVerticalScrollIndicator={false}
                />
                <Pressable
                  onPress={() => {
                    setShowModal(false);
                    router.push('/address/add');
                  }}
                  className="m-4 p-3 border border-dashed border-red-300 rounded-xl flex-row items-center justify-center gap-2"
                >
                  <Ionicons name="add" size={20} color="#dc2626" />
                  <Text className="text-red-600 font-medium">Thêm địa chỉ mới</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

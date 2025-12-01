import type { IWardItem } from '@/dtos';
import { useAddressWardList } from '@/react-query/hooks';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

// Cố định TP.HCM (mã 79)
const HCM_PROVINCE_CODE = 79;
const HCM_PROVINCE_NAME = 'Thành phố Hồ Chí Minh';

interface AddressSelectorProps {
  selectedWard: string;
  onWardChange: (ward: string) => void;
  wardError?: string;
}

export const AddressSelector = ({
  selectedWard,
  onWardChange,
  wardError,
}: AddressSelectorProps) => {
  const [showWardModal, setShowWardModal] = useState(false);
  const [searchWard, setSearchWard] = useState('');

  const { data: wards, isLoading: loadingWards } = useAddressWardList({
    province: HCM_PROVINCE_CODE,
  });

  const filteredWards =
    wards?.filter((w) =>
      w.name.toLowerCase().includes(searchWard.toLowerCase())
    ) || [];

  const handleSelectWard = (ward: IWardItem) => {
    onWardChange(ward.name);
    setShowWardModal(false);
    setSearchWard('');
  };

  const renderWardItem = ({ item }: { item: IWardItem }) => (
    <Pressable
      onPress={() => handleSelectWard(item)}
      className="py-3 px-4 border-b border-gray-100 flex-row items-center justify-between"
    >
      <Text className="text-base text-gray-800">{item.name}</Text>
      {selectedWard === item.name && (
        <Ionicons name="checkmark" size={20} color="#dc2626" />
      )}
    </Pressable>
  );


  return (
    <View>
      {/* City - Fixed to HCM */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2 ml-1 text-slate-700">
          Tỉnh/Thành phố
        </Text>
        <View className="flex-row items-center justify-between p-4 rounded-2xl border border-slate-300 bg-gray-100">
          <View className="flex-row items-center gap-3">
            <Ionicons name="business-outline" size={20} color="#64748b" />
            <Text className="text-gray-800">{HCM_PROVINCE_NAME}</Text>
          </View>
        </View>
      </View>

      {/* Ward Selector */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2 ml-1 text-slate-700">
          Phường/Xã
        </Text>
        <Pressable
          onPress={() => setShowWardModal(true)}
          className={`flex-row items-center justify-between p-4 rounded-2xl border ${
            wardError ? 'border-red-500' : 'border-slate-300'
          } bg-white`}
        >
          <View className="flex-row items-center gap-3">
            <Ionicons name="map-outline" size={20} color="#64748b" />
            <Text className={selectedWard ? 'text-gray-800' : 'text-gray-400'}>
              {selectedWard || 'Chọn phường/xã'}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#64748b" />
        </Pressable>
        {wardError && (
          <Text className="text-red-500 text-xs mt-1 ml-1">{wardError}</Text>
        )}
      </View>

      {/* Ward Modal */}
      <Modal visible={showWardModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[80%]">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">Chọn phường/xã</Text>
              <Pressable onPress={() => setShowWardModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>
            <View className="px-4 py-2">
              <View className="flex-row items-center bg-gray-100 rounded-xl px-3">
                <Ionicons name="search" size={20} color="#64748b" />
                <TextInput
                  placeholder="Tìm kiếm phường/xã..."
                  value={searchWard}
                  onChangeText={setSearchWard}
                  className="flex-1 py-3 px-2"
                />
              </View>
            </View>
            {loadingWards ? (
              <ActivityIndicator size="large" color="#dc2626" className="py-8" />
            ) : (
              <FlatList
                data={filteredWards}
                keyExtractor={(item) => String(item.code)}
                renderItem={renderWardItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

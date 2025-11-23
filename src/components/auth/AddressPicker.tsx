import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useAddressProvinceList,
  useAddressWardList,
  useAddressProvinceById,
  useAddressWardById,
} from '@/react-query/hooks';
import type { IAddressDetail, IProvinceItem, IWardItem } from '@/dtos';

interface AddressPickerProps {
  value?: IAddressDetail;
  onChange: (address: IAddressDetail) => void;
  error?: string;
}

export function AddressPicker({ value, onChange, error }: AddressPickerProps) {
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);
  const [houseNumber, setHouseNumber] = useState(value?.houseNumber || '');

  const [selectedProvince, setSelectedProvince] = useState<IProvinceItem | null>(null);
  const [selectedWard, setSelectedWard] = useState<IWardItem | null>(null);

  // Fetch province/ward details if value is provided
  const { data: provinceDetails } = useAddressProvinceById(
    value?.provinceCode ? { id: value.provinceCode } : { id: 0 },
  );
  const { data: wardDetails } = useAddressWardById(
    value?.wardCode ? { id: value.wardCode } : { id: 0 },
  );

  // Load all provinces and wards for current province
  const { data: provinces = [] } = useAddressProvinceList({});
  const { data: wards = [] } = useAddressWardList({
    province: selectedProvince?.code || 0,
  });

  // Initialize selectedProvince and selectedWard from API data
  useEffect(() => {
    if (provinceDetails && !selectedProvince) {
      setSelectedProvince({
        name: provinceDetails.name,
        code: provinceDetails.code,
        division_type: provinceDetails.division_type,
        codename: provinceDetails.codename,
        phone_code: provinceDetails.phone_code,
        wards: [],
      });
    }
  }, [provinceDetails, selectedProvince]);

  useEffect(() => {
    if (wardDetails && !selectedWard) {
      setSelectedWard({
        name: wardDetails.name,
        code: wardDetails.code,
        division_type: wardDetails.division_type,
        codename: wardDetails.codename,
        province_code: wardDetails.province_code,
      });
    }
  }, [wardDetails, selectedWard]);

  useEffect(() => {
    if (selectedProvince && selectedWard && houseNumber) {
      onChange({
        houseNumber,
        wardCode: selectedWard.code,
        wardName: selectedWard.name,
        provinceCode: selectedProvince.code,
        provinceName: selectedProvince.name,
      });
    }
  }, [selectedProvince, selectedWard, houseNumber]);

  const handleProvinceSelect = (province: IProvinceItem) => {
    setSelectedProvince(province);
    setSelectedWard(null); // Reset ward khi chọn tỉnh mới
    setShowProvinceModal(false);
  };

  const handleWardSelect = (ward: IWardItem) => {
    setSelectedWard(ward);
    setShowWardModal(false);
  };

  return (
    <View className="mb-4">
      {/* House Number Input */}
      <View className="mb-3">
        <Text className="text-gray-700 font-semibold mb-2">Số nhà</Text>
        <TextInput
          value={houseNumber}
          onChangeText={setHouseNumber}
          placeholder="Nhập số nhà"
          className="border border-gray-300 rounded-lg px-3 py-2 text-base"
          placeholderTextColor="#999"
        />
      </View>

      {/* Province Selector */}
      <View className="mb-3">
        <Text className="text-gray-700 font-semibold mb-2">Tỉnh/Thành phố</Text>
        <Pressable
          onPress={() => setShowProvinceModal(true)}
          className="border border-gray-300 rounded-lg px-3 py-3 flex-row justify-between items-center"
        >
          <Text className={selectedProvince ? 'text-black text-base' : 'text-gray-400 text-base'}>
            {selectedProvince?.name || 'Chọn tỉnh/thành phố'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </Pressable>
      </View>

      {/* Ward Selector */}
      <View className="mb-3">
        <Text className="text-gray-700 font-semibold mb-2">Phường/Xã</Text>
        <Pressable
          onPress={() => selectedProvince && setShowWardModal(true)}
          className={`border rounded-lg px-3 py-3 flex-row justify-between items-center ${
            selectedProvince ? 'border-gray-300' : 'border-gray-200 bg-gray-100'
          }`}
          disabled={!selectedProvince}
        >
          <Text
            className={`text-base ${
              selectedWard
                ? 'text-black'
                : selectedProvince
                  ? 'text-gray-400'
                  : 'text-gray-300'
            }`}
          >
            {selectedWard?.name || (selectedProvince ? 'Chọn phường/xã' : 'Chọn tỉnh trước')}
          </Text>
          <Ionicons name="chevron-down" size={20} color={selectedProvince ? '#666' : '#ccc'} />
        </Pressable>
      </View>

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}

      {/* Province Modal */}
      <Modal visible={showProvinceModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50">
          <View className="bg-white mt-auto rounded-t-2xl max-h-96">
            <View className="flex-row justify-between items-center border-b border-gray-200 px-4 py-3">
              <Text className="text-lg font-bold">Chọn tỉnh/thành phố</Text>
              <Pressable onPress={() => setShowProvinceModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>
            <FlatList
              data={provinces}
              keyExtractor={(item) => item.code.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleProvinceSelect(item)}
                  className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-center"
                >
                  <Text className="text-base">{item.name}</Text>
                  {selectedProvince?.code === item.code && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Ward Modal */}
      <Modal visible={showWardModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50">
          <View className="bg-white mt-auto rounded-t-2xl max-h-96">
            <View className="flex-row justify-between items-center border-b border-gray-200 px-4 py-3">
              <Text className="text-lg font-bold">Chọn phường/xã</Text>
              <Pressable onPress={() => setShowWardModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>
            <FlatList
              data={wards}
              keyExtractor={(item) => item.code.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleWardSelect(item)}
                  className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-center"
                >
                  <Text className="text-base">{item.name}</Text>
                  {selectedWard?.code === item.code && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

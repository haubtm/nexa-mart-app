import type { IMyAddress } from '@/dtos';
import { showToast } from '@/lib/utils/toast';
import {
  useMyAddressDelete,
  useMyAddressList,
  useMyAddressSetDefault,
} from '@/react-query/hooks';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: IMyAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) => {
  const labelColors = {
    HOME: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Nhà' },
    OFFICE: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Văn phòng' },
    BUILDING: { bg: 'bg-purple-100', text: 'text-purple-600', label: 'Tòa nhà' },
  };

  const labelStyle = labelColors[address.label] || labelColors.HOME;

  return (
    <View className="bg-white mx-4 mb-3 rounded-2xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-base font-semibold text-gray-800">
              {address.recipientName}
            </Text>
            <View className={`px-2 py-0.5 rounded-full ${labelStyle.bg}`}>
              <Text className={`text-xs font-medium ${labelStyle.text}`}>
                {labelStyle.label}
              </Text>
            </View>
            {address.isDefault && (
              <View className="px-2 py-0.5 rounded-full bg-red-100">
                <Text className="text-xs font-medium text-red-600">
                  Mặc định
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-gray-600 mb-1">
            {address.recipientPhone}
          </Text>
          <Text className="text-sm text-gray-500">
            {address.addressLine}, {address.ward}, {address.city}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100">
        {!address.isDefault && (
          <Pressable
            onPress={onSetDefault}
            className="flex-row items-center gap-1"
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#6b7280" />
            <Text className="text-sm text-gray-500">Đặt mặc định</Text>
          </Pressable>
        )}
        {address.isDefault && <View />}
        <View className="flex-row items-center gap-4">
          <Pressable onPress={onEdit} className="flex-row items-center gap-1">
            <Ionicons name="create-outline" size={18} color="#3b82f6" />
            <Text className="text-sm text-blue-500">Sửa</Text>
          </Pressable>
          <Pressable onPress={onDelete} className="flex-row items-center gap-1">
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
            <Text className="text-sm text-red-500">Xóa</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};


export default function AddressListScreen() {
  const router = useRouter();
  const { data, isLoading, refetch } = useMyAddressList();
  const { mutate: deleteAddress, isPending: isDeleting } = useMyAddressDelete();
  const { mutate: setDefault, isPending: isSettingDefault } =
    useMyAddressSetDefault();

  const addresses = data?.data || [];

  const handleDelete = (addressId: number) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa địa chỉ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          deleteAddress(
            { addressId },
            {
              onSuccess: () => {
                showToast.success('Thành công', 'Đã xóa địa chỉ');
              },
              onError: (error: any) => {
                showToast.error('Lỗi', error?.message || 'Xóa địa chỉ thất bại');
              },
            },
          );
        },
      },
    ]);
  };

  const handleSetDefault = (addressId: number) => {
    setDefault(addressId, {
      onSuccess: () => {
        showToast.success('Thành công', 'Đã đặt làm địa chỉ mặc định');
      },
      onError: (error: any) => {
        showToast.error('Lỗi', error?.message || 'Cập nhật thất bại');
      },
    });
  };

  const renderItem = ({ item }: { item: IMyAddress }) => (
    <AddressCard
      address={item}
      onEdit={() => router.push(`/address/edit/${item.addressId}` as any)}
      onDelete={() => handleDelete(item.addressId)}
      onSetDefault={() => handleSetDefault(item.addressId)}
    />
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons name="location-outline" size={64} color="#d1d5db" />
      <Text className="text-gray-400 text-base mt-4">
        Chưa có địa chỉ nào
      </Text>
      <Pressable
        onPress={() => router.push('/address/add')}
        className="mt-4 bg-red-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-semibold">Thêm địa chỉ mới</Text>
      </Pressable>
    </View>
  );

  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1 bg-gray-50">
        <LinearGradient
          colors={['#dc2626', '#991b1b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-4 px-4 flex-row items-center"
        >
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </Pressable>
          <View className="flex-1 ml-3">
            <Text className="text-white text-lg font-semibold">
              Địa chỉ giao hàng
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/address/add')}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </LinearGradient>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#dc2626" />
          </View>
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={(item) => String(item.addressId)}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={refetch}
          />
        )}

        {(isDeleting || isSettingDefault) && (
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </>
  );
}

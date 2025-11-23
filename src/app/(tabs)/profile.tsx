import { logout, useAppDispatch, useAppSelector } from '@/redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import dayjs from 'dayjs';

// Helper function to format address string by removing codes
const formatAddressForDisplay = (addressStr?: string): string => {
  if (!addressStr) return '';

  // Format: "houseNumber, wardCode, wardName, provinceCode, provinceName"
  const parts = addressStr.split(',').map(p => p.trim());

  if (parts.length !== 5) return addressStr;

  const [houseNumber, , wardName, , provinceName] = parts;
  return `${houseNumber}, ${wardName}, ${provinceName}`;
};

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logout());
            router.replace('/auth/login');
          },
        },
      ],
      { cancelable: true },
    );
  };

  const ProfileItem = ({
    icon,
    label,
    value,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
  }) => (
    <View className="flex-row items-center p-4 bg-white rounded-2xl mb-3 border border-slate-200 shadow-sm">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
      >
        <Ionicons name={icon} size={20} color="#ef4444" />
      </View>
      <View className="flex-1">
        <Text className="text-slate-500 text-xs mb-1">{label}</Text>
        <Text className="text-slate-800 text-base font-semibold">
          {value || 'Chưa cập nhật'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <LinearGradient
          colors={['#dc2626', '#991b1b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-3 px-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">
                Hồ sơ của tôi
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View className="px-4 py-6">

          {/* Avatar & Name */}
          <View className="items-center mb-8">
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Text className="text-white text-4xl font-bold">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
            <Text className="text-2xl font-bold text-slate-800 mb-1">
              {profile?.name || 'Người dùng'}
            </Text>
            <View
              className="px-4 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <Text className="text-red-600 text-sm font-semibold">
                {profile?.customerType === 'VIP'
                  ? 'Thành viên VIP'
                  : 'Thành viên'}
              </Text>
            </View>
          </View>

          {/* Profile Information */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-slate-800 mb-4">
              Thông tin cá nhân
            </Text>

            <ProfileItem
              icon="mail-outline"
              label="Email"
              value={profile?.email}
            />

            <ProfileItem
              icon="call-outline"
              label="Số điện thoại"
              value={profile?.phone}
            />

            {profile?.dateOfBirth && (
              <ProfileItem
                icon="calendar-outline"
                label="Ngày sinh"
                value={dayjs(profile.dateOfBirth).format('DD/MM/YYYY')}
              />
            )}

            {profile?.address && (
              <ProfileItem
                icon="location-outline"
                label="Địa chỉ"
                value={formatAddressForDisplay(profile.address)}
              />
            )}
          </View>

          {/* Action Buttons */}
          <View className="mb-8 gap-3">
            {/* Edit Profile Button */}
            <Pressable
              onPress={() => router.push('/profile/edit')}
              className="flex-row items-center justify-center p-4 rounded-2xl border-2 border-blue-500/30 bg-blue-500/10"
            >
              <Ionicons name="pencil-outline" size={20} color="#3b82f6" />
              <Text className="text-blue-600 text-base font-bold ml-2">
                Chỉnh sửa hồ sơ
              </Text>
            </Pressable>

            {/* Logout Button */}
            <Pressable
              onPress={handleLogout}
              className="flex-row items-center justify-center p-4 rounded-2xl border-2 border-red-500/30 bg-red-500/10"
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text className="text-red-500 text-base font-bold ml-2">
                Đăng xuất
              </Text>
            </Pressable>
          </View>

          {/* App Info */}
          <View className="items-center pb-8 pt-4">
            <Text className="text-slate-500 text-sm">NexaMart v1.0.0</Text>
            <Text className="text-slate-400 text-xs mt-1">
              © 2025 NexaMart. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

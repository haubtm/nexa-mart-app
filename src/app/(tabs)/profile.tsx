import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector, logout } from '@/redux';

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
    <LinearGradient
      colors={['#ffffff', '#f8fafc', '#f1f5f9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6">
          {/* Header */}
          <View className="pt-8 pb-6">
            <Text className="text-3xl font-bold text-slate-800 mb-2">
              Hồ sơ của tôi
            </Text>
            <Text className="text-base text-slate-600">
              Thông tin tài khoản NexaMart
            </Text>
          </View>

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

            <ProfileItem
              icon="card-outline"
              label="Mã khách hàng"
              value={profile?.customerId?.toString()}
            />
          </View>

          {/* Action Buttons */}
          <View className="mb-8">
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
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

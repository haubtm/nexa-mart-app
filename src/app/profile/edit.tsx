import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  AuthHeader,
  LuxuryInput,
  LuxuryButton,
  DatePickerInput,
  AddressPicker,
} from '@/components/auth';
import { useAppDispatch, useAppSelector } from '@/redux';
import { useUpdateProfile } from '@/react-query/hooks';
import { changeProfile } from '@/redux/slices/userSlice';
import { EGender } from '@/lib';
import { showToast } from '@/lib/utils/toast';
import dayjs from 'dayjs';
import type { IAddressDetail } from '@/dtos';

// Helper function to parse address string to IAddressDetail
const parseAddressString = (addressStr?: string): IAddressDetail | undefined => {
  if (!addressStr) return undefined;

  // Format: "houseNumber, wardCode, wardName, provinceCode, provinceName"
  const parts = addressStr.split(',').map(p => p.trim());

  if (parts.length !== 5) return undefined;

  const [houseNumber, wardCodeStr, wardName, provinceCodeStr, provinceName] = parts;
  const wardCode = parseInt(wardCodeStr, 10);
  const provinceCode = parseInt(provinceCodeStr, 10);

  if (isNaN(wardCode) || isNaN(provinceCode)) return undefined;

  return {
    houseNumber,
    wardCode,
    wardName,
    provinceCode,
    provinceName,
  };
};

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    gender: profile?.gender as EGender | undefined,
    dateOfBirth: profile?.dateOfBirth || '',
    addressDetail: parseAddressString(profile?.address),
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      phone: '',
    };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ và tên phải có ít nhất 2 ký tự';
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    // Format address from addressDetail
    let address = '';
    if (formData.addressDetail) {
      const { houseNumber, wardCode, wardName, provinceCode, provinceName } =
        formData.addressDetail;
      address = `${houseNumber}, ${wardCode}, ${wardName}, ${provinceCode}, ${provinceName}`;
    }

    updateProfile(
      {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: address || undefined,
      },
      {
        onSuccess: () => {
          // Update Redux with new profile data
          dispatch(
            changeProfile({
              ...profile,
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              gender: formData.gender,
              dateOfBirth: formData.dateOfBirth,
              address:
                formData.addressDetail ?
                  `${formData.addressDetail.houseNumber}, ${formData.addressDetail.wardCode}, ${formData.addressDetail.wardName}, ${formData.addressDetail.provinceCode}, ${formData.addressDetail.provinceName}`
                : undefined,
            }),
          );

          router.back();
          setTimeout(() => {
            showToast.success('Thành công', 'Cập nhật hồ sơ thành công!');
          }, 500);
        },
        onError: (error: any) => {
          showToast.error(
            'Lỗi',
            error?.message || 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.',
          );
        },
      },
    );
  };

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1 bg-white">
        {/* Header */}
        <LinearGradient
          colors={['#dc2626', '#991b1b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-3 px-4 flex-row items-center"
        >
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <Text className="text-white text-lg font-bold">←</Text>
          </Pressable>
          <View className="flex-1 ml-3">
            <Text className="text-white text-lg font-semibold">
              Chỉnh sửa hồ sơ
            </Text>
          </View>
        </LinearGradient>

        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
          extraHeight={150}
        >
          <View className="pt-6 pb-10">

            {/* Form */}
            <Animated.View
              entering={FadeInUp.delay(400).duration(600)}
              className="mt-4"
            >
              {/* Name Input */}
              <LuxuryInput
                label="Họ và tên"
                placeholder="Nhập họ và tên đầy đủ"
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                leftIcon="person-outline"
                error={errors.name}
              />

              {/* Email Input */}
              <LuxuryInput
                label="Email"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              {/* Phone Input */}
              <LuxuryInput
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                leftIcon="call-outline"
                keyboardType="phone-pad"
                error={errors.phone}
              />

              {/* Gender Selection */}
              <View className="mb-6">
                <Text className="text-sm font-medium mb-3 ml-1 text-slate-700">
                  Giới tính (Không bắt buộc)
                </Text>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => updateFormData('gender', EGender.MALE)}
                    className={`flex-1 py-4 px-4 rounded-2xl border ${
                      formData.gender === EGender.MALE
                        ? 'border-red-500 bg-red-50'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        formData.gender === EGender.MALE
                          ? 'text-red-600'
                          : 'text-slate-600'
                      }`}
                    >
                      Nam
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => updateFormData('gender', EGender.FEMALE)}
                    className={`flex-1 py-4 px-4 rounded-2xl border ${
                      formData.gender === EGender.FEMALE
                        ? 'border-red-500 bg-red-50'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        formData.gender === EGender.FEMALE
                          ? 'text-red-600'
                          : 'text-slate-600'
                      }`}
                    >
                      Nữ
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Date of Birth Input */}
              <DatePickerInput
                label="Ngày sinh (Không bắt buộc)"
                value={formData.dateOfBirth}
                onChange={(date) => updateFormData('dateOfBirth', date)}
                maximumDate={new Date()}
                minimumDate={new Date(1950, 0, 1)}
              />

              {/* Address Selector */}
              <View className="mb-6">
                <Text className="text-sm font-medium mb-3 ml-1 text-slate-700">
                  Địa chỉ (Không bắt buộc)
                </Text>
                <AddressPicker
                  value={formData.addressDetail}
                  onChange={(address) =>
                    updateFormData('addressDetail', address)
                  }
                />
              </View>

              {/* Update Button */}
              <View className="mt-4">
                <LuxuryButton
                  title="Cập nhật"
                  onPress={handleUpdate}
                  isLoading={isPending}
                  variant="primary"
                />
              </View>
            </Animated.View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
}

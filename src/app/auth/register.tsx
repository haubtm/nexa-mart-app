import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  AuthHeader,
  LuxuryInput,
  LuxuryButton,
  DatePickerInput,
  AddressPicker,
} from '@/components/auth';
import { useAppDispatch, useAppSelector } from '@/redux';
import { register, clearError } from '@/redux/slices/userSlice';
import { EGender } from '@/lib';
import { showToast } from '@/lib/utils/toast';
import type { IAddressDetail } from '@/dtos';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: undefined as EGender | undefined,
    dateOfBirth: '',
    addressDetail: undefined as IAddressDetail | undefined,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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
      password: '',
      confirmPassword: '',
    };
    dispatch(clearError());

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

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      // Format address from addressDetail
      let address = '';
      if (formData.addressDetail) {
        const { houseNumber, wardCode, wardName, provinceCode, provinceName } =
          formData.addressDetail;
        address = `${houseNumber}, ${wardCode}, ${wardName}, ${provinceCode}, ${provinceName}`;
      }

      const result = await dispatch(
        register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          address: address || undefined,
        }),
      ).unwrap();

      if (result) {
        router.replace('/(tabs)');
        setTimeout(() => {
          showToast.success(
            'Thành công',
            'Đăng ký tài khoản thành công! Bạn đã được đăng nhập tự động.',
          );
        }, 500);
      }
    } catch (err: any) {
      showToast.error(
        'Lỗi',
        err?.message || 'Đăng ký thất bại. Vui lòng thử lại.',
      );
    }
  };

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <>
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#ffffff', '#f8fafc', '#f1f5f9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
          extraHeight={150}
        >
          <View className="flex-1 pt-16 pb-10">
              {/* Header */}
              <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                <AuthHeader
                  title="Tạo tài khoản"
                  subtitle="Trở thành thành viên NexaMart và trải nghiệm mua sắm đẳng cấp"
                />
              </Animated.View>

              {/* Form */}
              <Animated.View
                entering={FadeInUp.delay(400).duration(600)}
                className="mt-8"
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

                {/* Password Input */}
                <LuxuryInput
                  label="Mật khẩu"
                  placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  leftIcon="lock-closed-outline"
                  rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  error={errors.password}
                />

                {/* Confirm Password Input */}
                <LuxuryInput
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    updateFormData('confirmPassword', text)
                  }
                  leftIcon="lock-closed-outline"
                  rightIcon={
                    showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                  }
                  onRightIconPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  secureTextEntry={!showConfirmPassword}
                  error={errors.confirmPassword}
                />

                {/* Register Button */}
                <View className="mt-2">
                  <LuxuryButton
                    title="Đăng ký"
                    onPress={handleRegister}
                    isLoading={isLoading}
                    variant="primary"
                  />
                </View>

                {/* Divider */}
                <View className="flex-row items-center my-8">
                  <View className="flex-1 h-px bg-slate-300" />
                  <Text className="text-slate-500 mx-4 text-sm">hoặc</Text>
                  <View className="flex-1 h-px bg-slate-300" />
                </View>

                {/* Login Link */}
                <View className="flex-row justify-center items-center mb-6">
                  <Text className="text-slate-600 text-base">
                    Đã có tài khoản?{' '}
                  </Text>
                  <Pressable onPress={() => router.back()}>
                    <Text className="text-red-600 text-base font-semibold">
                      Đăng nhập ngay
                    </Text>
                  </Pressable>
                </View>
            </Animated.View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </>
  );
}

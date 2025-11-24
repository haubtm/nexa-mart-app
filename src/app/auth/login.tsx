import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthHeader, LuxuryInput, LuxuryButton } from '@/components/auth';
import { useAppDispatch, useAppSelector } from '@/redux';
import { login, clearError } from '@/redux/slices/userSlice';
import { showToast } from '@/lib/utils/toast';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    dispatch(clearError());

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate email/phone
    if (!emailOrPhone.trim()) {
      setEmailError('Email hoặc số điện thoại là bắt buộc');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Mật khẩu là bắt buộc');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const result = await dispatch(
        login({
          emailOrPhone: emailOrPhone.trim(),
          password,
        }),
      ).unwrap();

      if (result) {
        router.replace('/(tabs)');
        setTimeout(() => {
          showToast.success('Thành công', 'Đăng nhập thành công!');
        }, 500);
      }
    } catch (err) {
      showToast.error('Lỗi', error || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const handleForgotPassword = () => {
    showToast.info('Quên mật khẩu', 'Tính năng đang được phát triển');
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
          <View className="flex-1 pt-20 pb-10">
            {/* Header */}
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <AuthHeader
                title="Chào mừng trở lại"
                subtitle="Đăng nhập để trải nghiệm mua sắm cao cấp tại NexaMart"
              />
            </Animated.View>

            {/* Form */}
            <Animated.View
              entering={FadeInUp.delay(400).duration(600)}
              className="mt-8"
            >
              {/* Email/Phone Input */}
              <LuxuryInput
                label="Email hoặc Số điện thoại"
                placeholder="Nhập email hoặc số điện thoại"
                value={emailOrPhone}
                onChangeText={(text) => {
                  setEmailOrPhone(text);
                  setEmailError('');
                }}
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
              />

              {/* Password Input */}
              <LuxuryInput
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
                leftIcon="lock-closed-outline"
                rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                secureTextEntry={!showPassword}
                error={passwordError}
              />

              {/* Forgot Password */}
              <Pressable
                onPress={handleForgotPassword}
                className="mb-8 items-end"
              >
                <Text className="text-red-600 text-sm font-medium">
                  Quên mật khẩu?
                </Text>
              </Pressable>

              {/* Login Button */}
              <LuxuryButton
                title="Đăng nhập"
                onPress={handleLogin}
                isLoading={isLoading}
                variant="primary"
              />

              {/* Divider */}
              <View className="flex-row items-center my-8">
                <View className="flex-1 h-px bg-slate-300" />
                <Text className="text-slate-500 mx-4 text-sm">hoặc</Text>
                <View className="flex-1 h-px bg-slate-300" />
              </View>

              {/* Register Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-slate-600 text-base">
                  Chưa có tài khoản?{' '}
                </Text>
                <Pressable onPress={() => router.push('/auth/register')}>
                  <Text className="text-red-600 text-base font-semibold">
                    Đăng ký ngay
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

import { AddressSelector } from '@/components/AddressSelector';
import { LuxuryButton, LuxuryInput } from '@/components/auth';
import type { AddressLabel } from '@/dtos';
import { showToast } from '@/lib/utils/toast';
import { useMyAddressCreate } from '@/react-query/hooks';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LABELS: { value: AddressLabel; label: string; icon: string }[] = [
  { value: 'HOME', label: 'Nhà', icon: 'home-outline' },
  { value: 'OFFICE', label: 'Văn phòng', icon: 'business-outline' },
  { value: 'BUILDING', label: 'Tòa nhà', icon: 'storefront-outline' },
];

export default function AddAddressScreen() {
  const router = useRouter();
  const { mutate: createAddress, isPending } = useMyAddressCreate();

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    addressLine: '',
    ward: '',
    city: 'Thành phố Hồ Chí Minh',
    label: 'HOME' as AddressLabel,
    isDefault: false,
  });

  const [errors, setErrors] = useState({
    recipientName: '',
    recipientPhone: '',
    addressLine: '',
    ward: '',
  });

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      recipientName: '',
      recipientPhone: '',
      addressLine: '',
      ward: '',
    };

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Tên người nhận là bắt buộc';
      isValid = false;
    }

    if (!formData.recipientPhone.trim()) {
      newErrors.recipientPhone = 'Số điện thoại là bắt buộc';
      isValid = false;
    } else if (!validatePhone(formData.recipientPhone)) {
      newErrors.recipientPhone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = 'Địa chỉ là bắt buộc';
      isValid = false;
    }

    if (!formData.ward.trim()) {
      newErrors.ward = 'Phường/Xã là bắt buộc';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    createAddress(formData, {
      onSuccess: () => {
        showToast.success('Thành công', 'Đã thêm địa chỉ mới');
        router.back();
      },
      onError: (error: any) => {
        showToast.error('Lỗi', error?.message || 'Thêm địa chỉ thất bại');
      },
    });
  };

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };


  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1 bg-white">
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
              Thêm địa chỉ mới
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
            <LuxuryInput
              label="Tên người nhận"
              placeholder="Nhập tên người nhận"
              value={formData.recipientName}
              onChangeText={(text) => updateFormData('recipientName', text)}
              leftIcon="person-outline"
              error={errors.recipientName}
            />

            <LuxuryInput
              label="Số điện thoại"
              placeholder="+84..."
              value={formData.recipientPhone}
              onChangeText={(text) => updateFormData('recipientPhone', text)}
              leftIcon="call-outline"
              keyboardType="phone-pad"
              error={errors.recipientPhone}
            />

            <LuxuryInput
              label="Địa chỉ chi tiết"
              placeholder="Số nhà, tên đường..."
              value={formData.addressLine}
              onChangeText={(text) => updateFormData('addressLine', text)}
              leftIcon="location-outline"
              error={errors.addressLine}
            />

            <AddressSelector
              selectedWard={formData.ward}
              onWardChange={(ward: string) => updateFormData('ward', ward)}
              wardError={errors.ward}
            />

            <View className="mb-6">
              <Text className="text-sm font-medium mb-3 ml-1 text-slate-700">
                Loại địa chỉ
              </Text>
              <View className="flex-row gap-3">
                {LABELS.map((item) => (
                  <Pressable
                    key={item.value}
                    onPress={() => updateFormData('label', item.value)}
                    className={`flex-1 py-3 px-3 rounded-xl border flex-row items-center justify-center gap-2 ${
                      formData.label === item.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={18}
                      color={formData.label === item.value ? '#dc2626' : '#64748b'}
                    />
                    <Text
                      className={`text-sm font-medium ${
                        formData.label === item.value
                          ? 'text-red-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              onPress={() => updateFormData('isDefault', !formData.isDefault)}
              className="flex-row items-center gap-3 mb-6"
            >
              <View
                className={`w-6 h-6 rounded-md border-2 items-center justify-center ${
                  formData.isDefault
                    ? 'bg-red-500 border-red-500'
                    : 'border-slate-300'
                }`}
              >
                {formData.isDefault && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text className="text-sm text-slate-700">
                Đặt làm địa chỉ mặc định
              </Text>
            </Pressable>

            <View className="mt-4">
              <LuxuryButton
                title="Thêm địa chỉ"
                onPress={handleSubmit}
                isLoading={isPending}
                variant="primary"
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
}

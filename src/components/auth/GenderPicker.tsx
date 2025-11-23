import { EGender } from '@/lib';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface GenderPickerProps {
  value?: EGender;
  onChange: (gender: EGender) => void;
  error?: string;
}

const genderOptions = [
  { label: 'Nam', value: EGender.MALE },
  { label: 'Nữ', value: EGender.FEMALE },
];

export function GenderPicker({ value, onChange, error }: GenderPickerProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-semibold mb-2">Giới tính</Text>
      <View className="flex-row gap-3">
        {genderOptions.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`flex-1 py-3 rounded-lg border-2 items-center ${
              value === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <View className="flex-row items-center gap-2">
              {value === option.value && (
                <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
              )}
              <Text
                className={`text-base font-medium ${
                  value === option.value ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {option.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}

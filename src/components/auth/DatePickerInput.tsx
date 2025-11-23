import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

interface DatePickerInputProps {
  label: string;
  value?: string;
  onChange: (date: string) => void;
  error?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DatePickerInput({
  label,
  value,
  onChange,
  error,
  maximumDate = new Date(),
  minimumDate = new Date(1950, 0, 1),
}: DatePickerInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const selectedDate = value ? new Date(value) : new Date();
  const [tempDate, setTempDate] = useState(selectedDate);

  const minYear = minimumDate.getFullYear();
  const maxYear = maximumDate.getFullYear();

  const years = useMemo(() => {
    const yearsList = [];
    for (let i = maxYear; i >= minYear; i--) {
      yearsList.push(i);
    }
    return yearsList;
  }, [minYear, maxYear]);

  const months = [
    { label: 'Tháng 1', value: 0 },
    { label: 'Tháng 2', value: 1 },
    { label: 'Tháng 3', value: 2 },
    { label: 'Tháng 4', value: 3 },
    { label: 'Tháng 5', value: 4 },
    { label: 'Tháng 6', value: 5 },
    { label: 'Tháng 7', value: 6 },
    { label: 'Tháng 8', value: 7 },
    { label: 'Tháng 9', value: 8 },
    { label: 'Tháng 10', value: 9 },
    { label: 'Tháng 11', value: 10 },
    { label: 'Tháng 12', value: 11 },
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInCurrentMonth = getDaysInMonth(tempDate.getFullYear(), tempDate.getMonth());
  const days = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  const handleDateConfirm = () => {
    const formattedDate = dayjs(tempDate).format('YYYY-MM-DD');
    onChange(formattedDate);
    setShowPicker(false);
  };

  const displayDate = value ? dayjs(value).format('DD/MM/YYYY') : 'Chọn ngày sinh';

  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-semibold mb-2">{label}</Text>
      <Pressable
        onPress={() => setShowPicker(true)}
        className="border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center bg-white"
      >
        <Text className={value ? 'text-gray-800 text-base font-medium' : 'text-gray-400 text-base'}>
          {displayDate}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
      </Pressable>

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}

      <Modal visible={showPicker} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl pt-4">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 pb-4 border-b border-gray-200">
              <Text className="text-lg font-bold">Chọn ngày sinh</Text>
              <Pressable onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>

            {/* Date Picker */}
            <View className="flex-row h-56 px-4 py-4">
              {/* Days */}
              <ScrollView className="flex-1" scrollEnabled showsVerticalScrollIndicator={false}>
                {days.map((day) => (
                  <Pressable
                    key={day}
                    onPress={() => setTempDate(new Date(tempDate.getFullYear(), tempDate.getMonth(), day))}
                    className={`py-3 px-2 rounded-lg items-center ${
                      tempDate.getDate() === day ? 'bg-red-500' : 'bg-white'
                    }`}
                  >
                    <Text className={tempDate.getDate() === day ? 'text-white font-bold' : 'text-gray-800'}>
                      {String(day).padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Months */}
              <ScrollView className="flex-1 mx-2" scrollEnabled showsVerticalScrollIndicator={false}>
                {months.map((month) => (
                  <Pressable
                    key={month.value}
                    onPress={() => setTempDate(new Date(tempDate.getFullYear(), month.value, 1))}
                    className={`py-3 px-2 rounded-lg items-center ${
                      tempDate.getMonth() === month.value ? 'bg-red-500' : 'bg-white'
                    }`}
                  >
                    <Text className={tempDate.getMonth() === month.value ? 'text-white font-bold text-sm' : 'text-gray-800 text-sm'}>
                      {month.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Years */}
              <ScrollView className="flex-1" scrollEnabled showsVerticalScrollIndicator={false}>
                {years.map((year) => (
                  <Pressable
                    key={year}
                    onPress={() => setTempDate(new Date(year, tempDate.getMonth(), 1))}
                    className={`py-3 px-2 rounded-lg items-center ${
                      tempDate.getFullYear() === year ? 'bg-red-500' : 'bg-white'
                    }`}
                  >
                    <Text className={tempDate.getFullYear() === year ? 'text-white font-bold' : 'text-gray-800'}>
                      {year}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3 px-4 py-4 border-t border-gray-200">
              <Pressable
                onPress={() => setShowPicker(false)}
                className="flex-1 py-3 rounded-lg border border-gray-300 items-center"
              >
                <Text className="text-gray-600 font-semibold">Hủy</Text>
              </Pressable>
              <Pressable
                onPress={handleDateConfirm}
                className="flex-1 py-3 rounded-lg bg-red-500 items-center"
              >
                <Text className="text-white font-semibold">Xác nhận</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

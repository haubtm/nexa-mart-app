import { Stack } from 'expo-router';
import React from 'react';

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Trang chủ',
        }}
      />
      <Stack.Screen name="results" options={{ title: 'Kết quả tìm kiếm' }} />
    </Stack>
  );
}

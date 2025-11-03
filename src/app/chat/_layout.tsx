import { Stack } from 'expo-router';
import React from 'react';

export default function ChatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Trò chuyện',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Chi tiết trò chuyện',
        }}
      />
    </Stack>
  );
}

import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  Pressable,
  type TextInputProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface LuxuryInputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export function LuxuryInput({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...textInputProps
}: LuxuryInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnimation = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    focusAnimation.value = withSpring(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnimation.value = withSpring(0);
  };

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(
        focusAnimation.value === 1 ? '#ef4444' : 'rgba(239, 68, 68, 0.3)',
        { duration: 200 },
      ),
      borderWidth: withTiming(focusAnimation.value === 1 ? 2 : 1, {
        duration: 200,
      }),
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focusAnimation.value === 1 ? 0.85 : 1),
        },
      ],
      color: withTiming(
        focusAnimation.value === 1 ? '#ef4444' : 'rgba(100, 116, 139, 0.8)',
        { duration: 200 },
      ),
    };
  });

  return (
    <View className="mb-6">
      {/* Label */}
      <Animated.Text
        style={animatedLabelStyle}
        className="text-sm font-medium mb-2 ml-1"
      >
        {label}
      </Animated.Text>

      {/* Input Container */}
      <Animated.View
        style={animatedBorderStyle}
        className="flex-row items-center bg-white rounded-2xl px-4 overflow-hidden"
      >
        {/* Left Icon */}
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? '#ef4444' : 'rgba(100, 116, 139, 0.6)'}
            style={{ marginRight: 12 }}
          />
        )}

        {/* Text Input */}
        <TextInput
          {...textInputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-1 py-4 text-slate-800 text-base"
          placeholderTextColor="rgba(100, 116, 139, 0.5)"
        />

        {/* Right Icon */}
        {rightIcon && (
          <Pressable onPress={onRightIconPress}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={isFocused ? '#ef4444' : 'rgba(100, 116, 139, 0.6)'}
            />
          </Pressable>
        )}
      </Animated.View>

      {/* Error Message */}
      {error && (
        <Text className="text-red-400 text-xs mt-2 ml-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}

import React from 'react';
import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface LuxuryButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LuxuryButton({
  title,
  onPress,
  isLoading = false,
  variant = 'primary',
  disabled = false,
}: LuxuryButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    scale.value = withSequence(withSpring(0.92), withSpring(1));
    if (!disabled && !isLoading) {
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: disabled ? 0.5 : 1,
    };
  });

  const primaryGradient = ['#ef4444', '#dc2626', '#b91c1c'];
  const secondaryGradient = ['#ffffff', '#f8fafc', '#f1f5f9'];

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={animatedStyle}
      disabled={disabled || isLoading}
    >
      <LinearGradient
        colors={variant === 'primary' ? primaryGradient : secondaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 24,
          shadowColor: variant === 'primary' ? '#ef4444' : '#64748b',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === 'primary' ? '#ffffff' : '#ef4444'}
            size="small"
          />
        ) : (
          <Text
            style={{
              color: variant === 'primary' ? '#ffffff' : '#ef4444',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              letterSpacing: 0.5,
            }}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
}

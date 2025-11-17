import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(-20);
  const accentScale = useSharedValue(0);

  useEffect(() => {
    // Animate title
    titleOpacity.value = withDelay(100, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(100, withSpring(0));

    // Animate subtitle
    subtitleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    subtitleTranslateY.value = withDelay(400, withSpring(0));

    // Animate accent
    accentScale.value = withDelay(
      700,
      withSequence(withSpring(1), withSpring(1.1), withSpring(1)),
    );
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const accentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: accentScale.value }],
  }));

  return (
    <View className="mb-10">
      {/* Decorative accent */}
      <Animated.View style={accentAnimatedStyle} className="mb-6 items-center">
        <LinearGradient
          colors={['#ef4444', '#dc2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#ef4444',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: 'bold' }}>
            N
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Title */}
      <Animated.Text
        style={titleAnimatedStyle}
        className="text-4xl font-bold text-slate-800 text-center mb-3"
      >
        {title}
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text
        style={subtitleAnimatedStyle}
        className="text-base text-slate-600 text-center px-4 leading-6"
      >
        {subtitle}
      </Animated.Text>

      {/* Decorative line */}
      <Animated.View style={accentAnimatedStyle} className="mt-6 items-center">
        <LinearGradient
          colors={['transparent', '#ef4444', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 128, height: 2 }}
        />
      </Animated.View>
    </View>
  );
}

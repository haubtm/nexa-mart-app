import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/redux';
import { getUserInfo } from '@/redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        // Try to get user info if token exists
        try {
          await dispatch(getUserInfo()).unwrap();
          setIsChecking(false);
          router.replace('/(tabs)');
        } catch (error) {
          // Token is invalid, remove it
          await AsyncStorage.removeItem('token');
          setIsChecking(false);
          router.replace('/auth/login');
        }
      } else {
        // No token, go to login
        setIsChecking(false);
        router.replace('/auth/login');
      }
    } catch (error) {
      setIsChecking(false);
      router.replace('/auth/login');
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#f8fafc', '#f1f5f9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <ActivityIndicator size="large" color="#ef4444" />
    </LinearGradient>
  );
}

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ReactQueryProvider } from '@/providers';
import { store } from '@/redux/store';
import { Provider } from 'react-redux';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  // const user = useAppSelector((state) => state.user).profile;

  // console.log(user);
  return (
    <Provider store={store}>
      <ReactQueryProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="search" options={{ headerShown: false }} />
            <Stack.Screen name="cart" options={{ headerShown: false }} />
            <Stack.Screen
              name="detail"
              options={{
                headerShown: false,
                animation: 'fade',
                presentation: 'transparentModal',
              }}
            />
            <Stack.Screen
              name="product/[productUnitId]"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="orders/[id]"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="chat"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ReactQueryProvider>
    </Provider>
  );
}

import { useCartList, useProductById, useProductUnitById } from '@/react-query';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const THUMB_W = 96;
const THUMB_H = 72;
const THUMB_RADIUS = 12;
const THUMB_GAP = 12;

export default function ProductDetailScreen() {
  const router = useRouter();
  const { productUnitId } = useLocalSearchParams<{ productUnitId: string }>();
  const id = Number(productUnitId);

  const { data: unitData, isPending: unitLoading } = useProductUnitById({
    productUnitId: id,
  });

  const productId = unitData?.data?.productId ?? 0;
  const { data: productData } = useProductById({ id: productId });

  const { data: cartData } = useCartList();
  const totalItems = cartData?.data?.totalItems ?? 0;

  // Sắp xếp ảnh: primary trước, sau đó theo displayOrder
  const images: string[] = useMemo(() => {
    const arr =
      unitData?.data?.images?.slice()?.sort((a: any, b: any) => {
        const pri = Number(b?.isPrimary) - Number(a?.isPrimary);
        if (pri !== 0) return pri;
        return (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0);
      }) ?? [];
    return arr
      .map((x: any) => x?.productImage?.imageUrl)
      .filter(Boolean) as string[];
  }, [unitData]);

  const [active, setActive] = useState(0);
  const largeRef = useRef<ScrollView>(null);
  const thumbRef = useRef<FlatList<string>>(null);

  const name = unitData?.data?.productName ?? '';
  const unitName = unitData?.data?.unitName ?? '';
  const price = unitData?.data?.currentPrice ?? null;
  const stock = unitData?.data?.quantityOnHand ?? 0;
  const descriptionHtml: string =
    productData?.data?.description ?? unitData?.data?.description ?? '<p></p>';
  const openAddToCartSheet = () => {
    router.push({
      pathname: '/detail',
      params: {
        productUnitId: String(id),
        productId: String(unitData?.data?.productId ?? ''),
        productName: name,
        unitName,
      },
    });
  };

  // WebView auto-height
  const [htmlHeight, setHtmlHeight] = useState(20);
  const injected = `
    (function(){
      function sendH(){ 
        var h = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight
        );
        window.ReactNativeWebView.postMessage(String(h));
      }
      setTimeout(sendH, 50);
      new ResizeObserver(sendH).observe(document.body);
    })();
    true;
  `;

  const onThumbPress = (index: number) => {
    setActive(index);
    largeRef.current?.scrollTo({ x: index * width, y: 0, animated: true });
    thumbRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const onLargeScrollEnd = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== active) {
      setActive(idx);
      thumbRef.current?.scrollToIndex({
        index: idx,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER mới: giống trang chủ (Back + tiêu đề + giỏ hàng) */}
      <View className="bg-red-600 pt-12 pb-3 px-3">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Pressable
            className="mr-3 relative"
            onPress={() => router.push('/cart')}
          >
            <Feather
              className="ml-3 relative"
              name="shopping-cart"
              size={22}
              color="#fff"
            />
            {totalItems > 0 && (
              <View className="absolute -top-2 -right-3 bg-white rounded-full px-1.5">
                <Text className="text-red-600 text-[12px] font-bold">
                  {totalItems}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {unitLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* Ảnh lớn (có paging) */}
            <ScrollView
              ref={largeRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onLargeScrollEnd}
            >
              {images.length > 0 ? (
                images.map((uri, idx) => (
                  <View
                    key={`${uri}-${idx}`}
                    style={{ width }}
                    className="aspect-[1.4] items-center justify-center"
                  >
                    <Image
                      source={{ uri }}
                      resizeMode="contain"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                ))
              ) : (
                <View
                  style={{ width }}
                  className="aspect-[1.4] items-center justify-center bg-zinc-50"
                >
                  <Text className="text-zinc-400">No image</Text>
                </View>
              )}
            </ScrollView>

            {/* Thumbnails */}
            {images.length > 1 && (
              <FlatList
                ref={thumbRef}
                className="mt-3 px-4"
                data={images}
                horizontal
                keyExtractor={(u, i) => `${u}-${i}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: THUMB_GAP }}
                getItemLayout={(_, index) => ({
                  length: THUMB_W + THUMB_GAP,
                  offset: (THUMB_W + THUMB_GAP) * index,
                  index,
                })}
                renderItem={({ item, index }) => {
                  const selected = index === active;
                  return (
                    <Pressable onPress={() => onThumbPress(index)}>
                      <View
                        style={{
                          width: THUMB_W,
                          height: THUMB_H,
                          borderRadius: THUMB_RADIUS,
                          overflow: 'hidden',
                          borderWidth: 1,
                          borderColor: selected ? '#EF4444' : '#E5E7EB',
                          backgroundColor: '#fff',
                        }}
                      >
                        <Image
                          source={{ uri: item }}
                          resizeMode="contain"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </View>
                    </Pressable>
                  );
                }}
              />
            )}

            {/* Thông tin */}
            <View className="px-4">
              <Text className="mt-4 text-[20px] font-semibold text-zinc-900">
                {name}
              </Text>
              <Text className="text-[13px] text-zinc-500 mt-1">
                Đơn vị: {unitName} • Tồn kho: {stock}
              </Text>
              <Text className="mt-2 text-[18px] font-semibold text-orange-600">
                {price ? `${price.toLocaleString('vi-VN')}đ` : 'Chưa có giá'}
              </Text>

              {/* Mô tả HTML */}
              <View className="mt-6">
                <Text className="text-[16px] font-semibold text-zinc-900 mb-2">
                  Mô tả sản phẩm
                </Text>
                <WebView
                  originWhitelist={['*']}
                  scrollEnabled={false}
                  onMessage={(e) => {
                    const h = Number(e.nativeEvent.data);
                    if (!Number.isNaN(h)) setHtmlHeight(Math.max(20, h));
                  }}
                  injectedJavaScript={injected}
                  style={{
                    height: htmlHeight,
                    width: width - 32,
                    backgroundColor: 'transparent',
                  }}
                  source={{
                    html: `
                      <html>
                        <head>
                          <meta name="viewport" content="width=device-width, initial-scale=1" />
                          <style>
                            body { font-family: -apple-system, Roboto, Arial, 'Helvetica Neue', sans-serif; padding:0; margin:0; color:#111827; }
                            p, li { font-size:15px; line-height:22px; }
                            ul { padding-left:18px; margin:0 0 8px; }
                            strong { font-weight:600; }
                          </style>
                        </head>
                        <body>${descriptionHtml}</body>
                      </html>
                    `,
                  }}
                />
              </View>
            </View>
          </ScrollView>

          {/* Nút dưới cùng */}
          <View className="border-t border-zinc-200 px-4 py-10">
            <Pressable
              disabled={!price}
              onPress={openAddToCartSheet}
              className={`h-12 rounded-full items-center justify-center ${price ? 'bg-red-600' : 'bg-zinc-300'}`}
            >
              <Text className="text-white font-semibold">
                Thêm vào giỏ hàng
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

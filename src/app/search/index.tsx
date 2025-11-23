import BarcodeScanner from '@/components/BarcodeScanner';
import { showToast } from '@/lib/utils/toast';
import { useProductByBarcode, useProductList } from '@/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

const debounce = (fn: (...args: any[]) => void, ms = 300) => {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export default function SearchScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [term, setTerm] = useState('');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [barcodeQuery, setBarcodeQuery] = useState<string | null>(null);

  const debounced = useRef(
    debounce((v: string) => setTerm(v.trim()), 300),
  ).current;

  // Use useProductList for suggestions
  const { data } = useProductList({
    page: 0,
    size: 10,
    searchTerm: term || undefined,
  });

  // Hook to find product by barcode - only query when barcodeQuery is set
  const { data: barcodeData, error: barcodeError } = useProductByBarcode({
    barcode: barcodeQuery || '',
  });

  // Handle when barcode data is returned
  React.useEffect(() => {
    if (!barcodeQuery) return;

    if (barcodeData?.data) {
      const product = barcodeData.data;
      const productUnit = product.productUnits?.[0];

      if (productUnit?.id) {
        // Navigate directly to product detail page
        router.push({
          pathname: '/product/[productUnitId]',
          params: { productUnitId: productUnit.id },
        });
        setTimeout(() => {
          showToast.success('Tìm thấy sản phẩm', `${product.name}`);
        }, 500);
        setBarcodeQuery(null);
      }
    } else if (barcodeError) {
      showToast.error('Lỗi', 'Không tìm thấy sản phẩm');
      setBarcodeQuery(null);
    }
  }, [barcodeData, barcodeError, barcodeQuery, router]);

  // Reset barcode query when scanner is closed
  const handleScannerClose = () => {
    setScannerVisible(false);
    // Don't reset barcodeQuery here - let the effect handle it
  };

  const suggestions = useMemo(() => {
    const products = data?.data?.products ?? [];
    return products.map(
      (p: any) => `${p.name}${p.brandName ? ' - ' + p.brandName : ''}`,
    );
  }, [data]);

  const goResults = (q: string) => {
    const query = encodeURIComponent(q.trim());
    router.push(`/search/results?query=${query}`);
  };

  const handleBarcodeDetected = (barcode: string) => {
    setBarcodeQuery(barcode);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="pt-12 px-4 pb-3 bg-red-600">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 bg-white rounded-full px-4 py-2 flex-row items-center">
            <TextInput
              value={text}
              onChangeText={(v) => {
                setText(v);
                debounced(v);
              }}
              placeholder="Nhập tên sản phẩm"
              returnKeyType="search"
              onSubmitEditing={() => text.trim() && goResults(text)}
              className="text-[16px] flex-1"
              autoFocus
            />
          </View>
          <Pressable
            onPress={() => setScannerVisible(true)}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="barcode-outline" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
      <FlatList
        data={suggestions}
        keyExtractor={(s, i) => s + i}
        renderItem={({ item }) => (
          <Pressable
            className="px-4 py-3 border-b border-zinc-100"
            onPress={() => goResults(item.split(' - ')[0])}
          >
            <Text className="text-zinc-800">{item}</Text>
          </Pressable>
        )}
      />

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        visible={scannerVisible}
        onClose={handleScannerClose}
        onBarcodeDetected={handleBarcodeDetected}
      />
    </View>
  );
}

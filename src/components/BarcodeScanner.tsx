import { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { extractBarcodeFromUrl } from '@/lib/utils/barcode';
import { showToast } from '@/lib/utils/toast';

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onBarcodeDetected: (barcode: string) => void;
}

export default function BarcodeScanner({
  visible,
  onClose,
  onBarcodeDetected,
}: BarcodeScannerProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible, permission?.granted, requestPermission]);

  // Reset scanned state when modal closes
  useEffect(() => {
    if (!visible) {
      setScanned(false);
      setIsProcessing(false);
    }
  }, [visible]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isProcessing) return;

    setIsProcessing(true);
    setScanned(true);

    try {
      // Try to extract barcode from the detected data (could be URL or direct barcode)
      let barcode: string | null = null;

      // If it's a URL, extract from URL pattern
      if (data.startsWith('http')) {
        barcode = extractBarcodeFromUrl(data);
      } else {
        // Otherwise, treat it as a direct barcode
        barcode = data;
      }

      if (barcode && /^[a-zA-Z0-9]+$/.test(barcode)) {
        onBarcodeDetected(barcode);
        setTimeout(() => {
          onClose();
        }, 100);
      } else {
        showToast.error('Lỗi', 'Mã vạch không hợp lệ');
        setScanned(false);
        setIsProcessing(false);
      }
    } catch (error) {
      showToast.error('Lỗi', 'Không thể xử lý mã vạch');
      setScanned(false);
      setIsProcessing(false);
    }
  };

  if (!permission) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 bg-black items-center justify-center">
          <ActivityIndicator color="#fff" size="large" />
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 bg-black items-center justify-center px-4">
          <Text className="text-white text-lg mb-4 text-center">
            Cần quyền truy cập camera để quét mã vạch
          </Text>
          <Pressable
            onPress={requestPermission}
            className="bg-red-600 rounded-lg px-6 py-3 mb-3"
          >
            <Text className="text-white font-semibold">Cho phép truy cập</Text>
          </Pressable>
          <Pressable
            onPress={onClose}
            className="bg-zinc-700 rounded-lg px-6 py-3"
          >
            <Text className="text-white font-semibold">Đóng</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['code128', 'code39', 'ean13', 'ean8', 'upc_e', 'qr'],
          }}
        />

        {/* Close button */}
        <View className="absolute top-12 left-4 z-10">
          <Pressable
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
          >
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
        </View>

        {/* Instructions */}
        <View className="absolute bottom-20 left-0 right-0 items-center">
          <Text className="text-white text-center text-base">
            Đặt mã vạch vào khung để quét
          </Text>
        </View>

        {/* Scan guide frame */}
        <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <View
            style={{
              width: 250,
              height: 200,
              borderWidth: 2,
              borderColor: '#dc2626',
              borderRadius: 12,
            }}
          />
        </View>

        {/* Processing indicator */}
        {isProcessing && (
          <View className="absolute inset-0 bg-black/40 items-center justify-center">
            <ActivityIndicator color="#fff" size="large" />
          </View>
        )}
      </View>
    </Modal>
  );
}

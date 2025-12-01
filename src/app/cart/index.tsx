import { CheckoutAddressPicker } from '@/components/CheckoutAddressPicker';
import { CheckoutStorePicker } from '@/components/CheckoutStorePicker';
import type { IMyAddress, IStore } from '@/dtos';
import {
    EDeliveryType,
    EOrderStatus,
    EPaymentMethod,
    EPaymentProvider,
} from '@/lib';
import { showToast } from '@/lib/utils/toast';
import { queryClient } from '@/providers/ReactQuery';
import {
    cartKeys,
    useCartDelete,
    useCartDeleteProduct,
    useCartList,
    useCartUpdate,
    useOrderById,
    useOrderCreate,
} from '@/react-query';
import { useAppSelector } from '@/redux';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Linking,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text className={`text-zinc-700 ${bold ? 'font-semibold' : ''}`}>
        {label}
      </Text>
      <Text
        className={`${bold ? 'font-semibold text-zinc-900' : ''} ${highlight ? 'text-teal-700' : ''}`}
      >
        {value}
      </Text>
    </View>
  );
}

function getPaymentDeepLink(
  provider: EPaymentProvider,
  paymentUrl: string,
): string {
  // Với các provider khác nhau, tạo deep link phù hợp
  // Nếu backend đã cung cấp paymentUrl hoàn chỉnh, sử dụng trực tiếp
  switch (provider) {
    case EPaymentProvider.MOMO:
      // Momo app scheme (nếu có URL scheme từ backend)
      return paymentUrl || 'momo://';
    case EPaymentProvider.VNPAY:
      // VNPay URL từ backend
      return paymentUrl || 'https://vnpay.vn/';
    case EPaymentProvider.PAYOS:
      // PayOS URL từ backend
      return paymentUrl || 'https://payos.vn/';
    case EPaymentProvider.BANK_TRANSFER:
      // Bank transfer link từ backend
      return paymentUrl || '';
    default:
      return paymentUrl || '';
  }
}

// Helper function to format address string by removing codes
const formatAddressForDisplay = (addressStr?: string): string => {
  if (!addressStr) return '';

  // Format: "houseNumber, wardCode, wardName, provinceCode, provinceName"
  const parts = addressStr.split(',').map((p) => p.trim());

  if (parts.length !== 5) return addressStr;

  const [houseNumber, , wardName, , provinceName] = parts;
  return `${houseNumber}, ${wardName}, ${provinceName}`;
};

export default function CartScreen() {
  const router = useRouter();
  const { profile } = useAppSelector((state) => state.user);

  const { data, isPending } = useCartList();
  const { mutateAsync: updateCart, isPending: updating } = useCartUpdate();
  const { mutateAsync: clearAll, isPending: clearing } = useCartDelete();
  const { mutateAsync: deleteLine, isPending: deleting } =
    useCartDeleteProduct();
  const { mutateAsync: createOrder, isPending: creatingOrder } =
    useOrderCreate();

  const [deliveryType, setDeliveryType] = useState<EDeliveryType>(
    EDeliveryType.HOME_DELIVERY,
  );
  const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>(
    EPaymentMethod.ONLINE,
  );
  const [selectedAddress, setSelectedAddress] = useState<IMyAddress | null>(null);
  const [selectedStore, setSelectedStore] = useState<IStore | null>(null);
  const [orderNote, setOrderNote] = useState<string>('');

  const [showPayModal, setShowPayModal] = useState(false);
  const [payInfo, setPayInfo] = useState<{
    paymentUrl?: string;
    qrCode?: string;
    paymentProvider?: string;
    expirationTime?: string;
  } | null>(null);
  const [lastOrderCode, setLastOrderCode] = useState<string | null>(null);
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);
  const [selectedPaymentProvider, setSelectedPaymentProvider] =
    useState<EPaymentProvider | null>(null);

  // Fetch chi tiết đơn hàng với polling mỗi 3 giây khi modal mở
  const { data: orderData, isPending: orderPending } = useOrderById(
    {
      orderId: lastOrderId!,
    },
    { refetchInterval: lastOrderId && showPayModal ? 3000 : false },
  );

  // Auto navigate khi order status khác UNPAID
  useEffect(() => {
    if (orderData?.data && lastOrderId) {
      const orderStatus = orderData.data.orderStatus;
      if (orderStatus && orderStatus !== EOrderStatus.UNPAID) {
        // Refresh giỏ hàng
        queryClient.invalidateQueries({ queryKey: cartKeys.all });
        // Chuyển sang trang chi tiết đơn hàng
        setShowPayModal(false);
        setSelectedPaymentProvider(null);
        setTimeout(() => {
          router.push(`/orders/${lastOrderId}`);
        }, 300);
      }
    }
  }, [orderData?.data, lastOrderId]);

  const cart = data?.data;
  const items = cart?.items ?? [];

  const totals = useMemo(() => {
    const sub = cart?.subTotal ?? 0;
    const lineDiscount = cart?.lineItemDiscount ?? 0;
    const orderDiscount = cart?.orderDiscount ?? 0;
    const payable = cart?.totalPayable ?? 0;
    return { sub, lineDiscount, orderDiscount, payable };
  }, [cart]);

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const inc = async (id: number, cur: number, stock: number) => {
    const next = Math.min(cur + 1, stock);
    if (next === cur) {
      showToast.info('Thông báo', 'Đã đạt số lượng tối đa');
      return;
    }
    try {
      setUpdatingId(id);
      await updateCart({ productUnitId: id, quantity: next });
      showToast.success('Cập nhật', `Số lượng đã tăng lên ${next}`);
    } finally {
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      setUpdatingId(null);
    }
  };

  const dec = async (id: number, cur: number) => {
    const next = Math.max(cur - 1, 0);
    try {
      setUpdatingId(id);
      await updateCart({ productUnitId: id, quantity: next });
      showToast.success('Cập nhật', `Số lượng đã giảm xuống ${next}`);
    } finally {
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      setUpdatingId(null);
    }
  };

  const decOrRemove = async (id: number, cur: number) => {
    if (cur <= 1) {
      await deleteLine({ productUnitId: id });
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      showToast.success('Xóa thành công', 'Sản phẩm đã được xóa khỏi giỏ hàng');
      return;
    }
    await dec(id, cur);
  };

  const remove = async (id: number) => {
    await deleteLine({ productUnitId: id });
    await queryClient.invalidateQueries({ queryKey: cartKeys.all });
    showToast.success('Xóa thành công', 'Sản phẩm đã được xóa khỏi giỏ hàng');
  };

  const removeAll = async () => {
    Alert.alert('Xoá giỏ hàng', 'Bạn có chắc muốn xoá tất cả sản phẩm?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await clearAll();
          await queryClient.invalidateQueries({ queryKey: cartKeys.all });
          showToast.success(
            'Xóa thành công',
            'Tất cả sản phẩm đã được xóa khỏi giỏ hàng',
          );
        },
      },
    ]);
  };

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-100">
        <ActivityIndicator />
      </View>
    );
  }

  const EmptyState = () => (
    <View className="flex-1 bg-zinc-100">
      <View className="px-4 pt-12 pb-3 bg-red-600 flex-row items-center justify-between">
        <Text className="text-white text-xl font-semibold">Giỏ hàng</Text>
      </View>

      <View className="flex-1 items-center justify-center px-10">
        <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-4 shadow-sm">
          <Feather name="shopping-cart" size={22} color="#dc2626" />
        </View>
        <Text className="text-[18px] text-zinc-700 mb-4">Chưa có sản phẩm</Text>

        <Pressable
          onPress={() => router.push('/')}
          className="px-6 py-3 rounded-full bg-red-600"
        >
          <Text className="text-white font-semibold">THÊM SẢN PHẨM</Text>
        </Pressable>
      </View>
    </View>
  );

  if (!items.length || (cart?.totalItems ?? 0) === 0) {
    return <EmptyState />;
  }

  // ========= MAIN =========
  return (
    <View className="flex-1 bg-zinc-100">
      {/* Header cố định */}
      <View className="px-4 pt-12 pb-3 bg-red-600 flex-row items-center justify-between">
        <Text className="text-white text-xl font-semibold">
          Giỏ hàng của bạn ({cart?.totalItems ?? 0})
        </Text>
        <Pressable
          onPress={removeAll}
          className="px-3 py-2 rounded-full bg-white"
          disabled={clearing}
        >
          <Text className="text-red-600 font-medium">Xoá tất cả</Text>
        </Pressable>
      </View>

      {/* 1 FlatList duy nhất: items + footer = form + tổng tiền + nút */}
      <FlatList
        data={items}
        keyExtractor={(it) => String(it.lineItemId)}
        ItemSeparatorComponent={() => <View className="h-px bg-zinc-100" />}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
        ListHeaderComponent={<View className="h-2" />}
        renderItem={({ item }) => {
          const discounted =
            (item.finalTotal ?? item.originalTotal) < item.originalTotal;

          const isGiftLine =
            !!item.promotionApplied &&
            item.promotionApplied.discountType === 'percentage' &&
            item.promotionApplied.discountValue === 100;

          const canPlus =
            !isGiftLine && item.quantity < (item.stockQuantity ?? 0);
          const canMinus = !isGiftLine && item.quantity > 0;

          const rowBusy = updatingId === item.productUnitId;

          return (
            <View className="px-4 py-3 flex-row gap-3 items-center bg-white">
              <View className="w-16 h-16 bg-zinc-50 rounded-xl items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    resizeMode="contain"
                    className="w-full h-full"
                  />
                ) : (
                  <Text className="text-zinc-400">No image</Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="font-medium" numberOfLines={1}>
                  {item.productName} - {item.unitName}
                </Text>

                <View className="flex-row items-center gap-2">
                  {discounted && (
                    <Text className="text-zinc-400 line-through">
                      {item.originalTotal.toLocaleString('vi-VN')}đ
                    </Text>
                  )}
                  <Text className="text-orange-600 font-semibold">
                    {(item.finalTotal ?? item.originalTotal).toLocaleString(
                      'vi-VN',
                    )}
                    đ
                  </Text>
                </View>

                {item.promotionApplied?.promotionSummary && (
                  <Text className="text-xs text-teal-700 mt-1">
                    🎁 {item.promotionApplied.promotionSummary}
                  </Text>
                )}
              </View>

              {!isGiftLine ? (
                <View className="flex-row items-center gap-2">
                  {canMinus && (
                    <Pressable
                      disabled={updating || rowBusy}
                      onPress={() =>
                        decOrRemove(item.productUnitId, item.quantity)
                      }
                      className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center"
                    >
                      {item.quantity === 1 ? (
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={20}
                          color="#111"
                        />
                      ) : (
                        <Feather name="minus" size={20} color="#111" />
                      )}
                    </Pressable>
                  )}

                  {rowBusy ? (
                    <View className="w-6 items-center">
                      <ActivityIndicator />
                    </View>
                  ) : (
                    <Text className="w-6 text-center">{item.quantity}</Text>
                  )}

                  <Pressable
                    disabled={updating || rowBusy || !canPlus}
                    onPress={() =>
                      inc(
                        item.productUnitId,
                        item.quantity,
                        item.stockQuantity ?? 0,
                      )
                    }
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      canPlus ? 'bg-zinc-100' : 'bg-zinc-200'
                    }`}
                  >
                    <Feather name="plus" size={20} color="#111" />
                  </Pressable>

                  <Pressable
                    disabled={deleting || rowBusy}
                    onPress={() => remove(item.productUnitId)}
                    className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center ml-1"
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={20}
                      color="#111"
                    />
                  </Pressable>
                </View>
              ) : (
                <View className="px-2 py-1 rounded-full bg-zinc-100">
                  <Text className="text-zinc-700">x{item.quantity}</Text>
                </View>
              )}
            </View>
          );
        }}
        ListFooterComponent={
          <View className="px-4">
            {/* Cách nhận hàng + địa chỉ */}
            <View className="mt-4 bg-white rounded-2xl p-4 border border-zinc-200">
              <Text className="text-[15px] font-semibold text-zinc-900 mb-3">
                Cách nhận hàng
              </Text>

              <View className="h-12 bg-zinc-100 rounded-2xl p-1 flex-row">
                <Pressable
                  onPress={() => setDeliveryType(EDeliveryType.HOME_DELIVERY)}
                  className={`flex-1 rounded-xl items-center justify-center ${
                    deliveryType === EDeliveryType.HOME_DELIVERY
                      ? 'bg-white'
                      : ''
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      deliveryType === EDeliveryType.HOME_DELIVERY
                        ? 'text-green-700'
                        : 'text-zinc-400'
                    }`}
                  >
                    Giao hàng tận nơi
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setDeliveryType(EDeliveryType.PICKUP_AT_STORE)}
                  className={`flex-1 rounded-xl items-center justify-center ${
                    deliveryType === EDeliveryType.PICKUP_AT_STORE
                      ? 'bg-white'
                      : ''
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      deliveryType === EDeliveryType.PICKUP_AT_STORE
                        ? 'text-green-700'
                        : 'text-zinc-400'
                    }`}
                  >
                    Nhận tại cửa hàng
                  </Text>
                </Pressable>
              </View>

              {deliveryType === EDeliveryType.HOME_DELIVERY && (
                <View className="mt-3">
                  <CheckoutAddressPicker
                    selectedAddressId={selectedAddress?.addressId}
                    onAddressChange={setSelectedAddress}
                  />
                </View>
              )}

              {deliveryType === EDeliveryType.PICKUP_AT_STORE && (
                <View className="mt-3">
                  <CheckoutStorePicker
                    selectedStoreId={selectedStore?.storeId}
                    onStoreChange={setSelectedStore}
                  />
                </View>
              )}
            </View>

            {/* Ghi chú */}
            <View className="mt-4 bg-white rounded-2xl p-4 border border-zinc-200">
              <Text className="text-[15px] font-semibold text-zinc-900 mb-2">
                Ghi chú đơn hàng
              </Text>
              <TextInput
                value={orderNote}
                onChangeText={setOrderNote}
                placeholder="VD: Giao sáng mai trước 9h, gọi trước khi tới"
                className="min-h-[44px] px-3 py-2 rounded-xl bg-zinc-100"
                multiline
              />
            </View>

            {/* Tổng kết + nút thanh toán */}
            <View className="mt-4 mb-2 bg-white rounded-2xl p-4 border border-zinc-200">
              <View className="bg-zinc-50 rounded-2xl p-3">
                <Row
                  label="Tạm tính"
                  value={`${totals.sub.toLocaleString('vi-VN')}đ`}
                />
                {!!totals.lineDiscount && (
                  <Row
                    label="Giảm giá"
                    value={`−${totals.lineDiscount.toLocaleString('vi-VN')}đ`}
                    highlight
                  />
                )}
                {!!totals.orderDiscount && (
                  <Row
                    label="Khuyến mãi hoá đơn"
                    value={`−${totals.orderDiscount.toLocaleString('vi-VN')}đ`}
                    highlight
                  />
                )}
                <Row
                  label="Tổng tiền"
                  value={`${totals.payable.toLocaleString('vi-VN')}đ`}
                  bold
                />
              </View>

              {(cart?.appliedOrderPromotions?.length ?? 0) > 0 && (
                <View className="mt-3 border border-orange-200 rounded-2xl p-3">
                  {cart!.appliedOrderPromotions!.map((p, idx) => (
                    <Text key={idx} className="text-xs text-orange-700">
                      % {p.promotionSummary}
                    </Text>
                  ))}
                </View>
              )}

              <Pressable
                disabled={
                  creatingOrder ||
                  (deliveryType === EDeliveryType.HOME_DELIVERY && !selectedAddress) ||
                  (deliveryType === EDeliveryType.PICKUP_AT_STORE && !selectedStore)
                }
                onPress={async () => {
                  if (deliveryType === EDeliveryType.HOME_DELIVERY && !selectedAddress) {
                    Alert.alert('Thông báo', 'Vui lòng chọn địa chỉ giao hàng');
                    return;
                  }
                  if (deliveryType === EDeliveryType.PICKUP_AT_STORE && !selectedStore) {
                    Alert.alert('Thông báo', 'Vui lòng chọn cửa hàng nhận hàng');
                    return;
                  }
                  try {
                    const payload: any = {
                      deliveryType,
                      paymentMethod: EPaymentMethod.ONLINE,
                      orderNote,
                    };
                    if (deliveryType === EDeliveryType.HOME_DELIVERY && selectedAddress) {
                      payload.addressId = selectedAddress.addressId;
                    }
                    if (deliveryType === EDeliveryType.PICKUP_AT_STORE && selectedStore) {
                      payload.storeId = selectedStore.storeId;
                    }

                    const res = await createOrder(payload);
                    const orderId = res?.data?.orderId;
                    const orderCode = res?.data?.orderCode || '';
                    setLastOrderCode(orderCode);
                    setLastOrderId(orderId);

                    const info = res?.data?.onlinePaymentInfo;
                    if (info?.qrCode || info?.paymentUrl) {
                      setPayInfo({
                        qrCode: info.qrCode,
                        paymentUrl: info.paymentUrl,
                        paymentProvider: info.paymentProvider,
                        expirationTime: info.expirationTime,
                      });
                      setShowPayModal(true);
                    } else {
                      Alert.alert(
                        'Lỗi',
                        'Không tìm thấy thông tin thanh toán. Vui lòng thử lại.',
                      );
                    }
                  } catch (e) {
                    Alert.alert(
                      'Lỗi',
                      'Không thể tạo đơn hàng. Vui lòng thử lại.',
                    );
                  }
                }}
                className="mt-3 h-12 rounded-full bg-red-600 items-center justify-center"
              >
                <Text className="text-white font-semibold">
                  {creatingOrder
                    ? 'ĐANG XỬ LÝ...'
                    : `THANH TOÁN ${totals.payable.toLocaleString('vi-VN')}đ`}
                </Text>
              </Pressable>
            </View>
          </View>
        }
      />

      {/* Modal Payment Provider */}
      <Modal
        visible={showPayModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowPayModal(false);
          setSelectedPaymentProvider(null);
        }}
      >
        <View className="flex-1 bg-black/40 items-center justify-end">
          <View className="w-full bg-white rounded-t-3xl p-6">
            <Text className="text-center text-lg font-semibold mb-1">
              Đơn hàng {lastOrderCode || ''}
            </Text>
            <Text className="text-center text-zinc-500 mb-4">
              Chọn phương thức thanh toán
            </Text>

            {/* Provider Selection */}
            {!selectedPaymentProvider ? (
              <View className="gap-3 mb-4">
                {[
                  EPaymentProvider.MOMO,
                  EPaymentProvider.VNPAY,
                  EPaymentProvider.PAYOS,
                  EPaymentProvider.BANK_TRANSFER,
                ].map((provider) => (
                  <Pressable
                    key={provider}
                    onPress={() => setSelectedPaymentProvider(provider)}
                    className="h-16 rounded-xl bg-zinc-50 border border-zinc-200 items-center justify-center flex-row gap-3 px-4"
                  >
                    <View className="w-12 h-12 rounded-lg bg-white items-center justify-center border border-zinc-200">
                      {provider === EPaymentProvider.MOMO && (
                        <Text className="text-sm font-bold text-red-600">
                          M
                        </Text>
                      )}
                      {provider === EPaymentProvider.VNPAY && (
                        <Text className="text-sm font-bold text-blue-600">
                          VN
                        </Text>
                      )}
                      {provider === EPaymentProvider.PAYOS && (
                        <Text className="text-sm font-bold text-purple-600">
                          PO
                        </Text>
                      )}
                      {provider === EPaymentProvider.BANK_TRANSFER && (
                        <Text className="text-sm font-bold text-green-600">
                          BT
                        </Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-zinc-900">
                        {provider === EPaymentProvider.MOMO && 'Momo'}
                        {provider === EPaymentProvider.VNPAY && 'VNPay'}
                        {provider === EPaymentProvider.PAYOS && 'PayOS'}
                        {provider === EPaymentProvider.BANK_TRANSFER &&
                          'Chuyển khoản'}
                      </Text>
                      <Text className="text-xs text-zinc-500">
                        {provider === EPaymentProvider.MOMO &&
                          'Ví điện tử Momo'}
                        {provider === EPaymentProvider.VNPAY &&
                          'Cổng thanh toán VNPay'}
                        {provider === EPaymentProvider.PAYOS &&
                          'PayOS - Giải pháp thanh toán'}
                        {provider === EPaymentProvider.BANK_TRANSFER &&
                          'Chuyển khoản ngân hàng'}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#a1a1a1"
                    />
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="mb-4">
                {/* Back button and Provider Info */}
                <Pressable
                  onPress={() => setSelectedPaymentProvider(null)}
                  className="h-12 rounded-xl bg-zinc-100 items-center justify-center flex-row gap-2 mb-4"
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={20}
                    color="#111827"
                  />
                  <Text className="text-zinc-800 font-medium">Quay lại</Text>
                </Pressable>

                <View className="bg-zinc-50 rounded-xl p-4 mb-4">
                  <Text className="font-semibold text-zinc-900 mb-1">
                    {selectedPaymentProvider === EPaymentProvider.MOMO &&
                      'Ví Momo'}
                    {selectedPaymentProvider === EPaymentProvider.VNPAY &&
                      'VNPay'}
                    {selectedPaymentProvider === EPaymentProvider.PAYOS &&
                      'PayOS'}
                    {selectedPaymentProvider ===
                      EPaymentProvider.BANK_TRANSFER && 'Chuyển khoản'}
                  </Text>
                  <Text className="text-sm text-zinc-600 mb-3">
                    {selectedPaymentProvider === EPaymentProvider.MOMO &&
                      'Mở ứng dụng Momo để hoàn tất thanh toán'}
                    {selectedPaymentProvider === EPaymentProvider.VNPAY &&
                      'Mở ứng dụng VNPay để hoàn tất thanh toán'}
                    {selectedPaymentProvider === EPaymentProvider.PAYOS &&
                      'Mở trang PayOS để hoàn tất thanh toán'}
                    {selectedPaymentProvider ===
                      EPaymentProvider.BANK_TRANSFER &&
                      'Thực hiện chuyển khoản tới tài khoản cửa hàng'}
                  </Text>

                  {payInfo?.qrCode && (
                    <View className="w-full rounded-lg bg-white items-center justify-center border border-zinc-200 mb-3 p-3">
                      <QRCode
                        value={payInfo.qrCode}
                        size={180}
                        color="#111827"
                        backgroundColor="#ffffff"
                      />
                    </View>
                  )}
                </View>

                {/* Payment Button */}
                <Pressable
                  onPress={() => {
                    if (payInfo?.paymentUrl && selectedPaymentProvider) {
                      const deepLink = getPaymentDeepLink(
                        selectedPaymentProvider,
                        payInfo.paymentUrl,
                      );
                      if (deepLink) {
                        Linking.openURL(deepLink).catch(() => {
                          // If app not installed, try opening with web URL
                          if (payInfo.paymentUrl) {
                            Linking.openURL(payInfo.paymentUrl);
                          }
                        });
                      }
                    }
                  }}
                  className="h-12 rounded-xl bg-red-600 items-center justify-center mb-2"
                >
                  <Text className="text-white font-semibold">
                    Mở{' '}
                    {selectedPaymentProvider === EPaymentProvider.MOMO &&
                      'Momo'}
                    {selectedPaymentProvider === EPaymentProvider.VNPAY &&
                      'VNPay'}
                    {selectedPaymentProvider === EPaymentProvider.PAYOS &&
                      'PayOS'}
                    {selectedPaymentProvider ===
                      EPaymentProvider.BANK_TRANSFER && 'Trang thanh toán'}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Loading state - Đang kiểm tra trạng thái đơn hàng */}
            {orderPending && (
              <View className="h-12 rounded-xl bg-zinc-100 items-center justify-center flex-row gap-2">
                <ActivityIndicator size="small" color="#666" />
                <Text className="text-zinc-700 font-medium">Đang xử lý...</Text>
              </View>
            )}

            {!!payInfo?.expirationTime && (
              <Text className="text-[12px] text-center text-zinc-500 mt-3">
                Hết hạn:{' '}
                {new Date(payInfo.expirationTime).toLocaleString('vi-VN')}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

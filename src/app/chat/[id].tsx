import { EDeliveryType, EPaymentMethod } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import {
  cartKeys,
  useCartDelete,
  useCartDeleteProduct,
  useCartList,
  useCartUpdate,
  useOrderCreate,
} from '@/react-query';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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

export default function CartScreen() {
  const router = useRouter();

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
    EPaymentMethod.CASH,
  );
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Ho Chi Minh'); // mặc định, user có thể sửa
  const [orderNote, setOrderNote] = useState<string>('');

  const [showPayModal, setShowPayModal] = useState(false);
  const [payInfo, setPayInfo] = useState<{
    paymentUrl?: string;
    qrCode?: string;
    paymentProvider?: string;
    expirationTime?: string;
  } | null>(null);
  const [lastOrderCode, setLastOrderCode] = useState<string | null>(null);

  const cart = data?.data;
  const items = cart?.items ?? [];

  const totals = useMemo(() => {
    const sub = cart?.subTotal ?? 0;
    const lineDiscount = cart?.lineItemDiscount ?? 0;
    const orderDiscount = cart?.orderDiscount ?? 0;
    const payable = cart?.totalPayable ?? 0;
    return { sub, lineDiscount, orderDiscount, payable };
  }, [cart]);

  // Loading theo từng dòng khi +/−
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const inc = async (id: number, cur: number, stock: number) => {
    const next = Math.min(cur + 1, stock);
    try {
      setUpdatingId(id);
      await updateCart({ productUnitId: id, quantity: next });
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
    } finally {
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      setUpdatingId(null);
    }
  };

  const decOrRemove = async (id: number, cur: number) => {
    // nếu đang là 1 thì xóa hẳn dòng
    if (cur <= 1) {
      await deleteLine({ productUnitId: id });
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      return;
    }
    // còn >1 thì giảm như bình thường
    await dec(id, cur);
  };

  const remove = async (id: number) => {
    await deleteLine({ productUnitId: id });
    await queryClient.invalidateQueries({ queryKey: cartKeys.all });
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
        },
      },
    ]);
  };

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  const EmptyState = () => (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-12 pb-3 bg-red-600 flex-row items-center justify-between">
        <Text className="text-white text-xl font-semibold">Giỏ hàng</Text>
      </View>

      <View className="flex-1 items-center justify-center px-10">
        <View className="w-20 h-20 rounded-full bg-zinc-100 items-center justify-center mb-4">
          <Feather name="plus" size={20} color="#111" />
        </View>
        <Text className="text-[18px] text-zinc-700 mb-4">Chưa có sản phẩm</Text>

        <Pressable
          onPress={() => router.push('/')}
          className="px-6 py-3 rounded-2xl bg-red-600"
        >
          <Text className="text-white font-semibold">THÊM SẢN PHẨM</Text>
        </Pressable>
      </View>
    </View>
  );

  if (!items.length || (cart?.totalItems ?? 0) === 0) {
    return <EmptyState />;
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
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

      {/* CONTENT (scroll) */}
      <View className="flex-1">
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.lineItemId)}
          ItemSeparatorComponent={() => <View className="h-px bg-zinc-100" />}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => {
            const discounted =
              (item.finalTotal ?? item.originalTotal) < item.originalTotal;

            // Dòng quà tặng (tặng miễn phí 100%) → ẩn controls
            const isGiftLine =
              !!item.promotionApplied &&
              item.promotionApplied.discountType === 'percentage' &&
              item.promotionApplied.discountValue === 100;

            const canPlus =
              !isGiftLine && item.quantity < (item.stockQuantity ?? 0);
            const canMinus = !isGiftLine && item.quantity > 0;

            const rowBusy = updatingId === item.productUnitId;

            return (
              <View className="px-4 py-3 flex-row gap-3 items-center">
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

                {/* Quantity controls: ẨN nếu là quà tặng */}
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
        />
      </View>

      {/* --- Chọn cách nhận hàng --- */}
      <View className="mt-3 px-4">
        <Text className="mb-2 font-semibold text-zinc-900">Cách nhận hàng</Text>

        {/* Thanh pill */}
        <View className="h-12 bg-zinc-100 rounded-2xl p-1 flex-row">
          <Pressable
            onPress={() => setDeliveryType(EDeliveryType.HOME_DELIVERY)}
            className={`flex-1 rounded-xl items-center justify-center ${
              deliveryType === EDeliveryType.HOME_DELIVERY ? 'bg-white' : ''
            }`}
            style={{
              shadowColor:
                deliveryType === EDeliveryType.HOME_DELIVERY
                  ? '#000'
                  : 'transparent',
              shadowOpacity:
                deliveryType === EDeliveryType.HOME_DELIVERY ? 0.05 : 0,
              shadowRadius: 4,
              elevation: deliveryType === EDeliveryType.HOME_DELIVERY ? 1 : 0,
            }}
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
              deliveryType === EDeliveryType.PICKUP_AT_STORE ? 'bg-white' : ''
            }`}
            style={{
              shadowColor:
                deliveryType === EDeliveryType.PICKUP_AT_STORE
                  ? '#000'
                  : 'transparent',
              shadowOpacity:
                deliveryType === EDeliveryType.PICKUP_AT_STORE ? 0.05 : 0,
              shadowRadius: 4,
              elevation: deliveryType === EDeliveryType.PICKUP_AT_STORE ? 1 : 0,
            }}
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

        {/* Địa chỉ (chỉ hiện khi GHTN) */}
        {deliveryType === EDeliveryType.HOME_DELIVERY && (
          <View className="mt-3">
            <Text className="mb-1 text-zinc-700">Địa chỉ giao hàng</Text>
            <TextInput
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Ví dụ: 347/32 Bùi Đình Túy, P.14, Q.BT, TP.HCM"
              className="h-11 px-3 rounded-xl bg-zinc-100"
            />
          </View>
        )}
      </View>

      {/* --- Phương thức thanh toán --- */}
      <View className="mt-4 px-4">
        <Text className="mb-2 font-semibold text-zinc-900">
          Phương thức thanh toán
        </Text>
        <View className="h-12 bg-zinc-100 rounded-2xl p-1 flex-row">
          <Pressable
            onPress={() => setPaymentMethod(EPaymentMethod.CASH)}
            className={`flex-1 rounded-xl items-center justify-center ${
              paymentMethod === EPaymentMethod.CASH ? 'bg-white' : ''
            }`}
          >
            <Text
              className={`font-semibold ${
                paymentMethod === EPaymentMethod.CASH
                  ? 'text-green-700'
                  : 'text-zinc-400'
              }`}
            >
              Tiền mặt
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setPaymentMethod(EPaymentMethod.ONLINE)}
            className={`flex-1 rounded-xl items-center justify-center ${
              paymentMethod === EPaymentMethod.ONLINE ? 'bg-white' : ''
            }`}
          >
            <Text
              className={`font-semibold ${
                paymentMethod === EPaymentMethod.ONLINE
                  ? 'text-green-700'
                  : 'text-zinc-400'
              }`}
            >
              Chuyển khoản
            </Text>
          </Pressable>
        </View>
      </View>

      {/* --- Ghi chú --- */}
      <View className="mt-4 px-4">
        <Text className="mb-1 text-zinc-700">Ghi chú</Text>
        <TextInput
          value={orderNote}
          onChangeText={setOrderNote}
          placeholder="Ví dụ: Giao sáng mai trước 9h, gọi trước khi tới"
          className="min-h-[44px] px-3 py-2 rounded-xl bg-zinc-100"
          multiline
        />
      </View>

      {/* FOOTER (tự co giãn theo nội dung, luôn ở đáy) */}
      <View className="border-t border-zinc-200 bg-white px-4 pt-3 pb-4">
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
          disabled={creatingOrder}
          onPress={async () => {
            try {
              const payload: any = {
                deliveryType,
                paymentMethod,
                orderNote,
              };
              if (deliveryType === EDeliveryType.HOME_DELIVERY) {
                payload.deliveryAddress =
                  deliveryAddress?.trim() || 'Ho Chi Minh';
              }

              const res = await createOrder(payload);
              const orderId = res?.data?.orderId;
              const orderCode = res?.data?.orderCode || '';
              setLastOrderCode(orderCode);

              // ✅ Làm mới giỏ hàng sau khi tạo đơn thành công
              await queryClient.invalidateQueries({ queryKey: cartKeys.all });

              if (paymentMethod === EPaymentMethod.CASH) {
                // ✅ Hiển thị toast/alert & điều hướng vào trang đơn
                Alert.alert('Đặt hàng thành công', `Mã đơn: ${orderCode}`, [
                  {
                    text: 'Xem đơn',
                    onPress: () => router.push(`/orders/${orderId}`),
                  },
                  { text: 'Đóng' },
                ]);
              } else {
                // ✅ ONLINE: show QR trong app
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
                    'Đặt hàng thành công',
                    'Không tìm thấy thông tin thanh toán.',
                  );
                  router.push(`/orders/${orderId}`);
                }
              }
            } catch (e) {
              Alert.alert('Lỗi', 'Không thể tạo đơn hàng. Vui lòng thử lại.');
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

      <Modal
        visible={showPayModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPayModal(false)}
      >
        <View className="flex-1 bg-black/40 items-center justify-end">
          <View className="w-full bg-white rounded-t-3xl p-6 pb-8">
            <Text className="text-center text-lg font-semibold mb-1">
              Đơn hàng {lastOrderCode || ''}
            </Text>
            <Text className="text-center text-zinc-500 mb-4">
              Quét mã để chuyển khoản
            </Text>

            <View className="items-center justify-center mb-4">
              {/* Nếu đã cài react-native-qrcode-svg thì render QR từ chuỗi payInfo.qrCode */}
              {/* <QRCode value={payInfo?.qrCode || ''} size={220} /> */}

              {!payInfo?.qrCode ? (
                <Text className="text-zinc-500">
                  Không có QR, vui lòng dùng link
                </Text>
              ) : (
                <View className="w-[230px] h-[230px] rounded-2xl bg-white items-center justify-center">
                  {/* bạn có thể đổi sang <QRCode /> ở trên cho đẹp */}
                  <Text className="text-center text-[12px] text-zinc-500 px-2">
                    {payInfo.qrCode.slice(0, 64)}...
                  </Text>
                </View>
              )}
            </View>

            {!!payInfo?.paymentUrl && (
              <Pressable
                onPress={() => {
                  // Tuỳ chọn mở web ngoài
                  Linking.openURL(payInfo.paymentUrl!);
                }}
                className="h-11 rounded-xl bg-zinc-100 items-center justify-center mb-2"
              >
                <Text className="text-zinc-800">
                  Mở trang thanh toán (tuỳ chọn)
                </Text>
              </Pressable>
            )}

            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setShowPayModal(false)}
                className="flex-1 h-12 rounded-xl bg-zinc-100 items-center justify-center"
              >
                <Text className="text-zinc-800 font-medium">Để sau</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowPayModal(false);
                  if (lastOrderCode) router.push('/orders');
                }}
                className="flex-1 h-12 rounded-xl bg-green-600 items-center justify-center"
              >
                <Text className="text-white font-semibold">Xem đơn hàng</Text>
              </Pressable>
            </View>

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

import { EOrderStatus } from '@/lib';
import { useOrderList } from '@/react-query';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

// ===== Helpers =====
const money = (v?: number | null) => (v ?? 0).toLocaleString('vi-VN') + 'đ';

const statusChipStyle: Record<
  EOrderStatus | 'UNKNOWN',
  { bg: string; text: string; label: string }
> = {
  [EOrderStatus.UNPAID]: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    label: 'Chưa thanh toán',
  },
  [EOrderStatus.PENDING]: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    label: 'Đang xử lý',
  },
  [EOrderStatus.PREPARED]: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    label: 'Đã chuẩn bị',
  },
  [EOrderStatus.SHIPPING]: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    label: 'Đang giao',
  },
  [EOrderStatus.DELIVERED]: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    label: 'Đã giao hàng',
  },
  [EOrderStatus.COMPLETED]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    label: 'Đã hoàn thành',
  },
  [EOrderStatus.CANCELLED]: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    label: 'Đã hủy',
  },
  UNKNOWN: { bg: 'bg-zinc-50', text: 'text-zinc-600', label: 'Không rõ' },
};

const SegButton = ({
  active,
  label,
  onPress,
}: {
  active?: boolean;
  label: string;
  onPress?: () => void;
}) => (
  <Pressable
    onPress={onPress}
    // bỏ flex-1, dùng px cho rộng vừa nội dung
    className={`px-4 h-10 rounded-xl items-center justify-center mr-2 ${
      active ? 'bg-white' : 'bg-transparent'
    }`}
  >
    <Text
      className={`${active ? 'text-green-700 font-semibold' : 'text-zinc-400'}`}
    >
      {label}
    </Text>
  </Pressable>
);

// Các tab trạng thái đơn hàng (đã loại bỏ DELIVERED và UNPAID)
const STATUS_TABS: { key: 'ALL' | EOrderStatus; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: EOrderStatus.PENDING, label: 'Đang xử lý' },
  { key: EOrderStatus.PREPARED, label: 'Đã chuẩn bị' },
  { key: EOrderStatus.SHIPPING, label: 'Đang giao' },
  { key: EOrderStatus.COMPLETED, label: 'Hoàn thành' },
  { key: EOrderStatus.CANCELLED, label: 'Đã hủy' },
];

// ===== Screen =====
export default function OrdersListScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'ALL' | EOrderStatus>('ALL');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const pageSize = 10;
  const scrollViewRef = useRef<ScrollView>(null);

  // Params truy vấn ổn định theo tab/page
  const params = useMemo(
    () => ({ limit: pageSize, page, status: tab === 'ALL' ? undefined : tab }),
    [page, tab],
  );
  const { data: orderListData, isPending } = useOrderList(params as any);

  // Chuẩn hoá data từ server và lọc bỏ các đơn hàng có trạng thái UNPAID
  const serverItems: any[] = useMemo(() => {
    const raw = (orderListData?.data?.content ??
      orderListData?.data ??
      []) as any[];
    const items = Array.isArray(raw) ? raw : [];
    // Lọc bỏ các đơn hàng có trạng thái UNPAID
    return items.filter(
      (item: any) =>
        item.status !== EOrderStatus.UNPAID &&
        item.orderStatus !== EOrderStatus.UNPAID,
    );
  }, [orderListData]);

  // Tổng trang (nếu server có phân trang) và hasMore chính xác
  const totalPages =
    typeof orderListData?.data?.totalPages === 'number'
      ? orderListData.data.totalPages
      : undefined;
  const hasMore =
    totalPages !== undefined
      ? page < totalPages - 1
      : serverItems.length === pageSize;

  // Chỉ áp state khi page/data thực sự đổi (tránh giật)
  const lastApplied = useRef<{ page: number; hash: string } | null>(null);
  React.useEffect(() => {
    if (isPending) return;
    const hash = serverItems
      .map((it: any) =>
        String(it.orderId ?? it.id ?? it.orderCode ?? it.createdAt),
      )
      .join('|');

    if (
      lastApplied.current &&
      lastApplied.current.page === page &&
      lastApplied.current.hash === hash
    ) {
      return;
    }

    setItems((prev) => (page === 0 ? serverItems : [...prev, ...serverItems]));
    lastApplied.current = { page, hash };
  }, [isPending, page, serverItems]);

  const onRefresh = useCallback(() => {
    lastApplied.current = null;
    setItems([]);
    setPage(0);
  }, []);

  const loadMore = () => {
    if (isPending || !hasMore) return;
    setPage((p) => p + 1);
  };

  // Hàm xử lý khi thay đổi tab lọc trạng thái
  const onChangeTab = (k: 'ALL' | EOrderStatus) => {
    if (k === tab) return;
    setTab(k);
    lastApplied.current = null;
    setItems([]);
    setPage(0);
    // Cuộn thanh tab đến vị trí của tab được chọn
    const tabIndex = STATUS_TABS.findIndex((t) => t.key === k);
    if (tabIndex >= 0 && scrollViewRef.current) {
      // Ước tính mỗi tab có chiều rộng khoảng 90px (padding + text + margin)
      const estimatedTabWidth = 90;
      const scrollX = Math.max(0, tabIndex * estimatedTabWidth - 50);
      scrollViewRef.current.scrollTo({ x: scrollX, animated: true });
    }
  };

  // ===== Renderers =====
  const Header = () => (
    <View>
      {/* Header đỏ đồng bộ theme */}
      <View className="px-4 pt-12 pb-4 bg-red-600">
        <Text className="text-white text-lg font-semibold">
          Đơn hàng đã mua
        </Text>
        <Text className="text-white/80 mt-1">
          Theo dõi trạng thái & mua lại nhanh
        </Text>
      </View>

      {/* Segmented tabs (CUỘN NGANG) */}
      <View className="mx-4 -mt-5 rounded-2xl bg-zinc-100 border border-zinc-200">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 6, paddingRight: 10 }}
        >
          {STATUS_TABS.map((t) => (
            <SegButton
              key={String(t.key)}
              active={tab === t.key}
              label={t.label}
              onPress={() => onChangeTab(t.key)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Spacer */}
      <View className="h-3" />
    </View>
  );

  const Item = ({ item }: { item: any }) => {
    const id = item.orderId ?? item.id;
    const code = item.orderCode ?? `#${id}`;
    const createdAt = item.createdAt ?? item.orderDate ?? item.created_at;
    const sum = item.totalAmount ?? item.total ?? item.amount ?? 0;
    const thumbs: string[] = item.previewImages ?? item.images ?? [];
    const st: EOrderStatus | 'UNKNOWN' =
      (item.status as EOrderStatus) ??
      (item.orderStatus as EOrderStatus) ??
      'UNKNOWN';
    const s = statusChipStyle[st] ?? statusChipStyle.UNKNOWN;

    return (
      <View className="mx-4 mb-3 p-4 rounded-2xl bg-white border border-zinc-200">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-semibold">Đơn hàng {code}</Text>
            {!!createdAt && (
              <Text className="text-zinc-500 mt-0.5">
                Đặt lúc: {new Date(createdAt).toLocaleString('vi-VN')}
              </Text>
            )}
          </View>

          {/* Chip trạng thái */}
          <View className={`px-2 py-1 rounded-full ${s.bg}`}>
            <Text className={`text-xs ${s.text} font-medium`}>{s.label}</Text>
          </View>
        </View>

        {!!thumbs?.length && (
          <View className="flex-row gap-2 mt-3">
            {thumbs.slice(0, 3).map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                className="w-16 h-16 rounded-xl bg-zinc-100"
                resizeMode="cover"
              />
            ))}
          </View>
        )}

        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-zinc-500">Tổng đơn hàng</Text>
          <Text className="font-semibold">{money(sum)}</Text>
        </View>

        <View className="flex-row gap-2 mt-3">
          <Pressable
            onPress={() => router.push(`/orders/${id}`)}
            className="flex-1 h-11 rounded-xl bg-zinc-100 items-center justify-center"
          >
            <Text className="text-zinc-800 font-medium">Xem chi tiết</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push(`/orders/${id}`)}
            className="flex-1 h-11 rounded-xl bg-red-600 items-center justify-center"
          >
            <Text className="text-white font-semibold">Mua lại đơn</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-zinc-100">
      <FlatList
        data={items}
        keyExtractor={(it, idx) => String(it.orderId ?? it.id ?? idx)}
        renderItem={({ item }) => <Item item={item} />}
        ListHeaderComponent={<Header />}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        refreshControl={
          <RefreshControl
            refreshing={page === 0 && isPending}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={() => (
          <View className="items-center justify-center mt-24">
            <Text className="text-zinc-500">
              Chưa có đơn {tab === 'ALL' ? '' : 'ở trạng thái này'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

import type { IStructuredPolicyData } from '@/dtos';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface PolicyCardProps {
  item: IStructuredPolicyData;
}

const getPolicyIcon = (policyType: string): string => {
  switch (policyType) {
    case 'DELIVERY_AND_RETURN':
      return 'local-shipping';
    case 'WARRANTY':
      return 'verified';
    case 'REFUND':
      return 'attach-money';
    default:
      return 'info';
  }
};

const getPolicyColor = (policyType: string): string => {
  switch (policyType) {
    case 'DELIVERY_AND_RETURN':
      return '#0891b2';
    case 'WARRANTY':
      return '#7c3aed';
    case 'REFUND':
      return '#059669';
    default:
      return '#6b7280';
  }
};

const getPolicyLabel = (policyType: string): string => {
  switch (policyType) {
    case 'DELIVERY_AND_RETURN':
      return 'Giao hàng & Đổi trả';
    case 'WARRANTY':
      return 'Bảo hành';
    case 'REFUND':
      return 'Hoàn tiền';
    default:
      return 'Chính sách';
  }
};

export function PolicyCard({ item }: PolicyCardProps) {
  const color = getPolicyColor(item.policy_type);
  const icon = getPolicyIcon(item.policy_type);
  const label = getPolicyLabel(item.policy_type);

  return (
    <View
      className="rounded-lg p-4 m-2 shadow-sm border"
      style={{
        backgroundColor: `${color}15`,
        borderColor: color,
      }}
    >
      {/* Header */}
      <View className="flex-row items-start gap-2 mb-3">
        <View
          className="w-8 h-8 rounded-lg items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <MaterialIcons name={icon as any} size={18} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-[13px] font-semibold" style={{ color }}>
            {label}
          </Text>
          <Text className="text-[12px] text-zinc-600 mt-0.5">{item.title}</Text>
        </View>
      </View>

      {/* Details */}
      {item.details && item.details.length > 0 && (
        <View className="mb-3">
          <Text className="text-[11px] font-semibold text-zinc-700 mb-1.5">
            Chi tiết:
          </Text>
          {item.details.map((detail, idx) => (
            <View key={idx} className="flex-row items-start gap-2 mb-1.5">
              <Text className="text-[11px] font-bold mt-0.5" style={{ color }}>
                •
              </Text>
              <Text className="flex-1 text-[11px] text-zinc-700">{detail}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Conditions */}
      {item.conditions && item.conditions.length > 0 && (
        <View className="bg-white/50 rounded-lg p-2.5 mb-3">
          <Text className="text-[10px] font-semibold text-zinc-600 mb-1">
            Điều kiện:
          </Text>
          {item.conditions.map((condition, idx) => (
            <Text key={idx} className="text-[10px] text-zinc-600 mb-0.5">
              • {condition}
            </Text>
          ))}
        </View>
      )}

      {/* Contact Info */}
      {item.contact_info && (
        <View className="flex-row items-start gap-1.5 pt-2 border-t border-white/20">
          <MaterialIcons
            name="help"
            size={12}
            color={color}
            style={{ marginTop: 2 }}
          />
          <Text className="flex-1 text-[10px] text-zinc-600 mt-0.5">
            {item.contact_info}
          </Text>
        </View>
      )}
    </View>
  );
}

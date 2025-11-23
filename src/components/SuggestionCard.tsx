import { Feather } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

interface SuggestionCardProps {
  text: string;
  onPress: (suggestion: string) => void;
}

export function SuggestionCard({ text, onPress }: SuggestionCardProps) {
  return (
    <Pressable
      onPress={() => onPress(text)}
      className="bg-white border border-red-200 rounded-lg px-3 py-2 mb-2 flex-row items-center gap-2"
    >
      <Feather name="help-circle" size={16} color="#dc2626" />
      <Text className="flex-1 text-[13px] text-zinc-700">{text}</Text>
      <Feather name="arrow-right" size={14} color="#dc2626" />
    </Pressable>
  );
}

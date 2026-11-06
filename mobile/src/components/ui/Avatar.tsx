import { View } from 'react-native';

import { colors } from '@/theme/colors';

import { AppText } from './AppText';

export type AvatarTone = 'peach' | 'sage' | 'steel';

const RING_WIDTH = 3;

type AvatarProps = {
  initial: string;
  tone?: AvatarTone;
  size?: number;
  ringColor?: string;
};

export function Avatar({
  initial,
  tone = 'peach',
  size = 48,
  ringColor = colors.white,
}: AvatarProps) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: RING_WIDTH,
        borderColor: ringColor,
        backgroundColor: colors[tone],
      }}
    >
      <AppText className="font-bold" style={{ fontSize: size * 0.4 }}>
        {initial}
      </AppText>
    </View>
  );
}

type AvatarStackItem = {
  id: string;
  initial: string;
  tone: AvatarTone;
};

type AvatarStackProps = {
  items: readonly AvatarStackItem[];
  size?: number;
  overlap?: number;
  ringColor?: string;
};

export function AvatarStack({
  items,
  size = 36,
  overlap = 10,
  ringColor = colors.white,
}: AvatarStackProps) {
  return (
    <View className="flex-row">
      {items.map((item, index) => (
        <View key={item.id} style={{ marginLeft: index === 0 ? 0 : -overlap }}>
          <Avatar
            initial={item.initial}
            tone={item.tone}
            size={size}
            ringColor={ringColor}
          />
        </View>
      ))}
    </View>
  );
}

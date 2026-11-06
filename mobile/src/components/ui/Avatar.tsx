import { View } from 'react-native';

import { colors } from '@/theme/colors';

import { AppText } from './AppText';

export type AvatarTone = 'peach' | 'sage' | 'steel';

const DEFAULT_RING_WIDTH = 3;

type AvatarProps = {
  initial: string;
  tone?: AvatarTone;
  size?: number;
  ringColor?: string;
  ringWidth?: number;
};

export function Avatar({
  initial,
  tone = 'peach',
  size = 48,
  ringColor = colors.white,
  ringWidth = DEFAULT_RING_WIDTH,
}: AvatarProps) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: ringWidth,
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
  ringWidth?: number;
};

export function AvatarStack({
  items,
  size = 36,
  overlap = 10,
  ringColor = colors.white,
  ringWidth = DEFAULT_RING_WIDTH,
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
            ringWidth={ringWidth}
          />
        </View>
      ))}
    </View>
  );
}

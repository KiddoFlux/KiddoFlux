import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { shadows } from '@/theme/shadows';

type LiveChipProps = {
  label: string;
  /** With a handler it's a button; without one it only shows the status. */
  onPress?: () => void;
};

export function LiveChip({ label, onPress }: LiveChipProps) {
  const content = (
    <>
      <View className="h-2 w-2 rounded-full bg-peach" />
      <AppText numberOfLines={1} className="text-[13px] text-mint">
        {label}
      </AppText>
    </>
  );
  const chipClass = 'h-11 flex-row items-center gap-2 rounded-full bg-ink px-4';

  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Revino la cursa live"
      onPress={onPress}
      className={chipClass}
      style={shadows.dark}
    >
      {content}
    </Pressable>
  ) : (
    <View
      accessible
      accessibilityLiveRegion="polite"
      className={chipClass}
      style={shadows.dark}
    >
      {content}
    </View>
  );
}

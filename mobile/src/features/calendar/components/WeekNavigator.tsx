import {
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

type ArrowButtonProps = {
  Icon: LucideIcon;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
};

function ArrowButton({
  Icon,
  accessibilityLabel,
  disabled,
  onPress,
}: ArrowButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`h-11 w-11 items-center justify-center rounded-full bg-white ${
        disabled ? 'opacity-40' : ''
      }`}
      style={disabled ? undefined : shadows.soft}
    >
      <Icon size={22} color={colors.navy} strokeWidth={ICON_STROKE_WIDTH} />
    </Pressable>
  );
}

type WeekNavigatorProps = {
  title: string;
  range: string;
  /** Shown under the range, for example while the schedule isn't final yet. */
  note: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function WeekNavigator({
  title,
  range,
  note,
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
}: WeekNavigatorProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <ArrowButton
        Icon={ChevronLeft}
        accessibilityLabel="Săptămâna anterioară"
        disabled={!canGoBack}
        onPress={onPrevious}
      />

      <View
        accessible
        accessibilityLiveRegion="polite"
        className="flex-1 items-center"
      >
        <AppText numberOfLines={1} className="text-[17px]">
          {title}
        </AppText>
        <AppText numberOfLines={1} className="text-[13px] text-navy">
          {range}
        </AppText>
        {note ? (
          <AppText numberOfLines={1} className="text-[12px] text-steel">
            {note}
          </AppText>
        ) : null}
      </View>

      <ArrowButton
        Icon={ChevronRight}
        accessibilityLabel="Săptămâna următoare"
        disabled={!canGoForward}
        onPress={onNext}
      />
    </View>
  );
}

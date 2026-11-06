import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

type CalendarHeaderProps = {
  monthYear: string;
  onPlanRides: () => void;
};

export function CalendarHeader({
  monthYear,
  onPlanRides,
}: CalendarHeaderProps) {
  return (
    <View className="flex-row items-end justify-between gap-3">
      <View className="flex-1">
        <AppText
          numberOfLines={1}
          className="text-[22px] tracking-[-0.3px] text-navy"
        >
          {monthYear}
        </AppText>
        <AppText
          numberOfLines={1}
          className="text-[52px] leading-[54.6px] tracking-[-1.5px]"
        >
          Calendar
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Planifică cursele"
        onPress={onPlanRides}
        className="h-[52px] w-[52px] items-center justify-center rounded-full bg-peach"
        style={shadows.peach}
      >
        <Plus size={24} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
      </Pressable>
    </View>
  );
}

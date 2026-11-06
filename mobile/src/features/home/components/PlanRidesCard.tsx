import { ArrowRight, Clock } from 'lucide-react-native';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';
import { isWeekScheduleFinal, PLANNING_DEADLINE_HOUR } from '@/utils/schedule';

const SCHOOL_DAY_LABELS = ['L', 'Ma', 'Mi', 'J', 'V'] as const;

type PlanRidesCardProps = {
  onPress: () => void;
};

/** One tile per school day, with a dot for its morning and afternoon rides. */
function WeekPreview() {
  return (
    <View className="flex-row gap-[6px]">
      {SCHOOL_DAY_LABELS.map((label) => (
        <View
          key={label}
          className="h-[58px] flex-1 items-center justify-center gap-[6px] rounded-2xl bg-white/50"
        >
          <AppText className="text-[13px]">{label}</AppText>
          <View className="flex-row gap-1">
            <View className="h-[7px] w-[7px] rounded-full bg-navy" />
            <View className="h-[7px] w-[7px] rounded-full bg-navy/30" />
          </View>
        </View>
      ))}
    </View>
  );
}

export function PlanRidesCard({ onPress }: PlanRidesCardProps) {
  const footer = isWeekScheduleFinal(new Date())
    ? 'Planificarea se redeschide luni'
    : `Până duminică, ora ${PLANNING_DEADLINE_HOUR}:00`;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Planifică cursele pe săptămâna viitoare. ${footer}.`}
      onPress={onPress}
      className="gap-[14px] rounded-[28px] bg-peach p-[18px]"
      style={shadows.peach}
    >
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <AppText numberOfLines={1} className="text-[24px] tracking-[-0.5px]">
            Planifică cursele
          </AppText>
          <AppText numberOfLines={1} className="text-[15px]">
            pe săptămâna viitoare
          </AppText>
        </View>
        <View className="h-12 w-12 items-center justify-center rounded-full bg-ink">
          <ArrowRight
            size={22}
            color={colors.mint}
            strokeWidth={ICON_STROKE_WIDTH}
          />
        </View>
      </View>

      <WeekPreview />

      <View className="flex-row items-center gap-[6px]">
        <Clock size={14} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
        <AppText numberOfLines={1} className="flex-1 text-[13px]">
          {footer}
        </AppText>
      </View>
    </PressableScale>
  );
}

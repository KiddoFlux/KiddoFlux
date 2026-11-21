import { ArrowRight, Clock } from 'lucide-react-native';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';
import type { ZiSaptamana } from '@/types/profil';
import { isWeekScheduleFinal, PLANNING_DEADLINE_HOUR } from '@/utils/schedule';

const SCHOOL_DAYS: readonly { label: string; key: ZiSaptamana }[] = [
  { label: 'L', key: 'luni' },
  { label: 'Ma', key: 'marți' },
  { label: 'Mi', key: 'miercuri' },
  { label: 'J', key: 'joi' },
  { label: 'V', key: 'vineri' },
] as const;

type PlanRidesCardProps = {
  activeDays?: readonly ZiSaptamana[];
  onPress: () => void;
};

/** One tile per school day, reflecting the parent's actual available driving days. */
function WeekPreview({ activeDays }: { activeDays?: readonly ZiSaptamana[] }) {
  return (
    <View className="flex-row gap-[6px]">
      {SCHOOL_DAYS.map(({ label, key }) => {
        const esteActiv = !activeDays || activeDays.includes(key);
        return (
          <View
            key={label}
            className={`h-[58px] flex-1 items-center justify-center gap-[6px] rounded-2xl ${
              esteActiv ? 'bg-white/60' : 'bg-white/20'
            }`}
          >
            <AppText
              className={`text-[13px] ${
                esteActiv ? 'font-bold text-navy' : 'text-navy/40'
              }`}
            >
              {label}
            </AppText>
            <View className="flex-row gap-1">
              <View
                className={`h-[7px] w-[7px] rounded-full ${
                  esteActiv ? 'bg-navy' : 'bg-navy/20'
                }`}
              />
              <View
                className={`h-[7px] w-[7px] rounded-full ${
                  esteActiv ? 'bg-navy/50' : 'bg-navy/10'
                }`}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function PlanRidesCard({ activeDays, onPress }: PlanRidesCardProps) {
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

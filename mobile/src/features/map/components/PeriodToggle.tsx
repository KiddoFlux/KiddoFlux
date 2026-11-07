import { Sun, Sunset } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { MapPeriod } from '../types';

const PERIODS = [
  { value: 'morning', label: 'Dimineață', Icon: Sun },
  { value: 'afternoon', label: 'După-amiază', Icon: Sunset },
] as const;

type PeriodToggleProps = {
  value: MapPeriod;
  /** "Fram", as in "spre Fram". */
  destinationName: string;
  /** The departure time of each period's ride, shown under its label. */
  times: Partial<Record<MapPeriod, string>>;
  onChange: (period: MapPeriod) => void;
};

export function PeriodToggle({
  value,
  destinationName,
  times,
  onChange,
}: PeriodToggleProps) {
  return (
    <View
      className="flex-row rounded-full bg-steel/10 p-1"
      accessibilityRole="radiogroup"
    >
      {PERIODS.map(({ value: period, label, Icon }) => {
        const isActive = period === value;
        const time = times[period];
        const hint =
          period === 'morning' ? `spre ${destinationName}` : 'spre casă';

        return (
          <Pressable
            key={period}
            accessibilityRole="radio"
            accessibilityLabel={`${label}, ${hint}${time ? `, la ${time}` : ''}`}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(period)}
            className={`h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full px-3 ${
              isActive ? 'bg-white' : ''
            }`}
            style={isActive ? shadows.soft : undefined}
          >
            <Icon
              size={18}
              color={isActive ? colors.peach : colors.steel}
              strokeWidth={ICON_STROKE_WIDTH}
            />
            <View className="flex-shrink">
              <AppText
                numberOfLines={1}
                className={`font-bold text-[14px] ${
                  isActive ? 'text-ink' : 'text-navy'
                }`}
              >
                {label}
              </AppText>
              <AppText numberOfLines={1} className="text-[11px] text-steel">
                {time ? `${hint} · ${time}` : hint}
              </AppText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

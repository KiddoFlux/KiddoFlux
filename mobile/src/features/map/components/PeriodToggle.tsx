import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { shadows } from '@/theme/shadows';

import type { MapPeriod } from '../types';

const PERIODS: readonly { value: MapPeriod; label: string }[] = [
  { value: 'morning', label: 'Dimineață' },
  { value: 'afternoon', label: 'După-amiază' },
];

type PeriodToggleProps = {
  value: MapPeriod;
  onChange: (period: MapPeriod) => void;
};

export function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  return (
    <View className="flex-row gap-2" accessibilityRole="radiogroup">
      {PERIODS.map((period) => {
        const isActive = period.value === value;

        return (
          <Pressable
            key={period.value}
            accessibilityRole="radio"
            accessibilityLabel={period.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(period.value)}
            className={`h-11 items-center justify-center rounded-full px-5 ${
              isActive ? 'bg-ink' : 'bg-white'
            }`}
            style={isActive ? undefined : shadows.soft}
          >
            <AppText
              numberOfLines={1}
              className={`text-[14px] ${isActive ? 'text-mint' : 'text-ink'}`}
            >
              {period.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';

import type { SchoolDay } from '../types';

// Written out because Intl is not reliable on Hermes.
const DAY_NAMES = [
  { short: 'Lun', full: 'Luni' },
  { short: 'Mar', full: 'Marți' },
  { short: 'Mie', full: 'Miercuri' },
  { short: 'Joi', full: 'Joi' },
  { short: 'Vin', full: 'Vineri' },
] as const;

export type DayOption = {
  date: Date;
  isToday: boolean;
  /** Who drives that day, in the selected period. Null when nobody does. */
  driver: { name: string; initial: string; tone: AvatarTone } | null;
};

type DaySelectorProps = {
  days: readonly DayOption[];
  value: SchoolDay;
  onChange: (day: SchoolDay) => void;
};

export function DaySelector({ days, value, onChange }: DaySelectorProps) {
  return (
    <View className="flex-row gap-[6px]" accessibilityRole="radiogroup">
      {days.map((day, index) => {
        const isActive = index === value;
        const names = DAY_NAMES[index];
        const driverLabel = day.driver ? `, conduce ${day.driver.name}` : '';

        return (
          <PressableScale
            key={names.short}
            accessibilityRole="radio"
            accessibilityLabel={`${names.full} ${day.date.getDate()}${driverLabel}`}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(index as SchoolDay)}
            className={`flex-1 items-center gap-[2px] rounded-[18px] pb-2 pt-[7px] ${
              isActive ? 'bg-navy' : 'bg-steel/10'
            }`}
          >
            <AppText
              numberOfLines={1}
              className={`text-[11px] ${isActive ? 'text-mint' : 'text-navy'}`}
            >
              {names.short}
            </AppText>
            <AppText
              numberOfLines={1}
              className={`font-bold text-[18px] ${
                isActive ? 'text-mint' : 'text-ink'
              }`}
            >
              {day.date.getDate()}
            </AppText>
            {day.driver ? (
              <Avatar
                initial={day.driver.initial}
                tone={day.driver.tone}
                size={20}
                ringWidth={1.5}
                ringColor={isActive ? colors.navy : colors.white}
              />
            ) : (
              <View className="h-5" />
            )}
            {day.isToday ? (
              <View className="absolute right-2 top-2 h-[6px] w-[6px] rounded-full bg-peach" />
            ) : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

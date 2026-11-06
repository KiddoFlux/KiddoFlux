import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { shadows } from '@/theme/shadows';

import {
  formatLongDate,
  getWeekdayNames,
  isSameDay,
  toISODate,
} from '../dateUtils';

// Cells are 42 wide by design; the extra 1px each side makes the tap area 44.
const CELL_HIT_SLOP = { left: 1, right: 1 };

function getRideCountLabel(count: number): string {
  if (count === 0) return 'nicio cursă';
  return count === 1 ? '1 cursă' : `${count} curse`;
}

type WeekStripProps = {
  days: readonly Date[];
  selectedDate: Date;
  getRideCount: (isoDate: string) => number;
  onSelectDate: (date: Date) => void;
};

export function WeekStrip({
  days,
  selectedDate,
  getRideCount,
  onSelectDate,
}: WeekStripProps) {
  return (
    <View
      accessibilityRole="tablist"
      className="flex-row justify-between rounded-[28px] bg-navy p-[10px]"
      style={shadows.strong}
    >
      {days.map((day) => {
        const selected = isSameDay(day, selectedDate);
        const rideCount = getRideCount(toISODate(day));
        const textColor = selected ? 'text-ink' : 'text-mint';
        const dotColor = selected ? 'bg-ink' : 'bg-peach';

        return (
          <Pressable
            key={toISODate(day)}
            accessibilityRole="tab"
            accessibilityLabel={`${formatLongDate(day)}, ${getRideCountLabel(rideCount)}`}
            accessibilityState={{ selected }}
            hitSlop={CELL_HIT_SLOP}
            onPress={() => onSelectDate(day)}
            className={`h-[68px] w-[42px] items-center justify-center gap-[2px] rounded-full ${
              selected ? 'bg-peach' : ''
            }`}
          >
            <AppText className={`text-[12px] opacity-85 ${textColor}`}>
              {getWeekdayNames(day).label}
            </AppText>
            <AppText className={`text-[20px] ${textColor}`}>
              {day.getDate()}
            </AppText>
            {/* Always takes up space, so the numbers line up across days. */}
            <View
              className={`h-[5px] w-[5px] rounded-full ${
                rideCount > 0 ? dotColor : ''
              }`}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';

import { RIDE_SLOTS } from '../rideSlots';
import type { DateString, RideDirection, WeekDay } from '../types';

const ROW_LABEL_WIDTH = 28;

type WeekCalendarProps = {
  days: readonly WeekDay[];
  isSelected: (date: DateString, direction: RideDirection) => boolean;
  onToggleRide: (date: DateString, direction: RideDirection) => void;
};

export function WeekCalendar({
  days,
  isSelected,
  onToggleRide,
}: WeekCalendarProps) {
  return (
    <View className="gap-[6px]">
      <View className="flex-row gap-[6px]">
        <View style={{ width: ROW_LABEL_WIDTH }} />
        {days.map((day) => (
          <View key={day.date} className="flex-1 items-center">
            <AppText numberOfLines={1} className="text-[12px] text-navy">
              {day.shortName}
            </AppText>
            <AppText numberOfLines={1} className="text-[18px]">
              {day.dayOfMonth}
            </AppText>
          </View>
        ))}
      </View>

      {RIDE_SLOTS.map(({ direction, label, routeLabel, Icon }) => (
        <View key={direction} className="flex-row items-center gap-[6px]">
          <View
            className="items-center"
            style={{ width: ROW_LABEL_WIDTH }}
            accessible
            accessibilityLabel={label}
          >
            <Icon
              size={22}
              color={colors.steel}
              strokeWidth={ICON_STROKE_WIDTH}
            />
          </View>

          {days.map((day) => {
            const selected = isSelected(day.date, direction);

            return (
              <Pressable
                key={day.date}
                accessibilityRole="checkbox"
                accessibilityLabel={`${day.fullName} ${day.dayOfMonth}, ${label}, ${routeLabel}`}
                accessibilityState={{ checked: selected }}
                onPress={() => onToggleRide(day.date, direction)}
                className={`h-12 flex-1 items-center justify-center rounded-2xl ${
                  selected
                    ? 'bg-peach'
                    : 'border-[1.5px] border-dashed border-steel'
                }`}
              >
                {selected ? (
                  <Check
                    size={20}
                    color={colors.ink}
                    strokeWidth={ICON_STROKE_WIDTH}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ))}

      <View className="mt-1 gap-1">
        {RIDE_SLOTS.map(({ direction, label, routeLabel, Icon }) => (
          <View key={direction} className="flex-row items-center gap-2">
            <Icon
              size={16}
              color={colors.steel}
              strokeWidth={ICON_STROKE_WIDTH}
            />
            <AppText numberOfLines={1} className="flex-1 text-[13px] text-navy">
              {label}: {routeLabel}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

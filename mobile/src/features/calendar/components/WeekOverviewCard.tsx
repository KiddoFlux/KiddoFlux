import { Sunrise, Sunset } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import { formatLongDate, getWeekdayNames, toISODate } from '../dateUtils';
import type { CalendarRide } from '../types';

const DAY_COLUMN_WIDTH = 40;

function getDriverLabel(ride: CalendarRide | undefined): string {
  if (!ride) return '—';
  if (ride.needsReplacement) return 'Se caută';
  return ride.driverName ?? 'Tu';
}

function getSpokenDriver(ride: CalendarRide | undefined): string {
  if (!ride) return 'nicio cursă';
  if (ride.needsReplacement) return 'se caută înlocuitor';
  return ride.driverName ? `conduce ${ride.driverName}` : 'conduci tu';
}

type DriverCellProps = {
  ride: CalendarRide | undefined;
};

function DriverCell({ ride }: DriverCellProps) {
  const isMine = ride?.driverName === null && !ride.needsReplacement;

  let background = 'bg-steel/[0.14]';
  if (ride?.needsReplacement) background = 'bg-peach/35';
  else if (isMine) background = 'bg-navy';

  return (
    <View
      className={`h-[52px] flex-1 justify-center rounded-2xl px-3 ${background}`}
    >
      <AppText
        numberOfLines={1}
        className={`text-[14px] ${isMine ? 'text-mint' : 'text-ink'}`}
      >
        {getDriverLabel(ride)}
      </AppText>
      {ride ? (
        <AppText
          numberOfLines={1}
          className={`text-[12px] ${isMine ? 'text-sage' : 'text-navy'}`}
        >
          {ride.departureTime}
        </AppText>
      ) : null}
    </View>
  );
}

type WeekOverviewCardProps = {
  /** The days to list, in order. */
  days: readonly Date[];
  rides: readonly CalendarRide[];
  onSelectDay: (date: Date) => void;
};

export function WeekOverviewCard({
  days,
  rides,
  onSelectDay,
}: WeekOverviewCardProps) {
  const findRide = (date: Date, direction: CalendarRide['direction']) => {
    const isoDate = toISODate(date);
    return rides.find(
      (ride) => ride.date === isoDate && ride.direction === direction,
    );
  };

  return (
    <View
      className="gap-2 rounded-[28px] bg-white p-[14px]"
      style={shadows.soft}
    >
      <View className="flex-row items-center gap-2">
        <View style={{ width: DAY_COLUMN_WIDTH }} />
        <View className="flex-1 flex-row items-center gap-1">
          <Sunrise
            size={16}
            color={colors.steel}
            strokeWidth={ICON_STROKE_WIDTH}
          />
          <AppText numberOfLines={1} className="shrink text-[12px] text-navy">
            Dimineața
          </AppText>
        </View>
        <View className="flex-1 flex-row items-center gap-1">
          <Sunset
            size={16}
            color={colors.steel}
            strokeWidth={ICON_STROKE_WIDTH}
          />
          <AppText numberOfLines={1} className="shrink text-[12px] text-navy">
            După-amiaza
          </AppText>
        </View>
      </View>

      {days.map((day) => {
        const morning = findRide(day, 'toSchool');
        const afternoon = findRide(day, 'toHome');

        return (
          <Pressable
            key={toISODate(day)}
            accessibilityRole="button"
            accessibilityLabel={`${formatLongDate(day)}. Dimineața: ${getSpokenDriver(morning)}. După-amiaza: ${getSpokenDriver(afternoon)}. Deschide ziua.`}
            onPress={() => onSelectDay(day)}
            className="flex-row items-center gap-2"
          >
            <View className="items-center" style={{ width: DAY_COLUMN_WIDTH }}>
              <AppText numberOfLines={1} className="text-[12px] text-navy">
                {getWeekdayNames(day).label}
              </AppText>
              <AppText numberOfLines={1} className="text-[18px]">
                {day.getDate()}
              </AppText>
            </View>
            <DriverCell ride={morning} />
            <DriverCell ride={afternoon} />
          </Pressable>
        );
      })}
    </View>
  );
}

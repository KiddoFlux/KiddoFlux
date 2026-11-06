import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import {
  TAB_BAR_BOTTOM_GAP,
  TAB_BAR_HEIGHT,
} from '@/components/navigation/TabBar';
import { toMinutes } from '@/utils/time';

import { AvailableParentsCard } from './components/AvailableParentsCard';
import { CalendarHeader } from './components/CalendarHeader';
import { DayRideCard } from './components/DayRideCard';
import { EmptyDayCard } from './components/EmptyDayCard';
import { WeekStrip } from './components/WeekStrip';
import {
  formatMonthYear,
  formatShortDate,
  getWeekDays,
  getWeekdayNames,
  toISODate,
} from './dateUtils';
import type { AvailableParentsByDate, CalendarRide } from './types';

const SCREEN_TOP_PADDING = 26;
const SCREEN_SIDE_PADDING = 20;
const SECTION_GAP = 18;

export type CalendarScreenProps = {
  rides: readonly CalendarRide[];
  availableParentsByDate: AvailableParentsByDate;
  initialDate?: Date;
  onPlanRides: () => void;
  onOpenRide: (rideId: string) => void;
  onOpenAvailableParents: (isoDate: string) => void;
};

export function CalendarScreen({
  rides,
  availableParentsByDate,
  initialDate,
  onPlanRides,
  onOpenRide,
  onOpenAvailableParents,
}: CalendarScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(
    () => initialDate ?? new Date(),
  );

  const selectedIsoDate = toISODate(selectedDate);
  const ridesOfDay = rides
    .filter((ride) => ride.date === selectedIsoDate)
    .sort((a, b) => toMinutes(a.departureTime) - toMinutes(b.departureTime));

  const getRideCount = (isoDate: string) =>
    rides.filter((ride) => ride.date === isoDate).length;

  return (
    <ScrollView
      className="flex-1 bg-mint"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: SECTION_GAP,
        paddingHorizontal: SCREEN_SIDE_PADDING,
        paddingTop: insets.top + SCREEN_TOP_PADDING,
        paddingBottom:
          insets.bottom + TAB_BAR_BOTTOM_GAP + TAB_BAR_HEIGHT + SECTION_GAP,
      }}
    >
      <CalendarHeader
        monthYear={formatMonthYear(selectedDate)}
        onPlanRides={onPlanRides}
      />

      <WeekStrip
        days={getWeekDays(initialDate ?? selectedDate)}
        selectedDate={selectedDate}
        getRideCount={getRideCount}
        onSelectDate={setSelectedDate}
      />

      <View className="gap-[10px]">
        <View className="flex-row items-baseline justify-between gap-3">
          <AppText numberOfLines={1} className="shrink text-[22px]">
            Cursele zilei
          </AppText>
          <AppText numberOfLines={1} className="text-[13px] text-navy">
            {formatShortDate(selectedDate)}
          </AppText>
        </View>

        {ridesOfDay.length > 0 ? (
          ridesOfDay.map((ride) => (
            <DayRideCard
              key={ride.id}
              ride={ride}
              onPress={() => onOpenRide(ride.id)}
            />
          ))
        ) : (
          <EmptyDayCard onPlanRides={onPlanRides} />
        )}
      </View>

      <AvailableParentsCard
        parents={availableParentsByDate[selectedIsoDate] ?? []}
        weekdayName={getWeekdayNames(selectedDate).lowerName}
        onPress={() => onOpenAvailableParents(selectedIsoDate)}
      />
    </ScrollView>
  );
}

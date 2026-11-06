import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TAB_BAR_BOTTOM_GAP,
  TAB_BAR_HEIGHT,
} from '@/components/navigation/TabBar';
import { AppText } from '@/components/ui/AppText';
import { toMinutes } from '@/utils/time';

import { CalendarHeader } from './components/CalendarHeader';
import { DayRideCard } from './components/DayRideCard';
import { EmptyDayCard } from './components/EmptyDayCard';
import { WeekStrip } from './components/WeekStrip';
import {
  formatMonthYear,
  formatShortDate,
  getWeekDays,
  isRideUpcoming,
  toISODate,
} from './dateUtils';
import type { CalendarRide } from './types';

const SCREEN_TOP_PADDING = 26;
const SCREEN_SIDE_PADDING = 20;
const SECTION_GAP = 18;

export type CalendarScreenProps = {
  rides: readonly CalendarRide[];
  initialDate: Date;
  /** Rides before this moment can no longer get a "Nu pot conduce" alert. */
  now: Date;
  onPlanRides: () => void;
  onOpenRide: (rideId: string) => void;
  onReportCannotDrive: (rideId: string) => void;
  onTakeOverRide: (rideId: string) => void;
};

export function CalendarScreen({
  rides,
  initialDate,
  now,
  onPlanRides,
  onOpenRide,
  onReportCannotDrive,
  onTakeOverRide,
}: CalendarScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const selectedIsoDate = toISODate(selectedDate);
  const ridesOfDay = rides
    .filter((ride) => ride.date === selectedIsoDate)
    .sort((a, b) => toMinutes(a.departureTime) - toMinutes(b.departureTime));

  const getRideCount = (isoDate: string) =>
    rides.filter((ride) => ride.date === isoDate).length;

  const handleCannotDrive = (rideId: string) => {
    Alert.alert(
      'Nu poți conduce?',
      'Toți părinții din grup vor primi o alertă, ca să preia cineva cursa.',
      [
        { text: 'Renunță', style: 'cancel' },
        {
          text: 'Trimite alerta',
          style: 'destructive',
          onPress: () => onReportCannotDrive(rideId),
        },
      ],
    );
  };

  const handleTakeOver = (rideId: string) => {
    Alert.alert(
      'Preiei cursa?',
      'Vei deveni șoferul acestei curse, iar părinții din grup vor fi anunțați.',
      [
        { text: 'Renunță', style: 'cancel' },
        { text: 'Preiau cursa', onPress: () => onTakeOverRide(rideId) },
      ],
    );
  };

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
        days={getWeekDays(initialDate)}
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
          ridesOfDay.map((ride) => {
            const isMyRide = ride.driverName === null;
            const isUpcoming = isRideUpcoming(
              ride.date,
              ride.departureTime,
              now,
            );

            return (
              <DayRideCard
                key={ride.id}
                ride={ride}
                onPress={() => onOpenRide(ride.id)}
                onCannotDrive={
                  isMyRide && isUpcoming
                    ? () => handleCannotDrive(ride.id)
                    : undefined
                }
                onTakeOver={
                  !isMyRide && ride.needsReplacement && isUpcoming
                    ? () => handleTakeOver(ride.id)
                    : undefined
                }
              />
            );
          })
        ) : (
          <EmptyDayCard onPlanRides={onPlanRides} />
        )}
      </View>
    </ScrollView>
  );
}

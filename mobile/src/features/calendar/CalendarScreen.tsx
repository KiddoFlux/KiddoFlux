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
import { RideDetailsSheet } from './components/RideDetailsSheet';
import { WeekNavigator } from './components/WeekNavigator';
import { WeekOverviewButton } from './components/WeekOverviewButton';
import { WeekOverviewCard } from './components/WeekOverviewCard';
import { WeekStrip } from './components/WeekStrip';
import {
  addWeeks,
  formatMonthYear,
  formatShortDate,
  formatWeekRange,
  getWeekDays,
  isRideUpcoming,
  isSameDay,
  startOfWeek,
  toISODate,
} from './dateUtils';
import type { CalendarRide } from './types';

const SCREEN_TOP_PADDING = 26;
const SCREEN_SIDE_PADDING = 20;
const SECTION_GAP = 18;
const SCHOOL_DAYS_IN_WEEK = 5;

export type CalendarScreenProps = {
  rides: readonly CalendarRide[];
  /** The current user's children, highlighted in the ride details. */
  myChildrenIds: readonly string[];
  /** Any day of the first of the two weeks the Calendar shows. */
  firstWeekDate: Date;
  initialDate: Date;
  /** Shown on next week until its schedule is final. */
  nextWeekNote: string | null;
  /** Rides before this moment can no longer get a "Nu pot conduce" alert. */
  now: Date;
  onPlanRides: () => void;
  onReportCannotDrive: (rideId: string) => void;
  onTakeOverRide: (rideId: string) => void;
};

export function CalendarScreen({
  rides,
  myChildrenIds,
  firstWeekDate,
  initialDate,
  nextWeekNote,
  now,
  onPlanRides,
  onReportCannotDrive,
  onTakeOverRide,
}: CalendarScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [openRideId, setOpenRideId] = useState<string | null>(null);

  // Kept as an id so the details follow any change to the ride.
  const openRide = rides.find((ride) => ride.id === openRideId);

  const isFirstWeek = isSameDay(
    startOfWeek(selectedDate),
    startOfWeek(firstWeekDate),
  );

  const handleToggleOverview = () => {
    // Opening it shows next week, the one parents need to check.
    if (!isOverviewOpen && isFirstWeek) {
      setSelectedDate(addWeeks(selectedDate, 1));
    }
    setIsOverviewOpen(!isOverviewOpen);
  };

  const handleSelectOverviewDay = (date: Date) => {
    setSelectedDate(date);
    setIsOverviewOpen(false);
  };

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

      <WeekNavigator
        title={isFirstWeek ? 'Săptămâna aceasta' : 'Săptămâna viitoare'}
        range={formatWeekRange(selectedDate)}
        note={isFirstWeek ? null : nextWeekNote}
        canGoBack={!isFirstWeek}
        canGoForward={isFirstWeek}
        onPrevious={() => setSelectedDate(addWeeks(selectedDate, -1))}
        onNext={() => setSelectedDate(addWeeks(selectedDate, 1))}
      />

      <WeekStrip
        days={getWeekDays(selectedDate)}
        selectedDate={selectedDate}
        getRideCount={getRideCount}
        onSelectDate={setSelectedDate}
      />

      <WeekOverviewButton
        isOpen={isOverviewOpen}
        onPress={handleToggleOverview}
      />

      {isOverviewOpen ? (
        <View className="gap-[10px]">
          <AppText numberOfLines={1} className="text-[22px]">
            Cine conduce
          </AppText>
          <WeekOverviewCard
            days={getWeekDays(selectedDate).slice(0, SCHOOL_DAYS_IN_WEEK)}
            rides={rides}
            onSelectDay={handleSelectOverviewDay}
          />
        </View>
      ) : (
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
                  onPress={() => setOpenRideId(ride.id)}
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
      )}

      {openRide ? (
        <RideDetailsSheet
          ride={openRide}
          dateLabel={formatShortDate(selectedDate)}
          myChildrenIds={myChildrenIds}
          onClose={() => setOpenRideId(null)}
        />
      ) : null}
    </ScrollView>
  );
}

import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';
import { PLANNING_DEADLINE_HOUR } from '@/utils/schedule';

import { RideDayCard } from './components/RideDayCard';
import { RouteFields } from './components/RouteFields';
import { WeekCalendar } from './components/WeekCalendar';
import { isRideReady, MIN_RIDES, NEW_RIDE } from './rideRules';
import { RIDE_SLOTS } from './rideSlots';
import type {
  DateString,
  PlannedRideDraft,
  RideDirection,
  RideDraft,
  WeekDay,
  WeekPlan,
} from './types';

const SCREEN_TOP_PADDING = 26;
const SCREEN_BOTTOM_PADDING = 26;
const SCREEN_SIDE_PADDING = 20;
const SECTION_GAP = 18;

type RidesBySlot = Partial<Record<string, RideDraft>>;

function getSlotKey(date: DateString, direction: RideDirection): string {
  return `${date}:${direction}`;
}

function getMissingRidesLabel(missing: number): string {
  return missing === 1 ? 'Mai alege 1 cursă.' : `Mai alege ${missing} curse.`;
}

function toRidesBySlot(plan: WeekPlan | null): RidesBySlot {
  if (!plan) return {};

  return Object.fromEntries(
    plan.rides.map(({ date, direction, ...times }) => [
      getSlotKey(date, direction),
      times,
    ]),
  );
}

export type PlanRidesScreenProps = {
  days: readonly WeekDay[];
  weekRange: string;
  /** The parent's saved home address, which they can still change for this plan. */
  defaultHomeAddress: string;
  /** Seats pre-filled on every new ride (from the parent's car). */
  defaultSeats: number;
  /** Free seats in the parent's car: the most a ride can offer. */
  maxSeats: number;
  /** The plan already published for this week, which the parent can change. */
  initialPlan: WeekPlan | null;
  isPublishing: boolean;
  publishError: string | null;
  onBack: () => void;
  onPublish: (plan: WeekPlan) => void;
};

export function PlanRidesScreen({
  days,
  weekRange,
  defaultHomeAddress,
  defaultSeats,
  maxSeats,
  initialPlan,
  isPublishing,
  publishError,
  onBack,
  onPublish,
}: PlanRidesScreenProps) {
  const insets = useSafeAreaInsets();
  const [homeAddress, setHomeAddress] = useState(
    initialPlan?.homeAddress ?? defaultHomeAddress,
  );
  const [ridesBySlot, setRidesBySlot] = useState<RidesBySlot>(() =>
    toRidesBySlot(initialPlan),
  );

  const getRide = (date: DateString, direction: RideDirection) =>
    ridesBySlot[getSlotKey(date, direction)];

  const plannedRides: PlannedRideDraft[] = days.flatMap((day) =>
    RIDE_SLOTS.flatMap(({ direction }) => {
      const ride = getRide(day.date, direction);
      return ride ? [{ date: day.date, direction, ...ride }] : [];
    }),
  );

  const totalSlots = days.length * RIDE_SLOTS.length;
  const daysWithRides = days.filter((day) =>
    plannedRides.some((ride) => ride.date === day.date),
  );

  const handleToggleRide = (date: DateString, direction: RideDirection) => {
    const key = getSlotKey(date, direction);

    setRidesBySlot((current) => {
      const { [key]: existing, ...others } = current;
      return existing
        ? others
        : { ...current, [key]: { ...NEW_RIDE, seats: defaultSeats } };
    });
  };

  const handleChangeRide = (
    date: DateString,
    direction: RideDirection,
    changes: Partial<RideDraft>,
  ) => {
    const key = getSlotKey(date, direction);

    setRidesBySlot((current) => {
      const ride = current[key];
      return ride ? { ...current, [key]: { ...ride, ...changes } } : current;
    });
  };

  const trimmedAddress = homeAddress.trim();
  const missingRides = Math.max(MIN_RIDES - plannedRides.length, 0);
  const readyRides = plannedRides.filter(isRideReady);
  const hasMissingTimes = plannedRides.some(
    (ride) => ride.departureTime === null || ride.arrivalTime === null,
  );
  const canPublish =
    !isPublishing &&
    trimmedAddress.length > 0 &&
    missingRides === 0 &&
    readyRides.length === plannedRides.length;

  const handlePublish = () => {
    if (!canPublish) return;

    onPublish({ homeAddress: trimmedAddress, rides: readyRides });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-mint"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: SECTION_GAP,
          paddingHorizontal: SCREEN_SIDE_PADDING,
          paddingTop: insets.top + SCREEN_TOP_PADDING,
          paddingBottom: insets.bottom + SCREEN_BOTTOM_PADDING,
        }}
      >
        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Înapoi"
            onPress={onBack}
            className="h-12 w-12 items-center justify-center rounded-full bg-white"
            style={shadows.soft}
          >
            <ArrowLeft
              size={22}
              color={colors.ink}
              strokeWidth={ICON_STROKE_WIDTH}
            />
          </Pressable>
          <View className="flex-1">
            <AppText numberOfLines={1} className="text-[13px] text-navy">
              Săptămâna viitoare · {weekRange}
            </AppText>
            <AppText
              numberOfLines={1}
              className="text-[22px] tracking-[-0.4px]"
            >
              Planifică cursele
            </AppText>
          </View>
        </View>

        <View className="rounded-[28px] bg-white p-[18px]" style={shadows.soft}>
          <RouteFields
            homeAddress={homeAddress}
            onChangeHomeAddress={setHomeAddress}
          />
        </View>

        <View
          className="gap-3 rounded-[28px] bg-white p-[18px]"
          style={shadows.soft}
        >
          <View className="flex-row items-baseline justify-between gap-3">
            <AppText numberOfLines={1} className="shrink text-[18px]">
              Când poți conduce?
            </AppText>
            <AppText numberOfLines={1} className="text-[13px] text-navy">
              {plannedRides.length} din {totalSlots} · minimum {MIN_RIDES}
            </AppText>
          </View>
          <AppText className="text-[13px] text-navy">
            Cele {totalSlots} curse se împart între părinți, în funcție de
            disponibilitate.
          </AppText>
          <WeekCalendar
            days={days}
            isSelected={(date, direction) =>
              getRide(date, direction) !== undefined
            }
            onToggleRide={handleToggleRide}
          />
        </View>

        {daysWithRides.map((day) => (
          <RideDayCard
            key={day.date}
            day={day}
            getRide={(direction) => getRide(day.date, direction)}
            maxSeats={maxSeats}
            onChangeRide={(direction, changes) =>
              handleChangeRide(day.date, direction, changes)
            }
          />
        ))}

        <View className="gap-3">
          <AppText className="text-[13px] text-navy">
            Poți publica până duminică, ora {PLANNING_DEADLINE_HOUR}:00.
          </AppText>
          {missingRides > 0 ? (
            <AppText
              accessibilityLiveRegion="polite"
              className="text-[13px] text-navy"
            >
              {getMissingRidesLabel(missingRides)}
            </AppText>
          ) : null}
          {hasMissingTimes ? (
            <AppText
              accessibilityLiveRegion="polite"
              className="text-[13px] text-navy"
            >
              Alege orele pentru toate cursele.
            </AppText>
          ) : null}
          {trimmedAddress.length === 0 ? (
            <AppText
              accessibilityLiveRegion="polite"
              className="text-[13px] text-navy"
            >
              Completează adresa de acasă.
            </AppText>
          ) : null}
          {publishError ? (
            <AppText
              accessibilityLiveRegion="assertive"
              className="text-[13px] text-ink"
            >
              {publishError}
            </AppText>
          ) : null}

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Publică cursele"
            accessibilityState={{ disabled: !canPublish, busy: isPublishing }}
            disabled={!canPublish}
            onPress={handlePublish}
            className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-navy ${
              canPublish ? '' : 'opacity-50'
            }`}
          >
            <AppText className="text-[16px] text-mint">
              {isPublishing ? 'Se publică…' : 'Publică cursele'}
            </AppText>
            {isPublishing ? (
              <ActivityIndicator color={colors.mint} />
            ) : (
              <ArrowRight
                size={20}
                color={colors.mint}
                strokeWidth={ICON_STROKE_WIDTH}
              />
            )}
          </PressableScale>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

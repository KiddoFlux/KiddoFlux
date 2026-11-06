import type { PlannedRide, WeekPlan } from '../plan-rides/types';
import type { CalendarRide } from './types';

const SLOT_NAMES = { toSchool: 'morning', toHome: 'afternoon' } as const;

/** Mock rides use the same id format, so a published ride replaces the mock one in its slot. */
function toCalendarRide(ride: PlannedRide): CalendarRide {
  return {
    id: `${ride.date}-${SLOT_NAMES[ride.direction]}`,
    date: ride.date,
    direction: ride.direction,
    departureTime: ride.departureTime,
    arrivalTime: ride.arrivalTime,
    driverName: null,
    seatsTaken: 0,
    seatsTotal: ride.seats,
    children: [],
    needsReplacement: false,
  };
}

/**
 * The parent's published rides win over the placeholder rides in `rides`: in every week
 * with a published plan, the parent's other placeholder rides are removed and each
 * published ride replaces whatever was in its slot.
 * TODO: remove the placeholders once the matching algorithm produces the real schedule.
 */
export function mergePublishedRides(
  rides: readonly CalendarRide[],
  plans: readonly { weekDates: ReadonlySet<string>; plan: WeekPlan }[],
): CalendarRide[] {
  const published = plans.flatMap(({ plan }) => plan.rides.map(toCalendarRide));
  const publishedIds = new Set(published.map((ride) => ride.id));

  const remaining = rides.filter((ride) => {
    if (publishedIds.has(ride.id)) return false;
    const inPublishedWeek = plans.some(({ weekDates }) =>
      weekDates.has(ride.date),
    );
    return !(inPublishedWeek && ride.driverName === null);
  });

  return [...remaining, ...published];
}

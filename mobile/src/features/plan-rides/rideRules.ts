import { toMinutes } from '@/utils/time';

import type { RideDraft, RideTimes } from './types';

// Times start empty: school hours vary, so each parent sets their own.
export const NEW_RIDE: RideDraft = {
  departureTime: null,
  arrivalTime: null,
  seats: 3,
};

export function hasInvalidTimeOrder(ride: RideDraft): boolean {
  if (!ride.departureTime || !ride.arrivalTime) return false;
  return toMinutes(ride.departureTime) >= toMinutes(ride.arrivalTime);
}

/** True when both times are set and the departure is before the arrival. */
export function isRideReady<T extends RideDraft>(
  ride: T,
): ride is T & RideTimes {
  return (
    ride.departureTime !== null &&
    ride.arrivalTime !== null &&
    !hasInvalidTimeOrder(ride)
  );
}

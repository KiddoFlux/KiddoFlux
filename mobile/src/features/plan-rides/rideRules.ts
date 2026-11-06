import { toMinutes } from '@/utils/time';

import type { RideDraft, RideTimes } from './types';

export const MIN_SEATS = 1;
export const MAX_SEATS = 7;

// Times start empty: school hours vary, so each parent sets their own.
export const NEW_RIDE: RideDraft = {
  departureTime: null,
  arrivalTime: null,
  seats: 3,
};

/** Seats offered to children by default: every seat of the car except the driver's. */
export function getDefaultSeats(carSeats: number): number {
  return Math.min(Math.max(carSeats - 1, MIN_SEATS), MAX_SEATS);
}

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

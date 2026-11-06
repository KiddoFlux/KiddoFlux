import type { Child, RideDirection } from '@/types/ride';
import type { TimeString } from '@/utils/time';

export type CurrentUser = {
  id: string;
  name: string;
  initial: string;
  greeting: string;
};

export type NextRide = {
  dayLabel: string;
  direction: RideDirection;
  departureTime: TimeString;
  arrivalTime: TimeString;
  children: readonly Child[];
  /** Null when the current user is the driver. */
  driverName: string | null;
};

import type { Child, RideDirection } from '@/types/ride';
import type { TimeString } from '@/utils/time';

export type CalendarRide = {
  id: string;
  /** Local calendar date in "YYYY-MM-DD" format. */
  date: string;
  direction: RideDirection;
  departureTime: TimeString;
  arrivalTime: TimeString;
  /** Null when the current user is the driver. */
  driverName: string | null;
  seatsTaken: number;
  seatsTotal: number;
  children: readonly Child[];
  /** True once the driver has sent an alert that they can't make this ride. */
  needsReplacement: boolean;
};

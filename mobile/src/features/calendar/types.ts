import type { AvatarTone } from '@/components/ui/Avatar';
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
};

export type AvailableParent = {
  id: string;
  name: string;
  initial: string;
  tone: AvatarTone;
};

/** Keyed by local calendar date in "YYYY-MM-DD" format. */
export type AvailableParentsByDate = Readonly<
  Record<string, readonly AvailableParent[]>
>;

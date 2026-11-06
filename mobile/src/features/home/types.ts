import type { AvatarTone } from '@/components/ui/Avatar';
import type { TimeString } from '@/utils/time';

export type Child = {
  id: string;
  name: string;
  initial: string;
  tone: AvatarTone;
};

export type CurrentUser = {
  id: string;
  name: string;
  initial: string;
  greeting: string;
};

export type NextRide = {
  dayLabel: string;
  /** Morning rides go to school; afternoon rides go home. */
  direction: 'toSchool' | 'fromSchool';
  departureTime: TimeString;
  arrivalTime: TimeString;
  children: readonly Child[];
  /** Null when the current user is the driver. */
  driverName: string | null;
};

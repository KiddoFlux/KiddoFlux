import type { AvatarTone } from '@/components/ui/Avatar';

/** 24-hour time in "HH:mm" format. */
export type TimeString = `${string}:${string}`;

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
  departureTime: TimeString;
  arrivalTime: TimeString;
  children: readonly Child[];
  /** Null when the current user is the driver. */
  driverName: string | null;
};

export type RideDraft = {
  from: string;
  departureTime: TimeString;
  arrivalTime: TimeString;
  seats: number;
  recurring: boolean;
};

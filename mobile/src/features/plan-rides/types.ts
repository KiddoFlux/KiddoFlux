import type { TimeString } from '@/utils/time';

/** Local calendar date in "YYYY-MM-DD" format. */
export type DateString = string;

/** Morning rides go home to school; afternoon rides go school to home. */
export type RideDirection = 'toSchool' | 'fromSchool';

export type WeekDay = {
  date: DateString;
  shortName: string;
  fullName: string;
  dayOfMonth: number;
};

export type RideTimes = {
  departureTime: TimeString;
  arrivalTime: TimeString;
  seats: number;
};

/** A ride being edited: its times stay empty until the parent sets them. */
export type RideDraft = Omit<RideTimes, 'departureTime' | 'arrivalTime'> & {
  departureTime: TimeString | null;
  arrivalTime: TimeString | null;
};

type RideSlotKey = {
  date: DateString;
  direction: RideDirection;
};

export type PlannedRideDraft = RideDraft & RideSlotKey;

export type PlannedRide = RideTimes & RideSlotKey;

/** A parent's availability; the week's 10 rides are split between parents from these. */
export type WeekPlan = {
  homeAddress: string;
  rides: PlannedRide[];
};

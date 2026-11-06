import type { Child } from '@/types/ride';

import { getWeekDays, toISODate } from './dateUtils';
import type {
  AvailableParent,
  AvailableParentsByDate,
  CalendarRide,
} from './types';

const MARIA: Child = {
  id: 'child-1',
  name: 'Maria',
  initial: 'M',
  tone: 'peach',
};
const ANDREI: Child = {
  id: 'child-2',
  name: 'Andrei',
  initial: 'A',
  tone: 'sage',
};
const LUCA: Child = {
  id: 'child-3',
  name: 'Luca',
  initial: 'L',
  tone: 'steel',
};
const SOFIA: Child = {
  id: 'child-4',
  name: 'Sofia',
  initial: 'S',
  tone: 'peach',
};
const DAVID: Child = {
  id: 'child-5',
  name: 'David',
  initial: 'D',
  tone: 'sage',
};

const IOANA: AvailableParent = {
  id: 'parent-1',
  name: 'Ioana P.',
  initial: 'I',
  tone: 'peach',
};
const MIHAI: AvailableParent = {
  id: 'parent-2',
  name: 'Mihai D.',
  initial: 'M',
  tone: 'sage',
};
const ELENA: AvailableParent = {
  id: 'parent-3',
  name: 'Elena R.',
  initial: 'E',
  tone: 'steel',
};
const DAN: AvailableParent = {
  id: 'parent-4',
  name: 'Dan C.',
  initial: 'D',
  tone: 'peach',
};

const ALL_CHILDREN = [MARIA, ANDREI, LUCA, SOFIA, DAVID];

const MORNING = {
  direction: 'toSchool',
  departureTime: '07:35',
  arrivalTime: '08:00',
} as const;
const AFTERNOON = {
  direction: 'toHome',
  departureTime: '14:30',
  arrivalTime: '15:00',
} as const;

/** Null means the current user drives. Morning and afternoon for Monday to Friday. */
const WEEK_DRIVERS: readonly [string | null, string | null][] = [
  [null, IOANA.name],
  [MIHAI.name, ELENA.name],
  [null, DAN.name],
  [IOANA.name, null],
  [ELENA.name, MIHAI.name],
];

/**
 * The whole group's week: all 10 rides, each with its driver and all the children.
 * Dates are built from `weekDate`, so the mock week never goes stale.
 */
export function getMockRides(weekDate: Date): CalendarRide[] {
  const schoolDays = getWeekDays(weekDate).slice(0, WEEK_DRIVERS.length);

  return schoolDays.flatMap((day, index) => {
    const date = toISODate(day);
    const [morningDriver, afternoonDriver] = WEEK_DRIVERS[index];
    const shared = { date, seatsTaken: 5, seatsTotal: 5 };

    return [
      // Listed afternoon first so the screen's sort by departure time is visible.
      {
        ...shared,
        ...AFTERNOON,
        id: `${date}-afternoon`,
        driverName: afternoonDriver,
        children: ALL_CHILDREN,
      },
      {
        ...shared,
        ...MORNING,
        id: `${date}-morning`,
        driverName: morningDriver,
        children: ALL_CHILDREN,
      },
    ];
  });
}

export function getMockAvailableParents(
  weekDate: Date,
): AvailableParentsByDate {
  const [monday, tuesday, wednesday, thursday, friday] =
    getWeekDays(weekDate).map(toISODate);

  return {
    [monday]: [IOANA, MIHAI],
    [tuesday]: [ELENA],
    [wednesday]: [IOANA, ELENA, DAN],
    [thursday]: [MIHAI, ELENA],
    [friday]: [IOANA, MIHAI, ELENA, DAN],
  };
}

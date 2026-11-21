import type { Child } from '@/types/ride';

import { addWeeks, getWeekDays, toISODate } from './dateUtils';
import type { CalendarRide } from './types';

const LUCA: Child = {
  id: 'copil-parinte-01',
  name: 'Luca',
  initial: 'L',
  tone: 'peach',
};
const MARIA: Child = {
  id: 'copil-parinte-02',
  name: 'Maria',
  initial: 'M',
  tone: 'peach',
};
const ANDREI: Child = {
  id: 'copil-parinte-03',
  name: 'Andrei',
  initial: 'A',
  tone: 'steel',
};
const SOFIA: Child = {
  id: 'copil-parinte-04',
  name: 'Sofia',
  initial: 'S',
  tone: 'sage',
};
const DAVID: Child = {
  id: 'copil-parinte-05',
  name: 'David',
  initial: 'D',
  tone: 'sage',
};

const ALL_CHILDREN = [LUCA, MARIA, ANDREI, SOFIA, DAVID];

/** The current user's children. */
export const mockMyChildrenIds: readonly string[] = [LUCA.id];

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

type WeekDrivers = readonly [string | null, string | null][];

const DRIVER_IDS_WEEK_1: [string, string][] = [
  ['parinte-01', 'parinte-02'], // Luni: Ana, Ioana
  ['parinte-03', 'parinte-04'], // Marti: Mihai, Elena
  ['parinte-01', 'parinte-05'], // Miercuri: Ana, Dan
  ['parinte-02', 'parinte-01'], // Joi: Ioana, Ana
  ['parinte-04', 'parinte-03'], // Vineri: Elena, Mihai
];

const DRIVER_IDS_WEEK_2: [string, string][] = [
  ['parinte-05', 'parinte-01'],
  ['parinte-02', 'parinte-03'],
  ['parinte-04', 'parinte-01'],
  ['parinte-01', 'parinte-05'],
  ['parinte-03', 'parinte-02'],
];

const DRIVER_NAMES: Record<string, string> = {
  'parinte-01': 'Ana P.',
  'parinte-02': 'Ioana P.',
  'parinte-03': 'Mihai D.',
  'parinte-04': 'Elena R.',
  'parinte-05': 'Dan C.',
};

/** Friday afternoon shows what a ride looks like after its driver sent an alert. */
const ALERTED_RIDE_DAY_INDEX = 4;

/** Both weeks' rides. Dates are built from `today`, so they never go stale. */
export function getMockRides(
  today: Date,
  currentUserId?: string,
): CalendarRide[] {
  const mapDrivers = (driverIds: [string, string][]): WeekDrivers =>
    driverIds.map(([amId, pmId]) => [
      amId === currentUserId ? null : (DRIVER_NAMES[amId] ?? 'Șofer'),
      pmId === currentUserId ? null : (DRIVER_NAMES[pmId] ?? 'Șofer'),
    ]);

  return [
    ...getMockWeekRides(
      today,
      mapDrivers(DRIVER_IDS_WEEK_1),
      ALERTED_RIDE_DAY_INDEX,
    ),
    ...getMockWeekRides(
      addWeeks(today, 1),
      mapDrivers(DRIVER_IDS_WEEK_2),
      null,
    ),
  ];
}

/** The whole group's week: all 10 rides, each with its driver and all the children. */
function getMockWeekRides(
  weekDate: Date,
  drivers: WeekDrivers,
  alertedDayIndex: number | null,
): CalendarRide[] {
  const schoolDays = getWeekDays(weekDate).slice(0, drivers.length);

  return schoolDays.flatMap((day, index) => {
    const date = toISODate(day);
    const [morningDriver, afternoonDriver] = drivers[index];
    const shared = { date, seatsTaken: 5, seatsTotal: 5 };

    return [
      // Listed afternoon first so the screen's sort by departure time is visible.
      {
        ...shared,
        ...AFTERNOON,
        id: `${date}-afternoon`,
        driverName: afternoonDriver,
        children: ALL_CHILDREN,
        needsReplacement: index === alertedDayIndex,
      },
      {
        ...shared,
        ...MORNING,
        id: `${date}-morning`,
        driverName: morningDriver,
        children: ALL_CHILDREN,
        needsReplacement: false,
      },
    ];
  });
}

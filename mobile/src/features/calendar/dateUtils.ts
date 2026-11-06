// Names are written out because Intl is not reliable on Hermes.
type WeekdayNames = {
  label: string;
  fullName: string;
  lowerName: string;
};

/** Monday first. */
export const WEEKDAYS: readonly WeekdayNames[] = [
  { label: 'L', fullName: 'Luni', lowerName: 'luni' },
  { label: 'Ma', fullName: 'Marți', lowerName: 'marți' },
  { label: 'Mi', fullName: 'Miercuri', lowerName: 'miercuri' },
  { label: 'J', fullName: 'Joi', lowerName: 'joi' },
  { label: 'V', fullName: 'Vineri', lowerName: 'vineri' },
  { label: 'S', fullName: 'Sâmbătă', lowerName: 'sâmbătă' },
  { label: 'D', fullName: 'Duminică', lowerName: 'duminică' },
];

const SUNDAY_INDEX = 0;
/** Next week's schedule is ready from this hour on Sunday. */
const SCHEDULE_READY_HOUR = 18;

const MONTHS = [
  'Ianuarie',
  'Februarie',
  'Martie',
  'Aprilie',
  'Mai',
  'Iunie',
  'Iulie',
  'August',
  'Septembrie',
  'Octombrie',
  'Noiembrie',
  'Decembrie',
] as const;

const SHORT_MONTHS = [
  'ian.',
  'feb.',
  'mar.',
  'apr.',
  'mai',
  'iun.',
  'iul.',
  'aug.',
  'sept.',
  'oct.',
  'nov.',
  'dec.',
] as const;

const DAYS_IN_WEEK = 7;

function daysSinceMonday(date: Date): number {
  return (date.getDay() + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK;
}

export function getWeekdayNames(date: Date): WeekdayNames {
  return WEEKDAYS[daysSinceMonday(date)];
}

/** Monday of the week containing `date`, at local midnight. */
export function startOfWeek(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - daysSinceMonday(date),
  );
}

/** Monday to Sunday of the week containing `date`. */
export function getWeekDays(date: Date): Date[] {
  const monday = startOfWeek(date);

  return WEEKDAYS.map(
    (_day, index) =>
      new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + index,
      ),
  );
}

/**
 * The day the Calendar opens on: today, or next Monday from Sunday evening,
 * once every parent's schedule for the new week is in.
 */
export function getScheduleDate(now: Date): Date {
  const isScheduleReady =
    now.getDay() === SUNDAY_INDEX && now.getHours() >= SCHEDULE_READY_HOUR;

  return isScheduleReady
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    : now;
}

/** "YYYY-MM-DD" from local parts: toISOString() is UTC and can shift the day. */
export function toISODate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isSameDay(first: Date, second: Date): boolean {
  return toISODate(first) === toISODate(second);
}

/** For example "Noiembrie 2026". */
export function formatMonthYear(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** For example "Vineri, 6 nov." */
export function formatShortDate(date: Date): string {
  const { fullName } = getWeekdayNames(date);
  return `${fullName}, ${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
}

/** For example "Vineri 6 noiembrie", for screen readers. */
export function formatLongDate(date: Date): string {
  const { fullName } = getWeekdayNames(date);
  return `${fullName} ${date.getDate()} ${MONTHS[date.getMonth()].toLowerCase()}`;
}

import { isWeekScheduleFinal } from '@/utils/schedule';
import { toMinutes, type TimeString } from '@/utils/time';

// Names are written out because Intl is not reliable on Hermes.
type WeekdayNames = {
  label: string;
  fullName: string;
};

/** Monday first. */
export const WEEKDAYS: readonly WeekdayNames[] = [
  { label: 'L', fullName: 'Luni' },
  { label: 'Ma', fullName: 'Marți' },
  { label: 'Mi', fullName: 'Miercuri' },
  { label: 'J', fullName: 'Joi' },
  { label: 'V', fullName: 'Vineri' },
  { label: 'S', fullName: 'Sâmbătă' },
  { label: 'D', fullName: 'Duminică' },
];

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

/** The same weekday, `weeks` weeks later (or earlier, if negative). */
export function addWeeks(date: Date, weeks: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + weeks * DAYS_IN_WEEK,
  );
}

/**
 * The day the Calendar opens on: today, or next Monday from Sunday evening,
 * once every parent's schedule for the new week is in.
 */
export function getScheduleDate(now: Date): Date {
  return isWeekScheduleFinal(now)
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    : now;
}

/** True while a ride on `isoDate` at `departureTime` is still ahead of `now`. */
export function isRideUpcoming(
  isoDate: string,
  departureTime: TimeString,
  now: Date,
): boolean {
  const today = toISODate(now);
  if (isoDate !== today) return isoDate > today;

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  return toMinutes(departureTime) > minutesNow;
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

/** Monday to Sunday, for example "2–8 noiembrie" or "30 noiembrie – 6 decembrie". */
export function formatWeekRange(date: Date): string {
  const days = getWeekDays(date);
  const monday = days[0];
  const sunday = days[days.length - 1];
  const startMonth = MONTHS[monday.getMonth()].toLowerCase();
  const endMonth = MONTHS[sunday.getMonth()].toLowerCase();

  return startMonth === endMonth
    ? `${monday.getDate()}–${sunday.getDate()} ${endMonth}`
    : `${monday.getDate()} ${startMonth} – ${sunday.getDate()} ${endMonth}`;
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

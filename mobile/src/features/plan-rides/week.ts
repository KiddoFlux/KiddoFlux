import type { DateString, WeekDay } from './types';

const SCHOOL_DAYS = [
  { shortName: 'Lun', fullName: 'Luni' },
  { shortName: 'Mar', fullName: 'Marți' },
  { shortName: 'Mie', fullName: 'Miercuri' },
  { shortName: 'Joi', fullName: 'Joi' },
  { shortName: 'Vin', fullName: 'Vineri' },
] as const;

const MONTHS = [
  'ianuarie',
  'februarie',
  'martie',
  'aprilie',
  'mai',
  'iunie',
  'iulie',
  'august',
  'septembrie',
  'octombrie',
  'noiembrie',
  'decembrie',
] as const;

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

// Built from local parts: toISOString() is UTC and can land on the wrong day.
function toDateString(date: Date): DateString {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getNextMonday(today: Date): Date {
  const daysSinceMonday = (today.getDay() + 6) % 7;
  return addDays(today, 7 - daysSinceMonday);
}

/** Monday to Friday of the week after `today`. */
export function getNextSchoolWeek(today: Date): WeekDay[] {
  const monday = getNextMonday(today);

  return SCHOOL_DAYS.map((day, index) => {
    const date = addDays(monday, index);
    return {
      ...day,
      date: toDateString(date),
      dayOfMonth: date.getDate(),
    };
  });
}

/** For example "9–13 noiembrie" or "30 noiembrie – 4 decembrie". */
export function formatWeekRange(today: Date): string {
  const monday = getNextMonday(today);
  const friday = addDays(monday, SCHOOL_DAYS.length - 1);
  const startMonth = MONTHS[monday.getMonth()];
  const endMonth = MONTHS[friday.getMonth()];

  return startMonth === endMonth
    ? `${monday.getDate()}–${friday.getDate()} ${endMonth}`
    : `${monday.getDate()} ${startMonth} – ${friday.getDate()} ${endMonth}`;
}

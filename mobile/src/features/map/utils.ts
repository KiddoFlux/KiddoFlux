import type { RideDirection } from '@/types/ride';
import { toMinutes, type TimeString } from '@/utils/time';

import type { LatLng, MapPeriod, SchoolDay } from './types';

const EARTH_RADIUS_METERS = 6_371_000;
const NOON_HOUR = 12;
const MINUTES_PER_DAY = 24 * 60;
const SCHOOL_DAYS = 5;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Straight-line distance between two points. */
export function distanceMeters(from: LatLng, to: LatLng): number {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
}

/** For example "350 m" or "4,8 km". */
export function formatDistance(meters: number): string {
  const rounded = Math.round(meters);

  return rounded < 1000
    ? `${rounded} m`
    : `${(rounded / 1000).toFixed(1).replace('.', ',')} km`;
}

/** Shifts a time by whole minutes, wrapping around midnight. */
export function addMinutes(time: TimeString, minutes: number): TimeString {
  const total =
    (((toMinutes(time) + minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) %
    MINUTES_PER_DAY;
  const hours = String(Math.floor(total / 60)).padStart(2, '0');
  const rest = String(total % 60).padStart(2, '0');
  return `${hours}:${rest}`;
}

export function getDefaultPeriod(nowMs: number): MapPeriod {
  return new Date(nowMs).getHours() < NOON_HOUR ? 'morning' : 'afternoon';
}

export function getPeriodDirection(period: MapPeriod): RideDirection {
  return period === 'morning' ? 'toSchool' : 'toHome';
}

function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}

/** Monday to Friday of this week, or of next week once the weekend starts. */
export function getSchoolWeek(nowMs: number): Date[] {
  const now = new Date(nowMs);
  const daysSinceMonday = (now.getDay() + 6) % 7;
  const offset = isWeekend(now) ? 7 - daysSinceMonday : -daysSinceMonday;

  return Array.from(
    { length: SCHOOL_DAYS },
    (_day, index) =>
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + offset + index,
      ),
  );
}

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

/** For example "9–13 nov." or "30 nov. – 4 dec." */
export function formatWeekLabel(days: readonly Date[]): string {
  const first = days[0];
  const last = days[days.length - 1];
  const firstMonth = SHORT_MONTHS[first.getMonth()];
  const lastMonth = SHORT_MONTHS[last.getMonth()];

  return firstMonth === lastMonth
    ? `${first.getDate()}–${last.getDate()} ${lastMonth}`
    : `${first.getDate()} ${firstMonth} – ${last.getDate()} ${lastMonth}`;
}

export function isSameDate(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

/** Today on a school day, otherwise Monday. */
export function getDefaultDay(nowMs: number): SchoolDay {
  const now = new Date(nowMs);
  return isWeekend(now) ? 0 : (((now.getDay() + 6) % 7) as SchoolDay);
}

import type { RideDirection } from '@/types/ride';

import type { LatLng, MapPeriod, MapRide } from './types';

const EARTH_RADIUS_METERS = 6_371_000;
const NOON_HOUR = 12;
const MS_PER_MINUTE = 60_000;

/** About 500 m. A fixed grid can't be averaged back to the real spot, unlike random offsets. */
const LOCATION_GRID_DEGREES = 0.005;
const DISPLAY_DISTANCE_STEP_METERS = 50;

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

export function routeLengthMeters(route: readonly LatLng[]): number {
  return route.reduce(
    (total, point, index) =>
      index === 0 ? 0 : total + distanceMeters(route[index - 1], point),
    0,
  );
}

type RouteSplit = {
  position: LatLng;
  completed: LatLng[];
  remaining: LatLng[];
};

/** Splits a route at the point `traveledMeters` along it. The route needs at least one point. */
export function splitRoute(
  route: readonly LatLng[],
  traveledMeters: number,
): RouteSplit {
  let left = Math.max(traveledMeters, 0);

  for (let index = 1; index < route.length; index += 1) {
    const start = route[index - 1];
    const end = route[index];
    const length = distanceMeters(start, end);

    if (left <= length) {
      const fraction = length === 0 ? 0 : left / length;
      const position = {
        latitude: start.latitude + (end.latitude - start.latitude) * fraction,
        longitude:
          start.longitude + (end.longitude - start.longitude) * fraction,
      };

      return {
        position,
        completed: [...route.slice(0, index), position],
        remaining: [position, ...route.slice(index)],
      };
    }

    left -= length;
  }

  const last = route[route.length - 1];
  return { position: last, completed: [...route], remaining: [last] };
}

/** For example "350 m" or "1,2 km". */
export function formatDistance(meters: number): string {
  const rounded = Math.round(meters);

  return rounded < 1000
    ? `${rounded} m`
    : `${(rounded / 1000).toFixed(1).replace('.', ',')} km`;
}

/** A rounded distance, so exact measurements can't be used to locate a home. */
export function formatApproximateDistance(meters: number): string {
  const steps = Math.round(meters / DISPLAY_DISTANCE_STEP_METERS);
  return formatDistance(Math.max(steps, 1) * DISPLAY_DISTANCE_STEP_METERS);
}

/** Snaps a point to a fixed grid, so markers never show a family's exact home. */
export function approximateLocation(location: LatLng): LatLng {
  const snap = (value: number) =>
    Math.round(value / LOCATION_GRID_DEGREES) * LOCATION_GRID_DEGREES;

  return {
    latitude: snap(location.latitude),
    longitude: snap(location.longitude),
  };
}

/** Whole minutes from `fromMs` to `toMs`, never below zero. */
export function minutesBetween(fromMs: number, toMs: number): number {
  return Math.max(Math.floor((toMs - fromMs) / MS_PER_MINUTE), 0);
}

export function getDefaultPeriod(nowMs: number): MapPeriod {
  return new Date(nowMs).getHours() < NOON_HOUR ? 'morning' : 'afternoon';
}

export function getPeriodDirection(period: MapPeriod): RideDirection {
  return period === 'morning' ? 'toSchool' : 'toHome';
}

export function involvesMe(
  ride: MapRide,
  myChildrenIds: readonly string[],
): boolean {
  return (
    ride.driver.isCurrentUser ||
    ride.children.some((child) => myChildrenIds.includes(child.id))
  );
}

type DirectionCopy = {
  /** "spre școală" */
  toward: string;
  /** "până la școală" */
  until: string;
  /** "La școală", the arrival tile's label. */
  destinationLabel: string;
  /** "la școală", as in "a ajuns la școală". */
  arrivedAt: string;
};

export function getDirectionCopy(direction: RideDirection): DirectionCopy {
  return direction === 'toSchool'
    ? {
        toward: 'spre școală',
        until: 'până la școală',
        destinationLabel: 'La școală',
        arrivedAt: 'la școală',
      }
    : {
        toward: 'spre casă',
        until: 'până acasă',
        destinationLabel: 'Acasă',
        arrivedAt: 'acasă',
      };
}

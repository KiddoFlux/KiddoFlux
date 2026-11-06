import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { dateToTime } from '@/utils/time';

import type { LatLng, LiveRideState, MapRide } from '../types';
import { routeLengthMeters, splitRoute } from '../utils';

const TICK_MS = 3000;
/** Sped up, so a whole ride can be watched in about a minute. */
const MOCK_METERS_PER_TICK = 90;
/** About 25 km/h, the speed behind the ETA. */
const ETA_METERS_PER_SECOND = 7;

type UseLiveRideOptions = {
  ride: MapRide | null;
  route: readonly LatLng[];
  /** Where the mock starts, from 0 to 1. */
  startProgress?: number;
};

type Tracking = {
  rideId: string | null;
  traveledMeters: number;
  lastUpdatedAt: number;
  arrivedAtMs: number | null;
};

function startTracking(
  ride: MapRide | null,
  routeLength: number,
  startProgress: number,
): Tracking {
  const hasArrived = ride?.status === 'arrived';

  return {
    rideId: ride?.id ?? null,
    traveledMeters: hasArrived ? routeLength : routeLength * startProgress,
    lastUpdatedAt: Date.now(),
    arrivedAtMs: hasArrived ? (ride.arrivedAtMs ?? Date.now()) : null,
  };
}

/**
 * MOCK: moves the car along the route every few seconds. A Firebase listener can
 * replace it later and return this same shape.
 */
export function useLiveRide({
  ride,
  route,
  startProgress = 0,
}: UseLiveRideOptions): LiveRideState | null {
  const routeLength = useMemo(() => routeLengthMeters(route), [route]);
  const [tracking, setTracking] = useState(() =>
    startTracking(ride, routeLength, startProgress),
  );

  const rideId = ride?.id ?? null;
  const hasArrived = tracking.arrivedAtMs !== null;

  // Starts over when a different ride is followed.
  if (tracking.rideId !== rideId) {
    setTracking(startTracking(ride, routeLength, startProgress));
  }

  useEffect(() => {
    if (rideId === null || routeLength === 0 || hasArrived) return undefined;

    let timer: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      setTracking((current) => {
        const traveledMeters = current.traveledMeters + MOCK_METERS_PER_TICK;
        const reachedEnd = traveledMeters >= routeLength;

        return {
          ...current,
          traveledMeters: Math.min(traveledMeters, routeLength),
          lastUpdatedAt: Date.now(),
          arrivedAtMs: reachedEnd ? Date.now() : null,
        };
      });
    };
    const start = () => {
      timer ??= setInterval(tick, TICK_MS);
    };
    const stop = () => {
      if (timer !== null) clearInterval(timer);
      timer = null;
    };

    // Pauses while the app is in the background.
    if (AppState.currentState === 'active') start();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') start();
      else stop();
    });

    return () => {
      stop();
      subscription.remove();
    };
  }, [rideId, routeLength, hasArrived]);

  return useMemo(() => {
    if (!ride || route.length === 0) return null;

    const remaining = Math.max(routeLength - tracking.traveledMeters, 0);
    const etaMs =
      tracking.arrivedAtMs ??
      tracking.lastUpdatedAt + (remaining / ETA_METERS_PER_SECOND) * 1000;

    return {
      rideId: ride.id,
      position: splitRoute(route, tracking.traveledMeters).position,
      route,
      progress: routeLength === 0 ? 1 : tracking.traveledMeters / routeLength,
      distanceRemainingMeters: remaining,
      pickedUpAt: ride.departureTime,
      eta: dateToTime(new Date(etaMs)),
      targetArrival: ride.arrivalTime,
      status: tracking.arrivedAtMs !== null ? 'arrived' : ride.status,
      lastUpdatedAt: tracking.lastUpdatedAt,
      arrivedAt:
        tracking.arrivedAtMs !== null
          ? dateToTime(new Date(tracking.arrivedAtMs))
          : null,
      arrivedAtMs: tracking.arrivedAtMs,
    };
  }, [ride, route, routeLength, tracking]);
}

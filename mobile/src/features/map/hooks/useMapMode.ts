import { useMemo } from 'react';

import type { MapMode, MapRide } from '../types';
import { involvesMe } from '../utils';

const ARRIVED_LIVE_WINDOW_MS = 10 * 60_000;

/** Rule behind useMapMode, kept separate so it can be tested on its own. */
export function getMapMode(
  rides: readonly MapRide[],
  myChildrenIds: readonly string[],
  nowMs: number,
): MapMode {
  const myRides = rides.filter((ride) => involvesMe(ride, myChildrenIds));

  const active = myRides.find(
    (ride) => ride.status === 'pickedUp' || ride.status === 'inProgress',
  );
  if (active) return { mode: 'live', liveRideId: active.id };

  const justArrived = myRides.find(
    (ride) =>
      ride.status === 'arrived' &&
      ride.arrivedAtMs !== null &&
      nowMs - ride.arrivedAtMs <= ARRIVED_LIVE_WINDOW_MS,
  );
  if (justArrived) return { mode: 'live', liveRideId: justArrived.id };

  return { mode: 'browse' };
}

export function useMapMode(
  rides: readonly MapRide[],
  myChildrenIds: readonly string[],
  nowMs: number,
): MapMode {
  return useMemo(
    () => getMapMode(rides, myChildrenIds, nowMs),
    [rides, myChildrenIds, nowMs],
  );
}

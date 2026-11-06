import type { Child, RideDirection } from '@/types/ride';
import type { TimeString } from '@/utils/time';

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type RideStatus =
  'scheduled' | 'pickedUp' | 'inProgress' | 'arrived' | 'cancelled';

export type MapPeriod = 'morning' | 'afternoon';

export type MapDriver = {
  id: string;
  name: string;
  initial: string;
  phone: string;
  isCurrentUser: boolean;
};

export type MapRide = {
  id: string;
  direction: RideDirection;
  status: RideStatus;
  departureTime: TimeString;
  arrivalTime: TimeString;
  driver: MapDriver;
  seatsTaken: number;
  seatsTotal: number;
  children: readonly Child[];
  /** A rounded area, never a family's exact address. */
  approxPickup: LatLng;
  distanceFromMeMeters: number;
  /** When the ride arrived, in milliseconds since 1970. Null until then. */
  arrivedAtMs: number | null;
};

export type LiveRideState = {
  rideId: string;
  position: LatLng;
  route: readonly LatLng[];
  /** From 0 to 1. */
  progress: number;
  distanceRemainingMeters: number;
  pickedUpAt: TimeString;
  eta: TimeString;
  targetArrival: TimeString;
  status: RideStatus;
  /** In milliseconds since 1970. */
  lastUpdatedAt: number;
  /** When the car arrived. Null until then. */
  arrivedAt: TimeString | null;
  arrivedAtMs: number | null;
};

export type MapMode =
  | { mode: 'browse'; liveRideId?: undefined }
  | { mode: 'live'; liveRideId: string };

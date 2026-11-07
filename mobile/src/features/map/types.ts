import type { AvatarTone } from '@/components/ui/Avatar';
import type { Child, RideDirection } from '@/types/ride';
import type { TimeString } from '@/utils/time';

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type MapPeriod = 'morning' | 'afternoon';

/** Monday is 0, Friday is 4. */
export type SchoolDay = 0 | 1 | 2 | 3 | 4;

export type School = {
  name: string;
  /** "Fram", where space is tight, like the map pin. */
  shortName: string;
  address: string;
  city: string;
  coordinate: LatLng;
};

export type CarpoolParent = {
  id: string;
  name: string;
  /** "Ioana", used in "Acasă la Ioana". */
  firstName: string;
  initial: string;
  tone: AvatarTone;
  phone: string;
  car: string;
  address: string;
  home: LatLng;
  children: readonly Child[];
};

export type RouteStop = {
  id: string;
  /** "pickup" is the driver's home, where the children get in or out. */
  kind: 'pickup' | 'school';
  label: string;
  address: string;
  coordinate: LatLng;
  time: TimeString;
};

export type CarpoolRide = {
  id: string;
  day: SchoolDay;
  period: MapPeriod;
  direction: RideDirection;
  driver: CarpoolParent;
  /** Always two: where the ride starts and where it ends. */
  stops: readonly RouteStop[];
  children: readonly Child[];
  path: readonly LatLng[];
  distanceMeters: number;
  durationMinutes: number;
  departureTime: TimeString;
  arrivalTime: TimeString;
};

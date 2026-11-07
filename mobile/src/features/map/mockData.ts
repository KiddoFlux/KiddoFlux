import type { Child } from '@/types/ride';
import type { TimeString } from '@/utils/time';

import { SIBIU_ROUTES } from './sibiuRoutes';
import type {
  CarpoolParent,
  CarpoolRide,
  LatLng,
  MapPeriod,
  RouteStop,
  School,
  SchoolDay,
} from './types';
import { addMinutes, getPeriodDirection } from './utils';

// MOCK: three neighbouring families on Strada Negovanu. Mihai drives every day,
// and the other children are walked to his home at Negovanu 2.
// Names and phone numbers are invented placeholders, not real people's.

/** Sibiu's centre, used until the user's location is known. */
export const DEFAULT_CENTER: LatLng = { latitude: 45.7983, longitude: 24.1469 };

export const mockSchool: School = {
  name: 'Fram Early Learning Center',
  shortName: 'Fram',
  address: 'Calea Dumbrăvii 147',
  city: 'Sibiu',
  coordinate: { latitude: 45.77141, longitude: 24.13942 },
};

export const mockMyChildrenIds: readonly string[] = ['child-1'];

const MARIA: Child = {
  id: 'child-1',
  name: 'Maria',
  initial: 'M',
  tone: 'peach',
};
const LUCA: Child = {
  id: 'child-3',
  name: 'Luca',
  initial: 'L',
  tone: 'steel',
};
const SOFIA: Child = {
  id: 'child-4',
  name: 'Sofia',
  initial: 'S',
  tone: 'peach',
};
const DAVID: Child = {
  id: 'child-5',
  name: 'David',
  initial: 'D',
  tone: 'sage',
};

const IOANA: CarpoolParent = {
  id: 'parent-ioana',
  name: 'Ioana Popescu',
  firstName: 'Ioana',
  initial: 'I',
  tone: 'peach',
  phone: '+40700000001',
  car: 'Dacia Duster albastră',
  address: 'Str. Negovanu 9',
  home: { latitude: 45.78353, longitude: 24.17298 },
  children: [MARIA],
};
const MIHAI: CarpoolParent = {
  id: 'parent-mihai',
  name: 'Mihai Dumitrescu',
  firstName: 'Mihai',
  initial: 'M',
  tone: 'steel',
  phone: '+40700000002',
  car: 'Skoda Octavia gri',
  address: 'Str. Negovanu 2',
  home: { latitude: 45.78309, longitude: 24.17212 },
  children: [LUCA],
};
const ELENA: CarpoolParent = {
  id: 'parent-elena',
  name: 'Elena Radu',
  firstName: 'Elena',
  initial: 'E',
  tone: 'sage',
  phone: '+40700000003',
  car: 'Toyota Corolla albă',
  address: 'Str. Negovanu 16',
  home: { latitude: 45.78402, longitude: 24.17395 },
  children: [SOFIA, DAVID],
};

export const mockParents: readonly CarpoolParent[] = [IOANA, MIHAI, ELENA];

const ALL_CHILDREN = mockParents.flatMap((parent) => parent.children);

/** The only parent who drives, both ways, every school day. */
const DRIVER = MIHAI;
const SCHOOL_DAYS: readonly SchoolDay[] = [0, 1, 2, 3, 4];

const SCHOOL_STARTS_AT: TimeString = '07:50';
const SCHOOL_PICKUP_AT: TimeString = '16:30';
/** Time for every child to get in at the driver's home. */
const BOARDING_MINUTES = 3;

/** The other children walk to the driver's home and get in there. */
function pickupStop(driver: CarpoolParent, time: TimeString): RouteStop {
  return {
    id: `pickup-${driver.id}`,
    kind: 'pickup',
    label: `Acasă la ${driver.firstName}`,
    address: driver.address,
    coordinate: driver.home,
    time,
  };
}

function schoolStop(time: TimeString): RouteStop {
  return {
    id: 'school',
    kind: 'school',
    label: mockSchool.name,
    address: mockSchool.address,
    coordinate: mockSchool.coordinate,
    time,
  };
}

function buildRide(
  day: SchoolDay,
  period: MapPeriod,
  driver: CarpoolParent,
): CarpoolRide {
  const route = SIBIU_ROUTES[period];
  const drivingMinutes = Math.ceil(route.durationSeconds / 60);
  const isMorning = period === 'morning';
  // The road ends at the kerb; the two ends join it to the doors on the map.
  const roadPath = route.path.map(([latitude, longitude]) => ({
    latitude,
    longitude,
  }));

  // In the morning the time counts from when the children gather, before boarding.
  const durationMinutes = drivingMinutes + (isMorning ? BOARDING_MINUTES : 0);
  const departureTime = isMorning
    ? addMinutes(SCHOOL_STARTS_AT, -durationMinutes)
    : SCHOOL_PICKUP_AT;
  const arrivalTime = addMinutes(departureTime, durationMinutes);

  return {
    id: `${day}-${period}`,
    day,
    period,
    direction: getPeriodDirection(period),
    driver,
    stops: isMorning
      ? [pickupStop(driver, departureTime), schoolStop(arrivalTime)]
      : [schoolStop(departureTime), pickupStop(driver, arrivalTime)],
    children: ALL_CHILDREN,
    path: isMorning
      ? [driver.home, ...roadPath, mockSchool.coordinate]
      : [mockSchool.coordinate, ...roadPath, driver.home],
    distanceMeters: route.distanceMeters,
    durationMinutes,
    departureTime,
    arrivalTime,
  };
}

export function getMockRides(): CarpoolRide[] {
  return SCHOOL_DAYS.flatMap((day) => [
    buildRide(day, 'morning', DRIVER),
    buildRide(day, 'afternoon', DRIVER),
  ]);
}

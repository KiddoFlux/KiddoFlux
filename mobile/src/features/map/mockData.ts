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

export const mockMyChildrenIds: readonly string[] = ['copil-parinte-01'];

const LUCA: Child = {
  id: 'copil-parinte-01',
  name: 'Luca',
  initial: 'L',
  tone: 'peach',
};
const MARIA: Child = {
  id: 'copil-parinte-02',
  name: 'Maria',
  initial: 'M',
  tone: 'peach',
};
const ANDREI: Child = {
  id: 'copil-parinte-03',
  name: 'Andrei',
  initial: 'A',
  tone: 'steel',
};
const SOFIA: Child = {
  id: 'copil-parinte-04',
  name: 'Sofia',
  initial: 'S',
  tone: 'sage',
};
const DAVID: Child = {
  id: 'copil-parinte-05',
  name: 'David',
  initial: 'D',
  tone: 'sage',
};

const ANA: CarpoolParent = {
  id: 'parinte-01',
  name: 'Ana Popescu',
  firstName: 'Ana',
  initial: 'A',
  tone: 'peach',
  phone: '0700 100 001',
  car: 'Dacia Duster Gri',
  address: 'Str. Negovanu 9',
  home: { latitude: 45.78353, longitude: 24.17298 },
  children: [LUCA],
};
const IOANA: CarpoolParent = {
  id: 'parinte-02',
  name: 'Ioana Pavel',
  firstName: 'Ioana',
  initial: 'I',
  tone: 'peach',
  phone: '0700 100 002',
  car: 'Skoda Octavia Alb',
  address: 'Str. Negovanu 12',
  home: { latitude: 45.78385, longitude: 24.17265 },
  children: [MARIA],
};
const MIHAI: CarpoolParent = {
  id: 'parinte-03',
  name: 'Mihai Dumitru',
  firstName: 'Mihai',
  initial: 'M',
  tone: 'steel',
  phone: '0700 100 003',
  car: 'Volkswagen Touran Negru',
  address: 'Str. Negovanu 2',
  home: { latitude: 45.78309, longitude: 24.17212 },
  children: [ANDREI],
};
const ELENA: CarpoolParent = {
  id: 'parinte-04',
  name: 'Elena Radu',
  firstName: 'Elena',
  initial: 'E',
  tone: 'sage',
  phone: '0700 100 004',
  car: 'Renault Clio Roșu',
  address: 'Str. Negovanu 16',
  home: { latitude: 45.78402, longitude: 24.17395 },
  children: [SOFIA],
};
const DAN: CarpoolParent = {
  id: 'parinte-05',
  name: 'Dan Constantin',
  firstName: 'Dan',
  initial: 'D',
  tone: 'steel',
  phone: '0700 100 005',
  car: 'Ford Focus Albastru',
  address: 'Str. Negovanu 5',
  home: { latitude: 45.78325, longitude: 24.1724 },
  children: [DAVID],
};

export const mockParents: readonly CarpoolParent[] = [
  ANA,
  IOANA,
  MIHAI,
  ELENA,
  DAN,
];

const ALL_CHILDREN = mockParents.flatMap((parent) => parent.children);

const SCHOOL_DAYS: readonly SchoolDay[] = [0, 1, 2, 3, 4];

/** Soferii desemnati pentru fiecare zi din saptamana [dimineata, dupa-amiaza] */
const WEEK_DRIVERS: Record<
  SchoolDay,
  { morning: CarpoolParent; afternoon: CarpoolParent }
> = {
  0: { morning: ANA, afternoon: IOANA },
  1: { morning: MIHAI, afternoon: ELENA },
  2: { morning: ANA, afternoon: DAN },
  3: { morning: IOANA, afternoon: ANA },
  4: { morning: ELENA, afternoon: MIHAI },
};

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
    buildRide(day, 'morning', WEEK_DRIVERS[day].morning),
    buildRide(day, 'afternoon', WEEK_DRIVERS[day].afternoon),
  ]);
}

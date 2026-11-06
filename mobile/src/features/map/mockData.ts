import type { Child } from '@/types/ride';
import { dateToTime } from '@/utils/time';

import type { LatLng, MapDriver, MapRide } from './types';
import { approximateLocation } from './utils';

/**
 * Change this to test the screen, then reload the app:
 * - 'live': opens following Maria's ride
 * - 'arrived': the same ride, a few seconds from arriving
 * - 'late': the same ride, with the ETA after the target time
 * - 'browse': no ride in progress, so it opens on the carousel
 * - 'empty': no rides at all
 */
export type MockMapScenario = 'live' | 'arrived' | 'late' | 'browse' | 'empty';
export const MOCK_MAP_SCENARIO: MockMapScenario = 'live';

const MS_PER_MINUTE = 60_000;

export const mockSchool: LatLng = { latitude: 44.4378, longitude: 26.0963 };
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

// The numbers below are invented placeholders, not real people's.
const IOANA: MapDriver = {
  id: 'parent-1',
  name: 'Ioana P.',
  initial: 'I',
  phone: '+40700000001',
  isCurrentUser: false,
};
const MIHAI: MapDriver = {
  id: 'parent-2',
  name: 'Mihai D.',
  initial: 'M',
  phone: '+40700000002',
  isCurrentUser: false,
};
const ELENA: MapDriver = {
  id: 'parent-3',
  name: 'Elena R.',
  initial: 'E',
  phone: '+40700000003',
  isCurrentUser: false,
};
const DAN: MapDriver = {
  id: 'parent-4',
  name: 'Dan C.',
  initial: 'D',
  phone: '+40700000004',
  isCurrentUser: false,
};

const LIVE_RIDE_ID = 'ride-morning-1';

/** From the pickup area to the school. */
const LIVE_ROUTE: readonly LatLng[] = [
  { latitude: 44.4235, longitude: 26.0855 },
  { latitude: 44.4258, longitude: 26.0872 },
  { latitude: 44.4272, longitude: 26.0905 },
  { latitude: 44.4301, longitude: 26.0918 },
  { latitude: 44.4323, longitude: 26.0941 },
  { latitude: 44.4349, longitude: 26.0948 },
  mockSchool,
];

const START_PROGRESS: Record<MockMapScenario, number> = {
  live: 0.15,
  arrived: 0.97,
  late: 0.15,
  browse: 0,
  empty: 0,
};

function minutesFromNow(nowMs: number, minutes: number) {
  return dateToTime(new Date(nowMs + minutes * MS_PER_MINUTE));
}

export function getMockMapData(scenario: MockMapScenario, nowMs: number) {
  const isLiveScenario = scenario !== 'browse' && scenario !== 'empty';
  // With a 1-minute target, the ride's real ETA of a few minutes runs late.
  const targetMinutes = scenario === 'late' ? 1 : 15;

  const rides: MapRide[] = [
    {
      id: LIVE_RIDE_ID,
      direction: 'toSchool',
      status: isLiveScenario ? 'inProgress' : 'scheduled',
      departureTime: isLiveScenario ? minutesFromNow(nowMs, -5) : '07:35',
      arrivalTime: isLiveScenario
        ? minutesFromNow(nowMs, targetMinutes)
        : '08:00',
      driver: IOANA,
      seatsTaken: 3,
      seatsTotal: 4,
      children: [MARIA, LUCA],
      approxPickup: approximateLocation({
        latitude: 44.4235,
        longitude: 26.0855,
      }),
      distanceFromMeMeters: 350,
      arrivedAtMs: null,
    },
    {
      id: 'ride-morning-2',
      direction: 'toSchool',
      status: 'scheduled',
      departureTime: '07:30',
      arrivalTime: '08:00',
      driver: MIHAI,
      seatsTaken: 2,
      seatsTotal: 4,
      children: [SOFIA, DAVID],
      approxPickup: approximateLocation({
        latitude: 44.4301,
        longitude: 26.1052,
      }),
      distanceFromMeMeters: 720,
      arrivedAtMs: null,
    },
    {
      id: 'ride-morning-3',
      direction: 'toSchool',
      status: 'scheduled',
      departureTime: '07:40',
      arrivalTime: '08:00',
      driver: ELENA,
      seatsTaken: 1,
      seatsTotal: 3,
      children: [DAVID],
      approxPickup: approximateLocation({
        latitude: 44.4449,
        longitude: 26.0851,
      }),
      distanceFromMeMeters: 1240,
      arrivedAtMs: null,
    },
    {
      id: 'ride-afternoon-1',
      direction: 'toHome',
      status: 'scheduled',
      departureTime: '14:30',
      arrivalTime: '15:00',
      driver: DAN,
      seatsTaken: 3,
      seatsTotal: 4,
      children: [MARIA, SOFIA],
      approxPickup: approximateLocation({
        latitude: 44.4252,
        longitude: 26.0998,
      }),
      distanceFromMeMeters: 480,
      arrivedAtMs: null,
    },
    {
      id: 'ride-afternoon-2',
      direction: 'toHome',
      status: 'scheduled',
      departureTime: '14:45',
      arrivalTime: '15:15',
      driver: ELENA,
      seatsTaken: 2,
      seatsTotal: 3,
      children: [LUCA, DAVID],
      approxPickup: approximateLocation({
        latitude: 44.4402,
        longitude: 26.1104,
      }),
      distanceFromMeMeters: 950,
      arrivedAtMs: null,
    },
  ];

  return {
    rides: scenario === 'empty' ? [] : rides,
    liveRoutes: { [LIVE_RIDE_ID]: LIVE_ROUTE },
    liveStartProgress: START_PROGRESS[scenario],
  };
}

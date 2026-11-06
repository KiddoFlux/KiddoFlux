import type { NextRide } from './types';

// TODO: replace with the real next ride once rides are stored in Firestore.
export const mockNextRide: NextRide = {
  dayLabel: 'azi',
  direction: 'toSchool',
  departureTime: '07:35',
  arrivalTime: '08:00',
  children: [
    { id: 'child-1', name: 'Maria', initial: 'M', tone: 'peach' },
    { id: 'child-2', name: 'Andrei', initial: 'A', tone: 'sage' },
  ],
  driverName: null,
};

export const mockHasUnreadNotifications = true;

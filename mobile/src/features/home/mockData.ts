import type { CurrentUser, NextRide } from './types';

export const mockUser: CurrentUser = {
  id: 'user-1',
  name: 'Ana',
  initial: 'A',
  greeting: 'Bună dimineața,',
};

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

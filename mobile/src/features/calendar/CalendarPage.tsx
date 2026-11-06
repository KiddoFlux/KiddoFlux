import { router } from 'expo-router';
import { useState } from 'react';

import { CalendarScreen } from './CalendarScreen';
import { getScheduleDate } from './dateUtils';
import { getMockAvailableParents, getMockRides } from './mockData';

// TODO: connect these once the screens and the Firebase backend exist.
const noop = () => {};

/** Supplies the Calendar's data and actions. CalendarScreen only draws them. */
export function CalendarPage() {
  const [scheduleDate] = useState(() => getScheduleDate(new Date()));

  return (
    <CalendarScreen
      rides={getMockRides(scheduleDate)}
      availableParentsByDate={getMockAvailableParents(scheduleDate)}
      initialDate={scheduleDate}
      onPlanRides={() => router.push('/planifica')}
      onOpenRide={noop}
      onOpenAvailableParents={noop}
    />
  );
}

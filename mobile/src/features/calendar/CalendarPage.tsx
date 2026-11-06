import { router } from 'expo-router';
import { useState } from 'react';

import { isWeekScheduleFinal, PLANNING_DEADLINE_HOUR } from '@/utils/schedule';

import { CalendarScreen } from './CalendarScreen';
import { getScheduleDate, startOfWeek } from './dateUtils';
import { getMockRides, mockMyChildrenIds } from './mockData';

/** Supplies the Calendar's data and actions. CalendarScreen only draws them. */
export function CalendarPage() {
  const [today] = useState(() => new Date());
  const [alertedRideIds, setAlertedRideIds] = useState<readonly string[]>([]);
  const [takenRideIds, setTakenRideIds] = useState<readonly string[]>([]);

  const rides = getMockRides(today).map((ride) =>
    takenRideIds.includes(ride.id)
      ? { ...ride, driverName: null, needsReplacement: false }
      : {
          ...ride,
          needsReplacement:
            ride.needsReplacement || alertedRideIds.includes(ride.id),
        },
  );

  return (
    <CalendarScreen
      rides={rides}
      myChildrenIds={mockMyChildrenIds}
      firstWeekDate={today}
      initialDate={getScheduleDate(today)}
      nextWeekNote={
        isWeekScheduleFinal(today)
          ? null
          : `Se finalizează duminică, ora ${PLANNING_DEADLINE_HOUR}:00`
      }
      // TODO: use the real time with Firebase. With mock data, the start of the
      // week keeps the whole week's "Nu pot conduce" buttons available to try.
      now={startOfWeek(today)}
      onPlanRides={() => router.push('/planifica')}
      // TODO: save this to Firebase and send a push alert to the group's parents.
      // For now the ride is only marked on this device.
      onReportCannotDrive={(rideId) =>
        setAlertedRideIds((current) => [...current, rideId])
      }
      // TODO: use a Firestore transaction so only the first parent gets the ride,
      // then notify the group. For now it only changes on this device.
      onTakeOverRide={(rideId) =>
        setTakenRideIds((current) => [...current, rideId])
      }
    />
  );
}

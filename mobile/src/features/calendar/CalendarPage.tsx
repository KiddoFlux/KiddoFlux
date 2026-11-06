import { router } from 'expo-router';
import { useState } from 'react';

import { CalendarScreen } from './CalendarScreen';
import { getScheduleDate, startOfWeek } from './dateUtils';
import { getMockRides } from './mockData';

// TODO: open ride details once that screen exists.
const noop = () => {};

/** Supplies the Calendar's data and actions. CalendarScreen only draws them. */
export function CalendarPage() {
  const [scheduleDate] = useState(() => getScheduleDate(new Date()));
  const [alertedRideIds, setAlertedRideIds] = useState<readonly string[]>([]);
  const [takenRideIds, setTakenRideIds] = useState<readonly string[]>([]);

  const rides = getMockRides(scheduleDate).map((ride) =>
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
      initialDate={scheduleDate}
      // TODO: use the real time with Firebase. With mock data, the start of the
      // week keeps the whole week's "Nu pot conduce" buttons available to try.
      now={startOfWeek(scheduleDate)}
      onPlanRides={() => router.push('/planifica')}
      onOpenRide={noop}
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

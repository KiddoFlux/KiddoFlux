import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { isWeekScheduleFinal, PLANNING_DEADLINE_HOUR } from '@/utils/schedule';

import { subscribeWeekPlan } from '../plan-rides/planStorage';
import type { WeekPlan } from '../plan-rides/types';
import { CalendarScreen } from './CalendarScreen';
import {
  addWeeks,
  getScheduleDate,
  getWeekDays,
  startOfWeek,
  toISODate,
} from './dateUtils';
import { getMockRides, mockMyChildrenIds } from './mockData';
import { mergePublishedRides } from './publishedRides';

/** Supplies the Calendar's data and actions. CalendarScreen only draws them. */
export function CalendarPage() {
  const { profil } = useAuth();
  const [today] = useState(() => new Date());
  const [plans, setPlans] = useState<readonly (WeekPlan | null)[]>([
    null,
    null,
  ]);
  const [alertedRideIds, setAlertedRideIds] = useState<readonly string[]>([]);
  const [takenRideIds, setTakenRideIds] = useState<readonly string[]>([]);

  const parentId = profil?.id;
  // This week and next week, as Monday dates ("YYYY-MM-DD").
  const weeks = useMemo(() => {
    const monday = startOfWeek(today);
    return [monday, addWeeks(monday, 1)].map((start) => ({
      start: toISODate(start),
      dates: new Set(getWeekDays(start).map(toISODate)),
    }));
  }, [today]);

  // Live: a plan published on the planning page shows up here right away.
  useEffect(() => {
    if (!parentId) return;

    const unsubscribes = weeks.map(({ start }, index) =>
      subscribeWeekPlan(parentId, start, (plan) =>
        setPlans((current) =>
          current.map((existing, i) => (i === index ? plan : existing)),
        ),
      ),
    );
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [parentId, weeks]);

  const publishedPlans = weeks.flatMap(({ dates }, index) => {
    const plan = plans[index];
    return plan ? [{ weekDates: dates, plan }] : [];
  });

  const rides = mergePublishedRides(getMockRides(today), publishedPlans).map(
    (ride) =>
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

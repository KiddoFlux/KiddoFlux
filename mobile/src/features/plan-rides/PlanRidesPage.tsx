import { router } from 'expo-router';
import { useState } from 'react';

import { isWeekScheduleFinal } from '@/utils/schedule';

import { PlanningLockedScreen } from './PlanningLockedScreen';
import { PlanRidesScreen } from './PlanRidesScreen';
import { formatWeekRange, getNextSchoolWeek } from './week';

/** Supplies the planning page's dates and actions. PlanRidesScreen only draws them. */
export function PlanRidesPage() {
  const [today] = useState(() => new Date());
  const [isLocked, setIsLocked] = useState(() => isWeekScheduleFinal(today));

  if (isLocked) {
    return (
      <PlanningLockedScreen
        onBack={() => router.back()}
        onOpenCalendar={() => router.replace('/calendar')}
      />
    );
  }

  return (
    <PlanRidesScreen
      days={getNextSchoolWeek(today)}
      weekRange={formatWeekRange(today)}
      onBack={() => router.back()}
      onPublish={() => {
        // The deadline can pass while this page is open.
        if (isWeekScheduleFinal(new Date())) {
          setIsLocked(true);
          return;
        }

        // TODO: save the plan to Firebase, which must enforce the deadline too.
        router.back();
      }}
    />
  );
}

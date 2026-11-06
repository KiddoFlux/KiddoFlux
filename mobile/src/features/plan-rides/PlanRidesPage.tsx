import { router } from 'expo-router';
import { useState } from 'react';

import { PlanRidesScreen } from './PlanRidesScreen';
import { formatWeekRange, getNextSchoolWeek } from './week';

/** Supplies the planning page's dates and actions. PlanRidesScreen only draws them. */
export function PlanRidesPage() {
  const [today] = useState(() => new Date());

  return (
    <PlanRidesScreen
      days={getNextSchoolWeek(today)}
      weekRange={formatWeekRange(today)}
      onBack={() => router.back()}
      // TODO: save the plan to Firebase. For now it is not saved.
      onPublish={() => router.back()}
    />
  );
}

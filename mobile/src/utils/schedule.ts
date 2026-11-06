const SUNDAY = 0;

/** Parents can plan next week until this hour on Sunday. */
export const PLANNING_DEADLINE_HOUR = 18;

/**
 * From Sunday evening next week's schedule is final: planning locks and the
 * Calendar moves to the new week. Planning reopens on Monday.
 */
export function isWeekScheduleFinal(now: Date): boolean {
  return now.getDay() === SUNDAY && now.getHours() >= PLANNING_DEADLINE_HOUR;
}

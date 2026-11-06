/** 24-hour time in "HH:mm" format. */
export type TimeString = `${string}:${string}`;

export function toMinutes(time: TimeString): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function dateToTime(date: Date): TimeString {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

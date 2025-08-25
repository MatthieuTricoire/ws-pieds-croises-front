export function addMinutesToDate(start: Date | string, minutes: number): Date {
  const date = start instanceof Date ? start : new Date(start);
  return new Date(date.getTime() + minutes * 60_000);
}

import { DateTime } from "luxon";

export function formatDate(date: Date): string {
  return DateTime.fromJSDate(date, { zone: "Europe/Paris" })
    .setLocale("fr")
    .toLocaleString(DateTime.DATE_FULL);
}

export function formatTime(date: Date): string {
  return DateTime.fromJSDate(date, { zone: "Europe/Paris" }).toLocaleString(
    DateTime.TIME_SIMPLE
  );
}

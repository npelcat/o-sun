// lib/date.ts
import { DateTime } from "luxon";

// ============================================
// PARSING
// ============================================

/**
 * Convertit une string ou Date en objet Date
 * Utile pour parser les réponses JSON de l'API
 */
export function parseDate(date: Date | string): Date {
  return typeof date === "string" ? new Date(date) : date;
}

// ============================================
// FORMATAGE
// ============================================

export function formatDate(date: Date | string): string {
  const dateObj = parseDate(date);
  return DateTime.fromJSDate(dateObj, { zone: "Europe/Paris" })
    .setLocale("fr")
    .toLocaleString(DateTime.DATE_FULL);
}

export function formatTime(date: Date | string): string {
  const dateObj = parseDate(date);
  return DateTime.fromJSDate(dateObj, { zone: "Europe/Paris" }).toLocaleString(
    DateTime.TIME_SIMPLE
  );
}

export function formatDateTime(date: Date | string): string {
  const dateObj = parseDate(date);
  return DateTime.fromJSDate(dateObj, { zone: "Europe/Paris" })
    .setLocale("fr")
    .toFormat("d LLLL yyyy 'à' HH'h'mm");
}

export function formatDateOnly(date: Date | string): string {
  const dateObj = parseDate(date);
  return DateTime.fromJSDate(dateObj, { zone: "Europe/Paris" })
    .setLocale("fr")
    .toFormat("d LLLL yyyy");
}

export function formatTimeOnly(date: Date | string): string {
  const dateObj = parseDate(date);
  return DateTime.fromJSDate(dateObj, { zone: "Europe/Paris" }).toFormat(
    "HH'h'mm"
  );
}

export function formatDateTimeRange(
  start: Date | string,
  end: Date | string
): string {
  const startDT = DateTime.fromJSDate(parseDate(start), {
    zone: "Europe/Paris",
  }).setLocale("fr");
  const endDT = DateTime.fromJSDate(parseDate(end), {
    zone: "Europe/Paris",
  });

  const dateStr = startDT.toFormat("d LLLL yyyy");
  const startTime = startDT.toFormat("HH'h'mm");
  const endTime = endDT.toFormat("HH'h'mm");

  return `${dateStr} de ${startTime} à ${endTime}`;
}

export function getCurrentMonth(): string {
  return DateTime.now().toFormat("yyyy-MM");
}

export function toISOString(date: Date | string): string {
  return parseDate(date).toISOString();
}

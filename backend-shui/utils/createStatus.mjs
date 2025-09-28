
import { DateTime } from 'luxon';


export function timeAgo(date, locale = 'en') {
  const targetDate = DateTime.fromJSDate(new Date(date));
  
  if (!targetDate.isValid) {
    throw new Error(`Invalid date provided: ${targetDate.invalidReason}`);
  }

  return targetDate.setLocale(locale).toRelative() || 'just now';
}


export function createStatus(status, timestamp = new Date(), locale = 'en') {
  const statusTimestamp = DateTime.fromJSDate(new Date(timestamp));
  
  if (!statusTimestamp.isValid) {
    throw new Error(`Invalid timestamp provided: ${statusTimestamp.invalidReason}`);
  }

  return {
    status,
    timestamp: statusTimestamp.toISO(),
    timeAgo: statusTimestamp.setLocale(locale).toRelative(),
    createdAt: statusTimestamp.toJSDate(),
    formatted: statusTimestamp.setLocale(locale).toFormat('dd MMMM yyyy HH:mm')
  };
}

export function formatDate(date, format = 'dd MMMM yyyy HH:mm', locale = 'en') {
  const targetDate = DateTime.fromJSDate(new Date(date));
  
  if (!targetDate.isValid) {
    throw new Error(`Invalid date provided: ${targetDate.invalidReason}`);
  }

  return targetDate.setLocale(locale).toFormat(format);
}

export function isWithinHours(date, hours) {
  const targetDate = DateTime.fromJSDate(new Date(date));
  const now = DateTime.now();
  
  if (!targetDate.isValid) {
    return false;
  }

  const diffInHours = now.diff(targetDate, 'hours').hours;
  return Math.abs(diffInHours) <= hours;
}


export function getDayBounds(date, timezone = 'UTC') {
  const targetDate = DateTime.fromJSDate(new Date(date)).setZone(timezone);
  
  if (!targetDate.isValid) {
    throw new Error(`Invalid date provided: ${targetDate.invalidReason}`);
  }

  return {
    startOfDay: targetDate.startOf('day').toISO(),
    endOfDay: targetDate.endOf('day').toISO()
  };
}


export function addTime(date, duration) {
  const targetDate = DateTime.fromJSDate(new Date(date));
  
  if (!targetDate.isValid) {
    throw new Error(`Invalid date provided: ${targetDate.invalidReason}`);
  }

  return targetDate.plus(duration).toISO();
}


export function formatDateByContext(date, context, locale = 'en') {
  const targetDate = DateTime.fromJSDate(new Date(date));
  
  if (!targetDate.isValid) {
    throw new Error(`Invalid date provided: ${targetDate.invalidReason}`);
  }

  const dt = targetDate.setLocale(locale);
  
  switch (context) {
    case 'short':
      return dt.toFormat('dd/MM/yyyy');
    case 'long':
      return dt.toFormat('dd MMMM yyyy');
    case 'time':
      return dt.toFormat('HH:mm');
    case 'datetime':
      return dt.toFormat('dd MMMM yyyy HH:mm');
    default:
      return dt.toFormat('dd MMMM yyyy');
  }
}

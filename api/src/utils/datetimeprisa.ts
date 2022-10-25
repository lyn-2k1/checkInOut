import { Prisma } from '@prisma/client';
import * as moment from 'moment';
const isPrimitive = (val) => Object(val) !== val;

// // Subtract 9 hours from all the Date objects recursively
export function subtractHours(obj: Record<string, unknown>) {
  if (!obj) return;

  for (const key of Object.keys(obj)) {
    const val = obj[key];

    if (val instanceof Date) {
      obj[key] = formatDatePrisma(val);
    } else if (!isPrimitive(val)) {
      subtractHours(val as any);
    }
  }
}

export function prismaTimeMod<T>(value: T): T {
  if (value instanceof Date) {
    return formatDatePrisma(value) as any;
  }

  if (isPrimitive(value)) {
    return value;
  }

  subtractHours(value as any);

  return value;
}

/**
 * It takes a date and a timezone, and returns a date that is the same as the input date, but in the
 * timezone specified
 * @param {Date} date - Date - The date you want to format
 * @param [timezone=7] - The timezone of the server.
 * @returns A function that takes in a date and timezone and returns a date.
 */
export function formatDatePrisma(date: string | Date, timezone = 7) {
  if (timezone > 0) {
    return moment(date).add(timezone, 'hour').toDate();
  }
  return moment(date).subtract(timezone, 'hour').toDate();
}

export function formatDateToUtc0(date: string | Date, timezone = 7) {
  if (timezone > 0) {
    return moment(date).subtract(timezone, 'hour').toDate();
  }
  return moment(date).add(timezone, 'hour').toDate();
}


export function dateTimeMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const result = await next(params);

    return prismaTimeMod(result);
  };
}

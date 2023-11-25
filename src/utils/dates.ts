import { eachDayOfInterval, endOfWeek, isSameDay, startOfWeek } from "date-fns";

/**
 * @param date
 * @returns array of dates (the week) based on the date parameter
 */
export const getWeekDatesFromDate = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // 1 for Monday as the start of the week
  const end = endOfWeek(date, { weekStartsOn: 1 });

  // [ Monday, Tuesday, ...]
  return eachDayOfInterval({ start, end });
};

/**
 * Finds the index of a given date in a list of dates.
 *
 * @param {Date[]} dates - List of dates.
 * @param {Date} targetDate - The date to find.
 * @returns {number} - The index of the target date in the dates list, or -1 if not found.
 */
export const findDateIndex = (dates: Date[], targetDate: Date): number => {
  for (let i = 0; i < dates.length; i++) {
    if (isSameDay(dates[i], targetDate)) {
      return i;
    }
  }
  return -1;
};

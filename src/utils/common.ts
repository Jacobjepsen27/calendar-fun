import { differenceInMinutes, eachDayOfInterval, endOfWeek, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { DateColumn } from "../components/BookingPageV2";

// Each cell has static height of 48px (48/60)
const MinuteToPixelFactor = 0.8;
export const getPixelHeightFromMinutes = (minutes: number) => {
    return minutes * MinuteToPixelFactor;
}

export const getTopPixels = (date: Date) => {
    const midnight = startOfDay(date);
    return getPixelHeightFromMinutes(differenceInMinutes(date, midnight));
}

export const getLeftPixels = (date: Date, dates: DateColumn[], columnWidth: number) => {
    // Need to know what each column represents to offset correctly
    const index = findDateIndex(dates.map(d => d.date), date);
    return index*columnWidth
}

// TODO: below functions are pure date-fns util functions with no business logic
/**
 * 
 * @param date 
 * @returns array of dates (the week) based on the date parameter
 */
export const getCurrentWeeks = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // 1 for Monday as the start of the week
    const end = endOfWeek(date, { weekStartsOn: 1 });
  
    // [ Monday, Tuesday, ...]
    return eachDayOfInterval({ start, end });
}

/**
 * Finds the index of a given date in a list of dates.
 *
 * @param {Date[]} dates - List of dates.
 * @param {Date} targetDate - The date to find.
 * @returns {number} - The index of the target date in the dates list, or -1 if not found.
 */
const findDateIndex = (dates: Date[], targetDate: Date): number => {
    for (let i = 0; i < dates.length; i++) {
      if (isSameDay(dates[i], targetDate)) {
        return i;
      }
    }
    return -1;
}
import { differenceInMinutes, eachDayOfInterval, endOfWeek, startOfDay, startOfWeek } from "date-fns";

// Each cell has static height of 48px (48/60)
const MinuteToPixelFactor = 0.8;
export const getPixelHeightFromMinutes = (minutes: number) => {
    return minutes * MinuteToPixelFactor;
}

export const getTopPixels = (date: Date) => {
    const midnight = startOfDay(date);
    return getPixelHeightFromMinutes(differenceInMinutes(date, midnight));
}

export const getLeftPixels = (date: Date) => {
    // Need to know what each column represents to offset correctly
    // e.g. column1 = monday, column2 = tuesday and etc.
}

/**
 * 
 * @param date 
 * @returns array of dates (the week) based on the date parameter
 */
export const getWeekDates = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // 1 for Monday as the start of the week
    const end = endOfWeek(date, { weekStartsOn: 1 });
  
    // [ Monday, Tuesday, ...]
    return eachDayOfInterval({ start, end });
}
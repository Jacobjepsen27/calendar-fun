import { differenceInMinutes, setHours, startOfDay } from "date-fns";
import { DateColumn } from "../components/BookingPage";
import { findDateIndex } from "./dates";

export const getPixelHeightFromMinutes = (minutes: number, cellHeight: number) => {
    return minutes * (cellHeight/60);
}

export const getTopPixels = (date: Date, cellHeight: number) => {
    const midnight = startOfDay(date);
    return getPixelHeightFromMinutes(differenceInMinutes(date, midnight), cellHeight);
}

export const getLeftPixels = (date: Date, dates: DateColumn[], columnWidth: number) => {
    // Need to know what each column represents to offset correctly
    const index = findDateIndex(dates.map(d => d.date), date);
    return index*columnWidth
}

/**
 * @param event 
 * @param container 
 * Returns the coordinates relative to the container provided
 */
export const getRelativeClickCoordinates = <T extends {clientX: number, clientY: number}>(event: T, container: HTMLElement): [number, number] => {
    // Mouse position relative to the viewport
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // The container's position relative to the viewport (scrolling with have effect on this value)
    const rect = container.getBoundingClientRect();

    // Calculating mouse position relative to the container
    const relativeX =
      mouseX - rect.left + container.scrollLeft;
    const relativeY =
      mouseY - rect.top + container.scrollTop;

    return [relativeX, relativeY]
}

/**
 * 
 * @param coordinates 
 * @param columnWidth 
 * @param columns 
 * @returns Date with hours set to know
 */
export const getDateFromCoordinates = (
  [mouseX,mouseY]: [number, number], 
  columnWidth: number,
   columns: DateColumn[], 
   cellHeight: number): Date => 
   {
  
// Using math floor to get integer, which can be used to index column array
const dayIndex = Math.floor(mouseX / columnWidth);
const day = columns[dayIndex];

const hour = Math.floor(mouseY / cellHeight);
return setHours(day.date, hour);
}
import { differenceInMinutes, startOfDay } from "date-fns";
import { DateColumn } from "../components/BookingPage";
import { findDateIndex } from "./dates";

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

/**
 * @param event 
 * @param container 
 * Returns the coordinates relative to the container provided
 */
export const getRelativeClickCoordinates = <T extends Element>(event: React.MouseEvent<T, MouseEvent>, container: HTMLElement): [number, number] => {
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
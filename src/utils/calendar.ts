import {
  addHours,
  differenceInMinutes,
  setMinutes,
  startOfDay,
} from "date-fns";
import { DateColumn } from "../components/BookingPage";
import { findDateIndex } from "./dates";
import PointerOrMouseEvent from "../types/PointerOrMouseEvent";
import { CalendarContext, CalendarInternals } from "../hooks/useCalendar";

export const getPixelHeightFromMinutes = (
  minutes: number,
  cellHeight: number,
) => {
  return minutes * (cellHeight / 60);
};

export const getMinutesFromPixelHeight = (
  height: number,
  cellHeight: number,
): number => {
  return height / (cellHeight / 60);
};

export const getTopPixels = (date: Date, calendarContext: CalendarContext) => {
  const earliestHour = addHours(
    startOfDay(date),
    calendarContext.config.timeRange.startHour,
  );
  return getPixelHeightFromMinutes(
    differenceInMinutes(date, earliestHour),
    calendarContext.calendarInternals.cellHeight,
  );
};

export const getLeftPixels = (
  date: Date,
  dates: DateColumn[],
  columnWidth: number,
) => {
  // Need to know what each column represents to offset correctly
  const index = findDateIndex(
    dates.map((d) => d.date),
    date,
  );
  return index * columnWidth;
};

/**
 * @param event
 * @param container
 * Returns the coordinates relative to the container provided
 */
export const getRelativeClickCoordinates = (
  event: PointerOrMouseEvent,
  cursorOffsetY: number,
  container: HTMLElement,
): [number, number] => {
  const mouseX = event.clientX;
  const mouseY = event.clientY - cursorOffsetY;

  // The container's position relative to the viewport (scrolling will have an effect on this value)
  const rect = container.getBoundingClientRect();

  // Calculating mouse position relative to the container
  let relativeX = mouseX - rect.left + window.scrollX;
  let relativeY = mouseY - rect.top + window.scrollY;

  // Clamping the values to ensure they are within the container's boundaries
  // minus 1 px to avoid hitting index 7 with math floor in 'const dayIndex = Math.floor(mouseX / columnWidth);'
  relativeX = Math.max(0, Math.min(relativeX, rect.width - 1));
  relativeY = Math.max(0, Math.min(relativeY, rect.height));
  return [relativeX, relativeY];
};

/**
 *
 * @param coordinates
 * @param columnWidth
 * @param columns
 * @returns Date with hours set to now
 */
export const getDateFromCoordinates = (
  [cursorX, cursorY]: [number, number],
  calendarContext: CalendarContext,
): Date => {
  const { columnWidth, columns, cellHeight } =
    calendarContext.calendarInternals;
  const { startHour, endHour } = calendarContext.config.timeRange;
  // Using math floor to get integer, which can be used to index column array
  const dayIndex = Math.floor(cursorX / columnWidth);
  const day = columns[dayIndex];

  let hours = Math.floor(cursorY / cellHeight);
  hours += startHour;
  if (hours === endHour) {
    hours -= 1;
  }

  const minutes = hours * 60;
  return setMinutes(day.date, minutes);
};

export const getDateFromEvent = (
  event: PointerOrMouseEvent,
  cursorOffsetY: number,
  calendarContext: CalendarContext,
): Date => {
  const { calendarRef, columnWidth, cellHeight, columns } =
    calendarContext.calendarInternals;
  // Coordinates inside container
  const [relativeX, relativeY] = getRelativeClickCoordinates(
    event,
    cursorOffsetY,
    calendarRef.current!,
  );
  // Calculate date based on those coordinates
  const date = getDateFromCoordinates([relativeX, relativeY], calendarContext);
  return date;
};

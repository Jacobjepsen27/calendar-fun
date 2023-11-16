import { add, differenceInMinutes } from "date-fns";
import PointerOrMouseEvent from "../types/PointerOrMouseEvent";
import {
  getRelativeClickCoordinates,
  getDateFromCoordinates,
  getTopPixels,
  getLeftPixels,
} from "../utils/calendar";
import { CalendarInternals } from "./useCalendarInternals";
import { CalendarEventViewModel } from "./useEvents";

const useInteractiveHandlers = (
  calendarInternals: CalendarInternals,
  viewModels: CalendarEventViewModel[],
) => {
  const { calendarRef, cellHeight, columnWidth, columns } = calendarInternals;

  // get date based on the mouse coordinates in calendar container
  const getDateFromEvent = (
    event: PointerOrMouseEvent,
    cursorOffsetY: number,
  ): Date => {
    // Coordinates inside container
    const [relativeX, relativeY] = getRelativeClickCoordinates(
      event,
      cursorOffsetY,
      calendarRef.current!,
    );
    // Calculate date based on those coordinates
    const date = getDateFromCoordinates(
      [relativeX, relativeY],
      columnWidth,
      columns,
      cellHeight,
    );
    return date;
  };

  const handleOnPan = (
    event: PointerEvent,
    cursorOffsetY: number,
  ): [number, number] => {
    const newDate = getDateFromEvent(event, cursorOffsetY);
    const topPx = getTopPixels(newDate, cellHeight);
    const leftPx = getLeftPixels(newDate, columns, columnWidth);
    return [leftPx, topPx];
  };

  const handleOnPanEnd = (
    event: PointerEvent,
    eventId: string,
    cursorOffsetY: number,
  ) => {
    const calendarEvent = viewModels.find((e) => e.id === eventId);

    if (!calendarEvent)
      throw Error(`Could not find calendarEvent with id: ${eventId}.`);

    const newDate = getDateFromEvent(event, cursorOffsetY);
    const updatedCalendarEvent: CalendarEventViewModel = {
      ...calendarEvent,
      from: newDate,
      to: add(newDate, {
        minutes: differenceInMinutes(calendarEvent.to, calendarEvent.from),
      }),
    };
    return updatedCalendarEvent;
  };

  return {
    onPan: handleOnPan,
    onPanEnd: handleOnPanEnd,
  };
};

export default useInteractiveHandlers;

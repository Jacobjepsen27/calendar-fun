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
  ): CalendarEventViewModel => {
    const calendarEvent = viewModels.find((e) => e.id === eventId);

    if (!calendarEvent)
      throw Error(`Could not find calendarEvent with id: ${eventId}.`);

    const newDate = getDateFromEvent(event, cursorOffsetY);
    return {
      ...calendarEvent,
      from: newDate,
      to: add(newDate, {
        minutes: differenceInMinutes(calendarEvent.to, calendarEvent.from),
      }),
    };
  };

  const handleResize = (eventId: string, offsetY: number) => {
    // TODO: handle min height of event (48px or snapping height)
    // TODO: handle height (or time) going beyond border - should not be possible
    const resizeHeight = Math.floor(offsetY / cellHeight);
    return resizeHeight * 48;
  };

  const handleResizeEnd = (
    eventId: string,
    resizeHeight: number,
  ): CalendarEventViewModel => {
    const calendarEvent = viewModels.find((vm) => vm.id === eventId);

    if (!calendarEvent)
      throw Error(`Could not find calendarEvent with id: ${eventId}.`);

    const minutesAdded =
      differenceInMinutes(calendarEvent.to, calendarEvent.from) +
      (resizeHeight / cellHeight) * 60;

    return {
      ...calendarEvent,
      to: add(calendarEvent.from, {
        minutes: minutesAdded,
      }),
    };
  };

  return {
    onPan: handleOnPan,
    onPanEnd: handleOnPanEnd,
    onResize: handleResize,
    onResizeEnd: handleResizeEnd,
  };
};

export default useInteractiveHandlers;

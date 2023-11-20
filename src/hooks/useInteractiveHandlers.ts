import {
  add,
  addDays,
  addMinutes,
  differenceInMinutes,
  endOfDay,
  isAfter,
  nextDay,
  startOfDay,
} from "date-fns";
import PointerOrMouseEvent from "../types/PointerOrMouseEvent";
import {
  getRelativeClickCoordinates,
  getDateFromCoordinates,
  getTopPixels,
  getLeftPixels,
  getMinutesFromPixelHeight,
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
    const calendarEvent = findViewModelOrThrow(eventId, viewModels);

    const newDate = getDateFromEvent(event, cursorOffsetY);
    return {
      ...calendarEvent,
      from: newDate,
      to: add(newDate, {
        minutes: differenceInMinutes(calendarEvent.to, calendarEvent.from),
      }),
    };
  };

  const handleResize = (eventId: string, offsetY: number): number => {
    const calendarEvent = findViewModelOrThrow(eventId, viewModels);

    // Resize height is equal the snapping interval, and since snapping is 1h intervals its [-48,0,48,96] etc.. Never in between.
    const resizeHeight = Math.ceil(offsetY / cellHeight) * cellHeight;

    // Should not be able to resize the event smaller than snapping interval
    const adjustedEventHeight = calendarEvent.height + resizeHeight;
    if (adjustedEventHeight < cellHeight) {
      if (calendarEvent.height === cellHeight) {
        return 0;
      } else {
        return calendarEvent.height * -1 + cellHeight;
      }
    }

    // Should not be possible to resize outside container
    const resizeHeightInMinutes = getMinutesFromPixelHeight(
      resizeHeight,
      cellHeight,
    );
    const newEndDate = add(calendarEvent.to, {
      minutes: resizeHeightInMinutes,
    });

    const endOfDate = startOfDay(addDays(calendarEvent.from, 1));
    if (isAfter(newEndDate, endOfDate)) {
      return 0;
    }

    return resizeHeight;
  };

  const handleResizeEnd = (
    eventId: string,
    offsetY: number,
  ): CalendarEventViewModel => {
    const calendarEvent = findViewModelOrThrow(eventId, viewModels);

    const minutesAdded =
      differenceInMinutes(calendarEvent.to, calendarEvent.from) +
      (offsetY / cellHeight) * 60;

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

const findViewModelOrThrow = (
  eventId: string,
  viewModels: CalendarEventViewModel[],
): CalendarEventViewModel => {
  const calendarEvent = viewModels.find((e) => e.id === eventId);
  if (!calendarEvent)
    throw Error(`Could not find calendarEvent with id: ${eventId}.`);
  return calendarEvent;
};

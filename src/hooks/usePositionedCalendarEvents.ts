import { differenceInMinutes } from "date-fns";
import { useState, useEffect } from "react";
import {
  getPixelHeightFromMinutes,
  getTopPixels,
  getLeftPixels,
} from "../utils/calendar";
import { CalendarInternals } from "./useCalendarInternals";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";

const usePositionedCalendarEvents = (
  calendarInternals: CalendarInternals,
  events: CalendarEvent[],
) => {
  const { calendarRef, cellHeight, columnWidth, columns } = calendarInternals;
  const [positionedCalendarEvents, setPositionedCalendarEvents] = useState<
    PositionedCalendarEvent[]
  >([]);

  useEffect(() => {
    if (calendarRef.current != null) {
      // TODO: events in date range of current columns from calendarInternals
      const viewModels: PositionedCalendarEvent[] = events.map((event) => {
        const [left, top, height, width] = calculateEventPosition(
          event,
          calendarInternals,
        );

        return {
          ...event,
          left,
          top,
          width,
          height,
          transformX: 0,
          transformY: 0,
        };
      });
      setPositionedCalendarEvents(viewModels);
    }
  }, [calendarInternals.columnWidth, calendarInternals.columns, events]);

  return positionedCalendarEvents;
};

const calculateEventPosition = (
  event: CalendarEvent,
  calendarInternals: CalendarInternals,
): [number, number, number, number] => {
  const { cellHeight, columnWidth, columns } = calendarInternals;
  const eventHeight = getPixelHeightFromMinutes(
    differenceInMinutes(event.to, event.from),
    cellHeight,
  );
  const eventWidth = columnWidth;
  const topPx = getTopPixels(event.from, cellHeight);
  const leftPx = getLeftPixels(event.from, columns, columnWidth);
  return [leftPx, topPx, eventHeight, eventWidth];
};

export default usePositionedCalendarEvents;

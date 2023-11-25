import { differenceInMinutes, startOfDay } from "date-fns";
import { useState, useEffect } from "react";
import {
  getPixelHeightFromMinutes,
  getTopPixels,
  getLeftPixels,
} from "../utils/calendar";
import { CalendarInternals } from "./useCalendarInternals";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";
import { DateColumn } from "../components/BookingPage";
import { startOfNextDay } from "../utils/dates";

const usePositionedCalendarEvents = (
  calendarInternals: CalendarInternals,
  events: CalendarEvent[],
) => {
  const { calendarRef, columns } = calendarInternals;
  const [positionedCalendarEvents, setPositionedCalendarEvents] = useState<
    PositionedCalendarEvent[]
  >([]);

  useEffect(() => {
    if (calendarRef.current != null) {
      // TODO: events in date range of current columns from calendarInternals
      const eventsInDateRange = getEventsInRange(events, columns);
      const viewModels: PositionedCalendarEvent[] = eventsInDateRange.map(
        (event) => {
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
        },
      );
      setPositionedCalendarEvents(viewModels);
    }
  }, [calendarInternals.columnWidth, calendarInternals.columns, events]);

  return positionedCalendarEvents;
};

export default usePositionedCalendarEvents;

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

function getEventsInRange(
  events: CalendarEvent[],
  columns: DateColumn[],
): CalendarEvent[] {
  let startDate: Date;
  let endDate: Date;

  // Set the startDate and endDate based on columns
  if (columns.length > 1) {
    startDate = startOfDay(columns[0].date);
    endDate = startOfNextDay(columns[columns.length - 1].date);
  } else if (columns.length === 1) {
    const date = columns[0].date;
    startDate = startOfDay(date);
    endDate = startOfNextDay(date);
  }

  // Filter events that fall within the start and end dates
  return events.filter((event) => {
    const eventDate = new Date(event.from);
    return eventDate >= startDate && eventDate < endDate;
  });
}

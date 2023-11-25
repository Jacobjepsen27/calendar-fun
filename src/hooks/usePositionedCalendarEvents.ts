import { differenceInMinutes, setHours, startOfDay } from "date-fns";
import { useState, useEffect } from "react";
import {
  getPixelHeightFromMinutes,
  getTopPixels,
  getLeftPixels,
} from "../utils/calendar";
import { CalendarInternals } from "./useCalendarInternals";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";

const usePositionedCalendarEvents = (
  events: CalendarEvent[],
  calendarInternals: CalendarInternals,
) => {
  const { calendarRef, columns } = calendarInternals;
  const [positionedCalendarEvents, setPositionedCalendarEvents] = useState<
    PositionedCalendarEvent[]
  >([]);

  useEffect(() => {
    if (calendarRef.current != null) {
      // TODO: events in date range of current columns from calendarInternals
      const eventsInDateRange = getEventsInRange(events, calendarInternals);
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
  const topPx = getTopPixels(event.from, calendarInternals);
  const leftPx = getLeftPixels(event.from, columns, columnWidth);
  return [leftPx, topPx, eventHeight, eventWidth];
};

function getEventsInRange(
  events: CalendarEvent[],
  calendarInternals: CalendarInternals,
): CalendarEvent[] {
  let startDate: Date;
  let endDate: Date;

  const startHour = calendarInternals.time.startHour;
  const endHour = calendarInternals.time.endHour;
  const columns = calendarInternals.columns;

  // Set the startDate and endDate based on columns
  if (columns.length > 1) {
    startDate = setHours(columns[0].date, startHour);
    endDate = setHours(columns[columns.length - 1].date, endHour);
  } else if (columns.length === 1) {
    const date = columns[0].date;
    startDate = setHours(date, startHour);
    endDate = setHours(date, endHour);
  } else {
    throw Error("No columns available");
  }

  // Filter events that fall within the start and end dates and time range set in config
  return events.filter((event) => {
    const eventStartDate = new Date(event.from);
    const eventEndDate = new Date(event.to);
    if (eventStartDate >= startDate && eventEndDate < endDate) {
      if (
        eventStartDate.getHours() >= startHour &&
        eventEndDate.getHours() <= endHour
      ) {
        return true;
      } else {
        console.warn(
          `Event with id: ${event.id} excluded because it was outside of time range`,
        );
      }
    }
    return (
      eventStartDate >= startDate &&
      eventEndDate < endDate &&
      eventStartDate.getHours() >= startHour &&
      eventEndDate.getHours() <= endHour
    );
  });
}

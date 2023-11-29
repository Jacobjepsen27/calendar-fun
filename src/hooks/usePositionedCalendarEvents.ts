import { differenceInMinutes, setHours } from "date-fns";
import { useState, useEffect } from "react";
import {
  getPixelHeightFromMinutes,
  getTopPixels,
  getLeftPixels,
} from "../utils/calendar";
import { CalendarContext } from "./useCalendar";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";

const usePositionedCalendarEvents = (calendarContext: CalendarContext) => {
  const { calendarInternals, events, config } = calendarContext;
  const [positionedCalendarEvents, setPositionedCalendarEvents] = useState<
    PositionedCalendarEvent[]
  >([]);

  useEffect(() => {
    if (calendarInternals.calendarRef.current != null) {
      const eventsInDateRange = getEventsInRange(events, calendarContext);
      const viewModels: PositionedCalendarEvent[] = eventsInDateRange.map(
        (event) => {
          const [left, top, height, width] = calculateEventPosition(
            event,
            calendarContext,
          );

          return {
            ...event,
            left,
            top,
            width,
            height,
            isReadonly: config.isEventReadonly(event, calendarContext),
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
  calendarContext: CalendarContext,
): [number, number, number, number] => {
  const { cellHeight, columnWidth, columns } =
    calendarContext.calendarInternals;
  const eventHeight = getPixelHeightFromMinutes(
    differenceInMinutes(event.to, event.from),
    cellHeight,
  );
  const eventWidth = columnWidth;
  const topPx = getTopPixels(event.from, calendarContext);
  const leftPx = getLeftPixels(event.from, columns, columnWidth);
  return [leftPx, topPx, eventHeight, eventWidth];
};

function getEventsInRange(
  events: CalendarEvent[],
  calendarContext: CalendarContext,
): CalendarEvent[] {
  let startDate: Date;
  let endDate: Date;

  const startHour = calendarContext.config.timeRange.startHour;
  const endHour = calendarContext.config.timeRange.endHour;
  const columns = calendarContext.calendarInternals.columns;

  // Set the startDate and endDate based on columns
  switch (calendarContext.calendarControls.state.view) {
    case "WEEK":
      startDate = setHours(columns[0].date, startHour);
      endDate = setHours(columns[columns.length - 1].date, endHour);
      break;
    case "DAY":
      const date = columns[0].date;
      startDate = setHours(date, startHour);
      endDate = setHours(date, endHour);
      break;
    default:
      throw Error("No columns available");
  }

  // Filter events that fall within the start and end dates and time range set in config
  return events.filter((event) => {
    const eventStartDate = new Date(event.from);
    const eventEndDate = new Date(event.to);
    if (eventStartDate >= startDate && eventEndDate <= endDate) {
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

import { differenceInMinutes } from "date-fns";
import { useState, useEffect } from "react";
import {
  getPixelHeightFromMinutes,
  getTopPixels,
  getLeftPixels,
} from "../utils/calendar";
import { CalendarInternals } from "./useCalendarInternals";
import { CalendarEvent, CalendarEventViewModel } from "../models/models";

const useViewModels = (
  calendarInternals: CalendarInternals,
  events: CalendarEvent[],
) => {
  const { calendarRef, cellHeight, columnWidth, columns } = calendarInternals;
  const [viewModels, setViewModels] = useState<CalendarEventViewModel[]>([]);

  // Create viewmodels
  useEffect(() => {
    if (calendarRef.current != null) {
      const calculateEventPosition = (
        event: CalendarEvent,
      ): [number, number, number, number] => {
        const eventHeight = getPixelHeightFromMinutes(
          differenceInMinutes(event.to, event.from),
          cellHeight,
        );
        const eventWidth = columnWidth;
        const topPx = getTopPixels(event.from, cellHeight);
        const leftPx = getLeftPixels(event.from, columns, columnWidth);
        return [leftPx, topPx, eventHeight, eventWidth];
      };
      const viewModels: CalendarEventViewModel[] = events.map((event) => {
        const [left, top, height, width] = calculateEventPosition(event);

        return {
          ...event,
          left,
          top,
          width,
          height,
        };
      });
      setViewModels(viewModels);
    }
  }, [columns, columnWidth, cellHeight, events]);

  return { viewModels };
};

export default useViewModels;

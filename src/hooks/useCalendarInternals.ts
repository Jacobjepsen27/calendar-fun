import { useRef, useState, useMemo, MutableRefObject } from "react";
import { DateColumn } from "../components/BookingPage";

import { getWeekDatesFromDate } from "../utils/dates";
import PointerOrMouseEvent from "../types/PointerOrMouseEvent";
import {
  getRelativeClickCoordinates,
  getDateFromCoordinates,
} from "../utils/calendar";
import { CalendarConfig } from "../components/Calendar";
import { arrayFromNumber } from "../utils/array";

export type CalendarInternals = ReturnType<typeof useCalendarInternals>;

const useCalendarInternals = (config: CalendarConfig) => {
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const timeRange = useMemo(() => {
    const availableHours =
      config.timeRange.endHour - config.timeRange.startHour;
    return arrayFromNumber(availableHours).map(
      (i) => i + config.timeRange.startHour,
    );
  }, [config]);

  const [cellHeight] = useState(48);

  const [columns] = useState<DateColumn[]>(() => {
    const weeks = getWeekDatesFromDate(new Date());
    return weeks.map((date, index) => ({ index, date }));
  });

  const columnWidth = useMemo(() => {
    if (calendarRef.current == null) return 1;
    return calendarRef.current.getBoundingClientRect().width / columns.length;
  }, [columns, calendarRef.current]);

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
      config.timeRange.startHour,
      config.timeRange.endHour,
    );
    return date;
  };

  return {
    calendarRef,
    scrollRef,
    columns,
    columnWidth,
    cellHeight,
    getDateFromEvent,
    time: {
      timeRange,
      startHour: config.timeRange.startHour,
      endHour: config.timeRange.endHour,
    },
  };
};

export default useCalendarInternals;

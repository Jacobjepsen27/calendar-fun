import { useRef, useState, useMemo, MutableRefObject } from "react";
import { DateColumn } from "../components/BookingPage";

import { getWeekDatesFromDate } from "../utils/dates";
import PointerOrMouseEvent from "../types/PointerOrMouseEvent";
import {
  getRelativeClickCoordinates,
  getDateFromCoordinates,
} from "../utils/calendar";

export type CalendarInternals = {
  calendarRef: MutableRefObject<HTMLDivElement | null>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  columns: DateColumn[];
  columnWidth: number;
  cellHeight: number;
  getDateFromEvent: (event: PointerOrMouseEvent, cursorOffsetY: number) => Date;
};

const useCalendarInternals = (): CalendarInternals => {
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
  };
};

export default useCalendarInternals;

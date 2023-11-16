import { useRef, useState, useMemo, MutableRefObject } from "react";
import { DateColumn } from "../components/BookingPage";

import { getWeekDatesFromDate } from "../utils/dates";

export type CalendarInternals = {
  calendarRef: MutableRefObject<HTMLDivElement | null>;
  columns: DateColumn[];
  columnWidth: number;
  cellHeight: number;
};

const useCalendarInternals = (): CalendarInternals => {
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const [cellHeight] = useState(48);

  const [columns] = useState<DateColumn[]>(() => {
    const weeks = getWeekDatesFromDate(new Date());
    return weeks.map((date, index) => ({ index, date }));
  });

  const columnWidth = useMemo(() => {
    if (calendarRef.current == null) return 1;
    return calendarRef.current.getBoundingClientRect().width / columns.length;
  }, [columns, calendarRef.current]);

  return {
    calendarRef,
    columns,
    columnWidth,
    cellHeight,
  };
};

export default useCalendarInternals;

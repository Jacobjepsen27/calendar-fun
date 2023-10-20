import { useRef, useState, useMemo } from "react";
import { DateColumn } from "../components/BookingPage";
import { getCurrentWeeks } from "../utils/dates";
import {
  getDateFromCoordinates,
  getRelativeClickCoordinates,
} from "../utils/calendar";
import PointerOrMouseEvent from "../types/PointerOrMouseEvent";

const cellHeight = 48; //px
const useCalendar = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [columns, _] = useState<DateColumn[]>(() => {
    const weeks = getCurrentWeeks(new Date());
    return weeks.map((date, index) => ({ index, date }));
  });

  const columnWidth = useMemo(() => {
    if (containerRef.current == null) return 1;
    return containerRef.current.getBoundingClientRect().width / columns.length;
  }, [columns, containerRef.current]);

  /**
   * @param event
   * @returns date based on the mouse coordinates in calendar container
   */
  const getDateFromEvent = (
    event: PointerOrMouseEvent,
    cursorOffsetY: number,
  ): Date => {
    const [relativeX, relativeY] = getRelativeClickCoordinates(
      event,
      cursorOffsetY,
      containerRef.current!,
    );
    const date = getDateFromCoordinates(
      [relativeX, relativeY],
      columnWidth,
      columns,
      cellHeight,
    );
    return date;
  };

  return {
    ref: containerRef,
    columns,
    columnWidth,
    cellHeight,
    getDateFromEvent,
  };
};

export default useCalendar;

import { useRef, useState, useMemo } from "react";
import { DateColumn } from "../components/BookingPage";
import { getCurrentWeeks } from "../utils/dates";
import { getDateFromCoordinates, getRelativeClickCoordinates } from "../utils/calendar";

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
  
    const cellHeight = 48; //px

    const getDateFromEvent = <T extends {clientX: number, clientY: number}>(event: T): Date => {
        const [relativeX, relativeY] = getRelativeClickCoordinates(
            event,
            containerRef.current!,
          );
          const date = getDateFromCoordinates(
            [relativeX, relativeY],
            columnWidth,
            columns,
            cellHeight,
          );
          return date;
    }
  
    return {
      ref: containerRef,
      columns,
      columnWidth,
      cellHeight,
      getDateFromEvent
    };
  };

  export default useCalendar;
import { useRef, useState, useMemo } from "react";

import { getWeekDatesFromDate } from "../utils/dates";
import PointerOrMouseEvent from "../types/PointerOrMouseEvent";
import {
  getRelativeClickCoordinates,
  getDateFromCoordinates,
} from "../utils/calendar";
import { arrayFromNumber } from "../utils/array";
import { CalendarControlState } from "./useCalendarControls";
import { useWindowSize } from "usehooks-ts";

export type CalendarConfig = {
  timeRange: {
    startHour: number;
    endHour: number;
  };
};

export const defaultConfig: CalendarConfig = {
  timeRange: {
    startHour: 0,
    endHour: 24,
  },
};

export type CalendarInternals = ReturnType<typeof useCalendarInternals>;

const useCalendarInternals = (
  providedConfig: CalendarConfig,
  calendarControlState: CalendarControlState,
) => {
  const windowSize = useWindowSize();
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [cellHeight] = useState(48);
  const [config] = useState(providedConfig);

  // one time change, can be done in useEffect but should save config in useState to avoid rerenders happening
  const timeRange = useMemo(() => {
    const availableHours =
      config.timeRange.endHour - config.timeRange.startHour;
    return arrayFromNumber(availableHours).map(
      (i) => i + config.timeRange.startHour,
    );
  }, [config]);

  const columns = useMemo(() => {
    switch (calendarControlState.view) {
      case "WEEK":
        const weeks = getWeekDatesFromDate(calendarControlState.date);
        return weeks.map((date, index) => ({ index, date }));
      case "DAY":
        return [{ index: 0, date: calendarControlState.date }];
    }
  }, [calendarControlState]);

  const columnWidth = useMemo(() => {
    if (calendarRef.current == null) return 1;
    return calendarRef.current.getBoundingClientRect().width / columns.length;
  }, [columns, calendarRef.current, windowSize]);

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
    columnWidth,
    cellHeight,
    getDateFromEvent,
    columns,
    time: {
      timeRange,
      startHour: config.timeRange.startHour,
      endHour: config.timeRange.endHour,
    },
  };
};

export default useCalendarInternals;

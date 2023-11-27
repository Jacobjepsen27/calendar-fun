import { useRef, useState, useMemo } from "react";
import { getWeekDatesFromDate } from "../utils/dates";
import { arrayFromNumber } from "../utils/array";
import { CalendarControlState } from "./useCalendarControls";
import { useWindowSize } from "usehooks-ts";

export type CalendarConfig = {
  timeRange: {
    startHour: number;
    endHour: number;
  };
  // Max and min event length
  // Editable: (event: CalendarEvent) => boolean
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

  return {
    calendarRef,
    scrollRef,
    columnWidth,
    cellHeight,
    columns,
    time: {
      timeRange,
      startHour: config.timeRange.startHour,
      endHour: config.timeRange.endHour,
    },
  };
};

export default useCalendarInternals;

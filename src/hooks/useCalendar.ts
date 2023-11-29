import { useRef, useState, useMemo, useEffect } from "react";
import { getWeekDatesFromDate } from "../utils/dates";
import { arrayFromNumber } from "../utils/array";
import { useCalendarControls } from "./useCalendarControls";
import { useWindowSize } from "usehooks-ts";
import { CalendarEvent } from "../models/models";

export type CalendarConfig = {
  timeRange: {
    startHour: number;
    endHour: number;
  };
  isEventReadonly: (event: CalendarEvent, context: CalendarContext) => boolean;
  validators: Array<
    (event: CalendarEvent, context: CalendarContext) => boolean
  >;
};

export const defaultConfig: CalendarConfig = {
  timeRange: {
    startHour: 0,
    endHour: 24,
  },
  isEventReadonly: () => false,
  validators: [],
};

export type CalendarInternals = CalendarContext["calendarInternals"];
export type CalendarContext = ReturnType<typeof useCalendar>;

const useCalendar = (
  providedConfig: CalendarConfig,
  providedEvents: CalendarEvent[],
) => {
  const calendarControls = useCalendarControls();
  const windowSize = useWindowSize();
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [cellHeight] = useState(48);
  const [config] = useState(providedConfig);
  const [events, setEvents] = useState(providedEvents);

  useEffect(() => {
    setEvents(events);
  }, [providedEvents]);

  const timeRange = useMemo(() => {
    const availableHours =
      config.timeRange.endHour - config.timeRange.startHour;
    return arrayFromNumber(availableHours).map(
      (i) => i + config.timeRange.startHour,
    );
  }, [config]);

  const columns = useMemo(() => {
    switch (calendarControls.state.view) {
      case "WEEK":
        const weeks = getWeekDatesFromDate(calendarControls.state.date);
        return weeks.map((date, index) => ({ index, date }));
      case "DAY":
        return [{ index: 0, date: calendarControls.state.date }];
    }
  }, [calendarControls.state]);

  const columnWidth = useMemo(() => {
    if (calendarRef.current == null) return 1;
    return calendarRef.current.getBoundingClientRect().width / columns.length;
  }, [columns, calendarRef.current, windowSize]);

  return {
    // Customizations from user
    config,
    // Calendars visual state (WEEK or DAY and current date)
    calendarControls,
    // Internals used for calculating positions, visuals etc.
    calendarInternals: {
      calendarRef,
      scrollRef,
      columnWidth,
      cellHeight,
      columns,
      timeRange,
    },
    events,
  };
};

export default useCalendar;

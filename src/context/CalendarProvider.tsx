import {
  MouseEventHandler,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CalendarEvent, CalendarEventViewModel } from "../hooks/useEvents";
import { differenceInMinutes, add } from "date-fns";
import { DateColumn } from "../components/BookingPage";
import {
  getPixelHeightFromMinutes,
  getTopPixels,
  getLeftPixels,
  getRelativeClickCoordinates,
  getDateFromCoordinates,
} from "../utils/calendar";
import { getWeekDatesFromDate } from "../utils/dates";
import PointerOrMouseEvent from "../types/PointerOrMouseEvent";

const cellHeight = 48; // px

type CalendarContextValue = {
  ref: React.MutableRefObject<HTMLDivElement | null>;
  eventViewModels: CalendarEventViewModel[];
  updateEvent: (event: CalendarEvent) => void;
  onCalendarClick: MouseEventHandler;
  onPan: (event: PointerEvent, cursorOffsetY: number) => [number, number];
  onPanEnd: (
    event: PointerEvent,
    eventId: string,
    cursorOffsetY: number,
  ) => void;
  columns: DateColumn[];
};

type CalendarProviderProps = {
  eventsData: CalendarEvent[];
  updateEvent: (event: CalendarEvent) => void;
} & PropsWithChildren;

const CalendarContext = createContext<CalendarContextValue>(
  {} as CalendarContextValue,
);

export const useCalendarContext = (): CalendarContextValue => {
  const context = useContext(CalendarContext);
  if (context == null) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider",
    );
  }
  return context;
};

const CalendarProvider = ({
  children,
  eventsData,
  updateEvent,
}: CalendarProviderProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [columns, _] = useState<DateColumn[]>(() => {
    const weeks = getWeekDatesFromDate(new Date());
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
    // Coordinates inside container
    const [relativeX, relativeY] = getRelativeClickCoordinates(
      event,
      cursorOffsetY,
      containerRef.current!,
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

  // Set received events from api internally
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    setEvents(eventsData);
  }, [eventsData]);

  const [eventViewModels, setEventViewModels] = useState<
    CalendarEventViewModel[]
  >([]);

  // Create viewmodels
  useEffect(() => {
    if (containerRef.current != null) {
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
      setEventViewModels(viewModels);
    }
  }, [columns, columnWidth, cellHeight, events]);

  const onCalendarClick: React.MouseEventHandler = (event) => {
    const newDate = getDateFromEvent(event, 0);
    console.log("newDate: ", newDate);
  };

  const handleUpdateEvent = (event: CalendarEvent) => {
    // Update something internally?
    updateEvent(event);
  };

  const handleOnPan = (
    event: PointerEvent,
    cursorOffsetY: number,
  ): [number, number] => {
    const newDate = getDateFromEvent(event, cursorOffsetY);
    const topPx = getTopPixels(newDate, cellHeight);
    const leftPx = getLeftPixels(newDate, columns, columnWidth);
    return [leftPx, topPx];
  };

  const handleOnPanEnd = (
    event: PointerEvent,
    eventId: string,
    cursorOffsetY: number,
  ) => {
    const calendarEvent = events.find((e) => e.id === eventId);
    if (calendarEvent) {
      const newDate = getDateFromEvent(event, cursorOffsetY);
      const updatedCalendarEvent: CalendarEvent = {
        ...calendarEvent,
        from: newDate,
        to: add(newDate, {
          minutes: differenceInMinutes(calendarEvent.to, calendarEvent.from),
        }),
      };
      updateEvent(updatedCalendarEvent);
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        eventViewModels,
        ref: containerRef,
        updateEvent: handleUpdateEvent,
        onCalendarClick,
        onPan: handleOnPan,
        onPanEnd: handleOnPanEnd,
        columns,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;

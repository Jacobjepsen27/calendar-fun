import {
  add,
  addDays,
  differenceInMinutes,
  isAfter,
  startOfDay,
  subMinutes,
} from "date-fns";
import PointerOrMouseEvent from "../types/PointerOrMouseEvent";
import {
  getTopPixels,
  getLeftPixels,
  getMinutesFromPixelHeight,
} from "../utils/calendar";
import { CalendarInternals } from "./useCalendarInternals";
import { CalendarEventViewModel } from "./useEvents";

// TODO: move validate functions somewhere better
const validatePan = (
  cursorPositionDate: Date,
  vm: CalendarEventViewModel,
): Date => {
  const eventMinuteRange = differenceInMinutes(vm.to, vm.from);

  const dateMinusMinuteRange = subMinutes(
    startOfDay(addDays(cursorPositionDate, 1)),
    eventMinuteRange,
  );

  return new Date(
    Math.min(cursorPositionDate.getTime(), dateMinusMinuteRange.getTime()),
  );
};

// TODO: move validate functions somewhere better
const validateResize = (
  resizeHeightPx: number,
  vm: CalendarEventViewModel,
  cellHeight: number,
) => {
  const adjustedEventHeight = vm.height + resizeHeightPx;
  if (adjustedEventHeight < cellHeight) {
    if (vm.height === cellHeight) {
      return 0;
    } else {
      return vm.height * -1 + cellHeight;
    }
  }

  // Should not be possible to resize outside container
  const resizeHeightInMinutes = getMinutesFromPixelHeight(
    resizeHeightPx,
    cellHeight,
  );
  const newEndDate = add(vm.to, {
    minutes: resizeHeightInMinutes,
  });

  const endOfDate = startOfDay(addDays(vm.from, 1));
  if (isAfter(newEndDate, endOfDate)) {
    return 0;
  }

  return resizeHeightPx;
};

const useInteractiveHandlers = (
  calendarInternals: CalendarInternals,
  viewModels: CalendarEventViewModel[],
) => {
  const { scrollRef, cellHeight, columnWidth, columns, getDateFromEvent } =
    calendarInternals;

  const handleCalendarClick = (event: PointerOrMouseEvent): Date => {
    return getDateFromEvent(event, 0);
  };

  const handleOnPan = (
    eventId: string,
    event: PointerOrMouseEvent,
    cursorOffsetY: number,
  ): [number, number] => {
    const vm = findViewModelOrThrow(eventId, viewModels);

    const cursorPositionDate = getDateFromEvent(event, cursorOffsetY);
    const newDate = validatePan(cursorPositionDate, vm);

    const topPx = getTopPixels(newDate, cellHeight);
    const leftPx = getLeftPixels(newDate, columns, columnWidth);

    handleAutoScroll(event);
    return [leftPx, topPx];
  };

  const handleOnPanEnd = (
    eventId: string,
    event: PointerOrMouseEvent,
    cursorOffsetY: number,
  ): CalendarEventViewModel => {
    const vm = findViewModelOrThrow(eventId, viewModels);

    const cursorPositionDate = getDateFromEvent(event, cursorOffsetY);
    const newDate = validatePan(cursorPositionDate, vm);
    return {
      ...vm,
      from: newDate,
      to: add(newDate, {
        minutes: differenceInMinutes(vm.to, vm.from),
      }),
    };
  };

  const handleResize = (eventId: string, offsetY: number): number => {
    const vm = findViewModelOrThrow(eventId, viewModels);

    // Resize height is equal the snapping interval, and since snapping is 1h intervals its [-48,0,48,96] etc.. Never in between.
    const currentResizeHeightPx = Math.ceil(offsetY / cellHeight) * cellHeight;

    const resizeHeightPx = validateResize(
      currentResizeHeightPx,
      vm,
      cellHeight,
    );

    return resizeHeightPx;
  };

  const handleResizeEnd = (
    eventId: string,
    offsetY: number,
  ): CalendarEventViewModel => {
    const vm = findViewModelOrThrow(eventId, viewModels);

    // Resize height is equal the snapping interval, and since snapping is 1h intervals its [-48,0,48,96] etc.. Never in between.
    const currentResizeHeightPx = Math.ceil(offsetY / cellHeight) * cellHeight;

    const resizeHeightPx = validateResize(
      currentResizeHeightPx,
      vm,
      cellHeight,
    );

    const minutesAdded =
      differenceInMinutes(vm.to, vm.from) + (resizeHeightPx / cellHeight) * 60;

    return {
      ...vm,
      to: add(vm.from, {
        minutes: minutesAdded,
      }),
    };
  };

  const handleAutoScroll = (event: PointerOrMouseEvent): void => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let containerRect = scrollContainer.getBoundingClientRect();
    let bottom = containerRect.bottom;
    let top = containerRect.top;

    let threshold = 48; // Distance from the edge to start scrolling
    const mouseY = event.clientY;

    // Check if near bottom and start scrolling
    if (mouseY > bottom - threshold) {
      scrollContainer.scrollTop += 4;
    }
    // Check if near top and start scrolling
    else if (mouseY < top + threshold) {
      scrollContainer.scrollTop -= 4;
    }
  };

  return {
    onPan: handleOnPan,
    onPanEnd: handleOnPanEnd,
    onResize: handleResize,
    onResizeEnd: handleResizeEnd,
    onCalendarClick: handleCalendarClick,
  };
};

export default useInteractiveHandlers;

const findViewModelOrThrow = (
  eventId: string,
  viewModels: CalendarEventViewModel[],
): CalendarEventViewModel => {
  const calendarEvent = viewModels.find((e) => e.id === eventId);
  if (!calendarEvent)
    throw Error(`Could not find calendarEvent with id: ${eventId}.`);
  return calendarEvent;
};

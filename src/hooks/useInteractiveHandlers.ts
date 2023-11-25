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
import { PositionedCalendarEvent } from "../models/models";
import { startOfNextDay } from "../utils/dates";

export type EditEvent = {
  positionedCalendarEvent: PositionedCalendarEvent;
  event: PointerOrMouseEvent;
  cursorOffsetY: number;
};

const useInteractiveHandlers = (calendarInternals: CalendarInternals) => {
  const { scrollRef, cellHeight, columnWidth, columns, getDateFromEvent } =
    calendarInternals;

  const handleOnPan = (editEvent: EditEvent): PositionedCalendarEvent => {
    const { positionedCalendarEvent, event, cursorOffsetY } = editEvent;
    const cursorPositionDate = getDateFromEvent(event, cursorOffsetY);
    const newDate = validatePan(cursorPositionDate, positionedCalendarEvent);

    const topPx = getTopPixels(newDate, cellHeight);
    const leftPx = getLeftPixels(newDate, columns, columnWidth);

    handleAutoScroll(event);
    return {
      ...positionedCalendarEvent,
      from: newDate,
      to: add(newDate, {
        minutes: differenceInMinutes(
          positionedCalendarEvent.to,
          positionedCalendarEvent.from,
        ),
      }),
      transformX: leftPx - positionedCalendarEvent.left,
      transformY: topPx - positionedCalendarEvent.top,
    };
  };

  const handleResize = (editEvent: EditEvent): PositionedCalendarEvent => {
    const { positionedCalendarEvent, cursorOffsetY } = editEvent;

    // Resize height is equal the snapping interval, and since snapping is 1h intervals its [-48,0,48,96] etc.. Never in between.
    const currentResizeHeightPx =
      Math.ceil(cursorOffsetY / cellHeight) * cellHeight;

    const resizeHeightPx = validateResize(
      currentResizeHeightPx,
      positionedCalendarEvent,
      cellHeight,
    );

    const minutesAdded =
      differenceInMinutes(
        positionedCalendarEvent.to,
        positionedCalendarEvent.from,
      ) +
      (resizeHeightPx / cellHeight) * 60;

    return {
      ...positionedCalendarEvent,
      height: positionedCalendarEvent.height + resizeHeightPx,
      to: add(positionedCalendarEvent.from, {
        minutes: minutesAdded,
      }),
    };
    // return resizeHeightPx;
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
    handleOnPan,
    handleResize,
  };
};

export default useInteractiveHandlers;

// TODO: move validate functions somewhere better
const validatePan = (
  cursorPositionDate: Date,
  positionedCalendarEvent: PositionedCalendarEvent,
): Date => {
  const eventMinuteRange = differenceInMinutes(
    positionedCalendarEvent.to,
    positionedCalendarEvent.from,
  );

  const dateMinusMinuteRange = subMinutes(
    startOfNextDay(cursorPositionDate),
    eventMinuteRange,
  );

  return new Date(
    Math.min(cursorPositionDate.getTime(), dateMinusMinuteRange.getTime()),
  );
};

// TODO: move validate functions somewhere better
const validateResize = (
  resizeHeightPx: number,
  positionedCalendarEvent: PositionedCalendarEvent,
  cellHeight: number,
) => {
  const adjustedEventHeight = positionedCalendarEvent.height + resizeHeightPx;
  if (adjustedEventHeight < cellHeight) {
    if (positionedCalendarEvent.height === cellHeight) {
      return 0;
    } else {
      return positionedCalendarEvent.height * -1 + cellHeight;
    }
  }

  // Should not be possible to resize outside container
  const resizeHeightInMinutes = getMinutesFromPixelHeight(
    resizeHeightPx,
    cellHeight,
  );
  const newEndDate = add(positionedCalendarEvent.to, {
    minutes: resizeHeightInMinutes,
  });

  const endOfDate = startOfDay(addDays(positionedCalendarEvent.from, 1));
  if (isAfter(newEndDate, endOfDate)) {
    return 0;
  }

  return resizeHeightPx;
};

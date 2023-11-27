import { PanInfo, motion } from "framer-motion";
import { useRef, useState, CSSProperties, useLayoutEffect } from "react";
import CalendarEvent from "./CalendarEventUI";
import { PositionedCalendarEvent } from "../models/models";
import { CalendarInternals } from "../hooks/useCalendarInternals";
import useInteractiveHandlers, {
  EditEvent,
} from "../hooks/useInteractiveHandlers";

type CalendarEventPositionedProps = {
  positionedCalendarEvent: PositionedCalendarEvent;
  calendarInternals: CalendarInternals;
  onEventChange: (positionedCalendarEvent: PositionedCalendarEvent) => void;
};
const CalendarEventPositioned = ({
  positionedCalendarEvent,
  calendarInternals,
  onEventChange,
}: CalendarEventPositionedProps) => {
  const { handleOnPan: onPan, handleResize: onResize } =
    useInteractiveHandlers(calendarInternals);
  const eventRef = useRef<HTMLDivElement | null>(null);
  // Used to disable click event when dragging
  const mouseMovingRef = useRef(false);
  // Offset of where the true y coordinate is withtin the moving event (to avoid unintentional snapping)
  const cursorOffsetYRef = useRef(0);

  const [updatedPositionedCalendarEvent, setUpdatedPositionedCalendarEvent] =
    useState(positionedCalendarEvent);
  useLayoutEffect(() => {
    setUpdatedPositionedCalendarEvent(positionedCalendarEvent);
  }, [positionedCalendarEvent]);

  const handlePanSessionStart = (_: PointerEvent, info: PanInfo) => {
    const cursorOffsetY =
      info.point.y -
      (eventRef.current?.getBoundingClientRect().top ?? info.point.y);
    cursorOffsetYRef.current = cursorOffsetY;
  };

  const handleOnPanStart = (_: PointerEvent) => {
    mouseMovingRef.current = true;
  };

  const handleOnPan = (event: PointerEvent) => {
    const editEvent: EditEvent = {
      positionedCalendarEvent,
      event,
      cursorOffsetY: cursorOffsetYRef.current,
    };
    const updatedPositionedCalendarEvent = onPan(editEvent);
    setUpdatedPositionedCalendarEvent(updatedPositionedCalendarEvent);
  };

  const handleOnPanEnd = (event: PointerEvent) => {
    event.stopPropagation();
    const editEvent: EditEvent = {
      positionedCalendarEvent,
      event,
      cursorOffsetY: cursorOffsetYRef.current,
    };
    const updatedPositionedCalendarEvent = onPan(editEvent);
    onEventChange(updatedPositionedCalendarEvent);
    mouseMovingRef.current = false;
    cursorOffsetYRef.current = 0;
  };

  const handleResize = (event: PointerEvent, info: PanInfo) => {
    const editEvent: EditEvent = {
      positionedCalendarEvent,
      event,
      cursorOffsetY: info.offset.y,
    };
    const updatePositionedCalendarEvent = onResize(editEvent);
    setUpdatedPositionedCalendarEvent(updatePositionedCalendarEvent);
  };

  const handleResizeEnd = (event: PointerEvent, info: PanInfo) => {
    event.stopPropagation();
    const editEvent: EditEvent = {
      positionedCalendarEvent,
      event,
      cursorOffsetY: info.offset.y,
    };
    const updatedPositionedCalendarEvent = onResize(editEvent);
    onEventChange(updatedPositionedCalendarEvent);
    mouseMovingRef.current = false;
  };

  const dynamicButtonStyles: CSSProperties = mouseMovingRef.current
    ? {
        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        cursor: "move",
      }
    : {};

  const dynamicMotionDivStyles: CSSProperties = {
    left: updatedPositionedCalendarEvent.left,
    top: updatedPositionedCalendarEvent.top,
    height: updatedPositionedCalendarEvent.height,
    width: mouseMovingRef.current
      ? updatedPositionedCalendarEvent.width
      : updatedPositionedCalendarEvent.width - 12,
    transform: `translate(${updatedPositionedCalendarEvent.transformX}px,${updatedPositionedCalendarEvent.transformY}px)`,
    touchAction: "none",
    zIndex: mouseMovingRef.current ? 2 : 1,
  };

  return (
    <div
      className="absolute overflow-hidden rounded-md"
      style={dynamicMotionDivStyles}
    >
      <motion.div
        ref={eventRef}
        className="h-full"
        onPanSessionStart={handlePanSessionStart}
        onPanStart={handleOnPanStart}
        onPan={handleOnPan}
        onPanEnd={handleOnPanEnd}
      >
        <button
          style={dynamicButtonStyles}
          className="h-full w-full bg-sky-300"
          onClick={(e) => {
            // Stop event from propagating to avoid the calendars click listener to be triggered
            e.stopPropagation();
            // Don't trigger this click event in case we are dragging
            if (!mouseMovingRef.current) {
              console.log("clicked event ", positionedCalendarEvent.id);
            }
          }}
        >
          <CalendarEvent event={updatedPositionedCalendarEvent} />
        </button>
      </motion.div>
      <motion.button
        className="absolute bottom-0 left-0 right-0 h-[10px] w-full cursor-ns-resize"
        onPanStart={handleOnPanStart}
        onPan={handleResize}
        onPanEnd={handleResizeEnd}
        onClick={(e) => {
          e.stopPropagation();
          console.log("resize clicked");
        }}
      ></motion.button>
    </div>
  );
};

export default CalendarEventPositioned;

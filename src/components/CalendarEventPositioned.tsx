import { PanInfo, motion } from "framer-motion";
import { CalendarEventViewModel } from "../hooks/useEvents";
import { useRef, useState, useLayoutEffect, CSSProperties } from "react";
import CalendarEvent from "./CalendarEvent";
import PointerOrMouseEvent from "../types/PointerOrMouseEvent";

const getCursorOffsetY = (
  event: PointerOrMouseEvent,
  containerRect: DOMRect,
): number => {
  return event.clientY - containerRect.top;
};

type CalendarEventPositionedProps = {
  eventViewModel: CalendarEventViewModel;
  onPan: (event: PointerEvent, cursorOffsetY: number) => [number, number];
  onPanEnd: (
    event: PointerEvent,
    eventId: string,
    cursorOffsetY: number,
  ) => void;
};
const CalendarEventPositioned = (props: CalendarEventPositionedProps) => {
  const { eventViewModel: vm, onPan, onPanEnd } = props;
  const eventRef = useRef<HTMLDivElement | null>(null);
  // Used to disable click event when dragging
  const mouseMovingRef = useRef(false);
  // Offset of where the true y coordiante is (to avoid unintentional snapping)
  const cursorYOffset = useRef(0);

  const [eventOffset, setEventOffset] = useState<[number, number]>([0, 0]);

  useLayoutEffect(() => {
    setEventOffset([0, 0]);
  }, [vm.left, vm.top]);

  const onMouseDown = (event: React.MouseEvent) => {
    const cursorOffsetY = getCursorOffsetY(
      event as unknown as PointerEvent,
      eventRef.current!.getBoundingClientRect(),
    );
    cursorYOffset.current = cursorOffsetY;
  };

  const handleOnPanStart = (event: PointerEvent) => {
    mouseMovingRef.current = true;
  };

  const handleOnPan = (event: PointerEvent, info: PanInfo) => {
    const [x, y] = onPan(event, cursorYOffset.current);
    const offsetX = x - vm.left;
    const offsetY = y - vm.top;
    setEventOffset([offsetX, offsetY]);
  };

  const handleOnPanEnd = (event: PointerEvent) => {
    event.stopPropagation();
    onPanEnd(event, vm.id, cursorYOffset.current);
    mouseMovingRef.current = false;
    cursorYOffset.current = 0;
  };

  const dynamicButtonStyles: CSSProperties = mouseMovingRef.current
    ? {
        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        cursor: "move",
      }
    : {};

  const dynamicMotionDivStyles: CSSProperties = {
    left: vm.left,
    top: vm.top,
    height: vm.height,
    width: mouseMovingRef.current ? vm.width : vm.width - 12,
    transform: `translate(${eventOffset[0]}px,${eventOffset[1]}px)`,
  };

  // WidthStyle =
  //   mouseMovingRef.current === true ? vm.width : vm.width - 12;

  return (
    <motion.div
      ref={eventRef}
      className="absolute"
      style={dynamicMotionDivStyles}
      onMouseDown={onMouseDown}
      onPanStart={handleOnPanStart}
      onPan={handleOnPan}
      onPanEnd={handleOnPanEnd}
      // Check this for fixing animation: https://www.framer.com/motion/use-animation-controls/
      // animate={{ x: offset[0], y: offset[1] }}
      // transition={{ ease: "easeInOut", duration: 0.1 }}
    >
      <button
        style={dynamicButtonStyles}
        className="h-full w-full rounded-md bg-sky-300"
        onClick={(e) => {
          // Stop event from propagating to avoid the calendars click listener to be triggered
          e.stopPropagation();
          // Don't trigger this click event in case we are dragging
          if (mouseMovingRef.current === false) {
            console.log("clicked event ", vm.id);
          }
        }}
      >
        <CalendarEvent event={vm} />
      </button>
    </motion.div>
  );
};

export default CalendarEventPositioned;

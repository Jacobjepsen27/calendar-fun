import { PanInfo, motion } from "framer-motion";
import { CalendarEventViewModel } from "../hooks/useEvents";
import { useRef, useState, useLayoutEffect, CSSProperties } from "react";
import CalendarEvent from "./CalendarEvent";

type CalendarEventPositionedProps = {
  eventViewModel: CalendarEventViewModel;
  onPan: (event: PointerEvent) => [number, number];
  onPanEnd: (event: PointerEvent, eventId: string) => void;
};
const CalendarEventPositioned = (props: CalendarEventPositionedProps) => {
  const { eventViewModel: vm, onPan, onPanEnd } = props;
  const eventRef = useRef<HTMLDivElement | null>(null);
  const mouseMovingRef = useRef(false);

  const [offset, setOffset] = useState<[number, number]>([0, 0]);

  useLayoutEffect(() => {
    setOffset([0, 0]);
  }, [vm.left, vm.top]);

  const handlePan = (event: PointerEvent, info: PanInfo) => {
    const [x, y] = onPan(event);
    const offsetX = x - vm.left;
    const offsetY = y - vm.top;
    setOffset([offsetX, offsetY]);
  };

  // When dragging add shadows, cursor
  const dynamicButtonStyles: CSSProperties = mouseMovingRef.current
    ? {
        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        cursor: "move",
      }
    : {};

  // When dragging increase width
  const dynamicWidthStyle =
    mouseMovingRef.current == true ? vm.width : vm.width - 12;

  return (
    <motion.div
      ref={eventRef}
      className="absolute"
      style={{
        left: vm.left,
        top: vm.top,
        height: vm.height,
        width: dynamicWidthStyle,
        transform: `translate(${offset[0]}px,${offset[1]}px)`,
      }}
      onPanStart={() => (mouseMovingRef.current = true)}
      onPan={handlePan}
      onPanEnd={(event) => {
        event.stopPropagation();
        onPanEnd(event, vm.id);
        mouseMovingRef.current = false;
      }}
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

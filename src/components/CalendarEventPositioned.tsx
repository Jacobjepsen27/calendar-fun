import { PanInfo, motion } from "framer-motion";
import { CalendarEventViewModel } from "../hooks/useEvents";
import { useRef, useState, useLayoutEffect } from "react";
import CalendarEvent from "./CalendarEvent";

type CalendarEventPositionedProps = {
  eventViewModel: CalendarEventViewModel;
  onPan: (event: PointerEvent) => [number, number];
  onPanEnd: (event: PointerEvent, eventId: string) => void;
};
const CalendarEventPositioned = (props: CalendarEventPositionedProps) => {
  const { eventViewModel: vm, onPan, onPanEnd } = props;
  const eventRef = useRef<HTMLDivElement | null>(null);

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

  // TODO: fix Event click, when dragging. Maybe check inside onClick that isDragging is not enabled
  return (
    <motion.div
      ref={eventRef}
      className="absolute"
      style={{
        left: vm.left,
        top: vm.top,
        height: vm.height,
        width: vm.width,
        transform: `translate(${offset[0]}px,${offset[1]}px)`,
      }}
      onPan={handlePan}
      onPanEnd={(event) => onPanEnd(event, vm.id)}
      // animate={{ x: offset[0], y: offset[1] }}
      // transition={{ ease: "easeInOut", duration: 0.1 }}
    >
      <CalendarEvent event={vm} />
    </motion.div>
  );
};

export default CalendarEventPositioned;
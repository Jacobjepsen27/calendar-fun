import { PanInfo, motion } from "framer-motion";
import { CalendarEventViewModel } from "../hooks/useEvents";
import { useRef, useState, CSSProperties, useLayoutEffect } from "react";
import CalendarEvent from "./CalendarEventUI";

type CalendarEventPositionedProps = {
  viewModel: CalendarEventViewModel;
  onPan: (
    eventId: string,
    event: PointerEvent,
    cursorOffsetY: number,
  ) => [number, number];
  onPanEnd: (
    eventId: string,
    event: PointerEvent,
    cursorOffsetY: number,
  ) => void;
  onResize: (eventId: string, offsetY: number) => number;
  onResizeEnd: (eventId: string, offsetY: number) => void;
};
const CalendarEventPositioned = ({
  viewModel,
  onPan,
  onPanEnd,
  onResize,
  onResizeEnd,
}: CalendarEventPositionedProps) => {
  const eventRef = useRef<HTMLDivElement | null>(null);
  // Used to disable click event when dragging
  const mouseMovingRef = useRef(false);
  // Offset of where the true y coordinate is withtin the moving event (to avoid unintentional snapping)
  const cursorYOffset = useRef(0);

  const [transformOffset, setTransformOffset] = useState<[number, number]>([
    0, 0,
  ]);
  const [resizeHeight, setResizeHeight] = useState(0);

  useLayoutEffect(() => {
    setTransformOffset([0, 0]);
  }, [viewModel.left, viewModel.top]);

  useLayoutEffect(() => {
    setResizeHeight(0);
  }, [viewModel.height]);

  const handlePanSessionStart = (_: PointerEvent, info: PanInfo) => {
    const cursorOffsetY =
      info.point.y -
      (eventRef.current?.getBoundingClientRect().top ?? info.point.y);
    cursorYOffset.current = cursorOffsetY;
  };

  const handleOnPanStart = (_: PointerEvent) => {
    mouseMovingRef.current = true;
  };

  const handleOnPan = (event: PointerEvent, _: PanInfo) => {
    const [x, y] = onPan(viewModel.id, event, cursorYOffset.current);
    const offsetX = x - viewModel.left;
    const offsetY = y - viewModel.top;
    setTransformOffset([offsetX, offsetY]);
  };

  const handleOnPanEnd = (event: PointerEvent) => {
    event.stopPropagation();
    onPanEnd(viewModel.id, event, cursorYOffset.current);
    mouseMovingRef.current = false;
    cursorYOffset.current = 0;
  };

  const handleResize = (event: PointerEvent, info: PanInfo) => {
    const resizeHeight = onResize(viewModel.id, info.offset.y);
    setResizeHeight(resizeHeight);
  };

  const handleResizeEnd = (event: PointerEvent, info: PanInfo) => {
    event.stopPropagation();
    onResizeEnd(viewModel.id, info.offset.y);
  };

  const dynamicButtonStyles: CSSProperties = mouseMovingRef.current
    ? {
        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        cursor: "move",
      }
    : {};

  const dynamicMotionDivStyles: CSSProperties = {
    left: viewModel.left,
    top: viewModel.top,
    height: viewModel.height + resizeHeight,
    width: mouseMovingRef.current ? viewModel.width : viewModel.width - 12,
    transform: `translate(${transformOffset[0]}px,${transformOffset[1]}px)`,
    touchAction: "none",
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
              console.log("clicked event ", viewModel.id);
            }
          }}
        >
          <CalendarEvent event={viewModel} />
        </button>
      </motion.div>
      <motion.button
        className="absolute bottom-0 left-0 right-0 h-[10px] w-full cursor-ns-resize"
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

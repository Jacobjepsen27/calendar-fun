import { differenceInMinutes } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { PanInfo, motion } from "framer-motion";
import { getCurrentWeeks } from "../utils/dates";
import { EVENTS_DATA } from "../mock-data/events";
import {
  getDateFromCoordinates,
  getLeftPixels,
  getPixelHeightFromMinutes,
  getRelativeClickCoordinates,
  getTopPixels,
} from "../utils/calendar";

const arrayFromNumber = (count: number) => {
  let arr = [...Array(count)].map((_, i) => i);
  return arr;
};

export type Event = {
  id: string;
  name: string;
  from: Date;
  to: Date;
};

type EventViewModel = Event & {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type DateColumn = {
  index: number;
  date: Date;
};

const Cell = () => {
  return (
    <div className="w-full shrink-0 basis-[48px] border-r-[1px] border-t-[1px] border-solid"></div>
  );
};

type CalendarGridProps = {
  columns?: number;
  rows?: number;
};
const CalendarGridUI = ({ columns = 7, rows = 24 }: CalendarGridProps) => {
  return (
    <div className="flex w-full">
      {/* columns */}
      {arrayFromNumber(columns).map((col) => (
        <div key={col} className="flex flex-grow flex-col border-solid">
          {/* Cells */}
          {arrayFromNumber(rows).map((row) => (
            <Cell key={`${col}-${row}`} />
          ))}
        </div>
      ))}
    </div>
  );
};

type EventProps = {
  event: EventViewModel;
};
const Event = ({ event }: EventProps) => {
  // Ideally this should only be responsible for showing data and acting as a button
  return (
    <button
      onClick={() => console.log("clicked event ", event.id)}
      className="h-full w-full bg-green-500"
    >
      {event.name}
    </button>
  );
};

type EventPositionedProps = {
  eventViewModel: EventViewModel;
  onPanHandle: (event: PointerEvent) => [number, number];
};
const EventPositioned = (props: EventPositionedProps) => {
  const { eventViewModel, onPanHandle } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const handlePan = (event: PointerEvent, info: PanInfo) => {
    if (ref.current) {
      const [x, y] = onPanHandle(event);
      const offsetX = x - eventViewModel.left;
      const offsetY = y - eventViewModel.top;
      ref.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  };

  // TODO: fix Event click, when dragging. Maybe check inside onClick that isDragging is not enabled
  return (
    <motion.div
      ref={ref}
      className="absolute"
      style={{
        left: eventViewModel.left,
        top: eventViewModel.top,
        height: eventViewModel.height,
        width: eventViewModel.width,
      }}
      onPan={handlePan}
    >
      <Event event={eventViewModel} />
    </motion.div>
  );
};

const useCalendar = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [columns, _] = useState<DateColumn[]>(() => {
    const weeks = getCurrentWeeks(new Date());
    return weeks.map((date, index) => ({ index, date }));
  });

  const columnWidth = useMemo(() => {
    if (containerRef.current == null) return 1;
    return containerRef.current.getBoundingClientRect().width / columns.length;
  }, [columns, containerRef.current]);

  const cellHeight = 48; //px

  return {
    ref: containerRef,
    columns,
    columnWidth,
    cellHeight,
  };
};

const BookingPageV2 = () => {
  const { ref, cellHeight, columnWidth, columns } = useCalendar();

  const [eventViewModels, setEventViewModels] = useState<EventViewModel[]>([]);
  useEffect(() => {
    if (ref.current != null) {
      const calculatePosition = (
        event: Event,
      ): [number, number, number, number] => {
        const eventHeight = getPixelHeightFromMinutes(
          differenceInMinutes(event.to, event.from),
          cellHeight,
        );
        const topPx = getTopPixels(event.from, cellHeight);
        const leftPx = getLeftPixels(event.from, columns, columnWidth);
        return [leftPx, topPx, eventHeight, columnWidth];
      };
      const viewModels: EventViewModel[] = EVENTS_DATA.map((event) => {
        const [left, top, height, width] = calculatePosition(event);

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
  }, [columns, columnWidth, cellHeight]);

  const onCalendarClick: React.MouseEventHandler = (event) => {
    // Get relative coordinates in container
    const [relativeX, relativeY] = getRelativeClickCoordinates(
      event,
      ref.current!,
    );
    // calculate date from coordinates
    const newDate = getDateFromCoordinates(
      [relativeX, relativeY],
      columnWidth,
      columns,
      cellHeight,
    );
    console.log("newDate: ", newDate);
  };

  const onPanHandle = (event: PointerEvent): [number, number] => {
    const [relativeX, relativeY] = getRelativeClickCoordinates(
      event,
      ref.current!,
    );
    // calculate date from coordinates
    const newDate = getDateFromCoordinates(
      [relativeX, relativeY],
      columnWidth,
      columns,
      cellHeight,
    );
    const topPx = getTopPixels(newDate, cellHeight);
    const leftPx = getLeftPixels(newDate, columns, columnWidth);
    return [leftPx, topPx];
  };

  return (
    <div className=" borde-white flex max-h-[90%] w-full max-w-[90%] flex-col border ">
      <div className="border border-black">Monday - sunday</div>

      <div className="overflow-auto">
        <div className="relative flex">
          <CalendarGridUI columns={columns.length} />
          {/* Events UI  */}
          <div ref={ref} className="absolute inset-0" onClick={onCalendarClick}>
            {eventViewModels.map((eventViewModel) => (
              <EventPositioned
                key={eventViewModel.id}
                eventViewModel={eventViewModel}
                onPanHandle={onPanHandle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPageV2;

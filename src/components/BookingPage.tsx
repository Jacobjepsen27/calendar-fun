import { add, differenceInMinutes } from "date-fns";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  onPan: (event: PointerEvent) => [number, number];
  onPanEnd: (event: PointerEvent, eventId: string) => void;
};
const EventPositioned = (props: EventPositionedProps) => {
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
      <Event event={vm} />
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

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(EVENTS_DATA);

  const updateEvent = (event: Event) => {
    let updatedList = events.filter((e) => e.id !== event.id);
    updatedList.push(event);
    setEvents(updatedList);
  };
  return { events, updateEvent };
};

const BookingPageV2 = () => {
  const { ref, cellHeight, columnWidth, columns } = useCalendar();
  const { events, updateEvent } = useEvents();
  console.log(events);
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
      const viewModels: EventViewModel[] = events.map((event) => {
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
  }, [columns, columnWidth, cellHeight, events]);

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

  const handleOnPan = (event: PointerEvent): [number, number] => {
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

  const handleOnPanEnd = (e: PointerEvent, eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      const [relativeX, relativeY] = getRelativeClickCoordinates(
        e,
        ref.current!,
      );
      // calculate date from coordinates
      const newDate = getDateFromCoordinates(
        [relativeX, relativeY],
        columnWidth,
        columns,
        cellHeight,
      );
      const deltaMinutes = differenceInMinutes(event.to, event.from);
      const updatedEvent: Event = {
        ...event,
        from: newDate,
        to: add(newDate, { minutes: deltaMinutes }),
      };
      updateEvent(updatedEvent);
    }
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
                onPan={handleOnPan}
                onPanEnd={handleOnPanEnd}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPageV2;

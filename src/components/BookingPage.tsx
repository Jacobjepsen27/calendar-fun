import { differenceInMinutes, setHours } from "date-fns";
import { useEffect, useRef, useState } from "react";
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
};
const EventPositioned = (props: EventPositionedProps) => {
  const { eventViewModel } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const handlePan = (event: PointerEvent, info: PanInfo) => {
    if (ref.current) {
      console.log("onPan", event, info);
      const offset = info.offset;
      // TODO: before setting transform, we need to calculate where on the grid to place it based on pointer event
      //   ref.current.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    }
  };

  // TODO: save the event's position in state top calculate correct transform etc
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

const BookingPageV2 = () => {
  /**
   * Render events when ref has been initialized
   */
  const [refInitialized, setRefInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (containerRef.current == null) return;
    setRefInitialized(true);
  }, [containerRef.current]);

  /**
   * Initialize date columns
   */
  const [columns, _] = useState<DateColumn[]>(() => {
    const weeks = getCurrentWeeks(new Date());
    return weeks.map((date, index) => ({ index, date }));
  });

  const [eventViewModels, setEventViewModels] = useState<EventViewModel[]>([]);
  useEffect(() => {
    if (containerRef.current != null) {
      const events = EVENTS_DATA;
      const containerRectangle = containerRef.current.getBoundingClientRect();
      const calculatePosition = (
        event: Event,
      ): [number, number, number, number] => {
        const eventHeight = getPixelHeightFromMinutes(
          differenceInMinutes(event.to, event.from),
        );
        const columnWidth = containerRectangle.width / columns.length;
        const topPx = getTopPixels(event.from);
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
  }, [refInitialized]);

  return (
    <div className=" borde-white flex max-h-[90%] w-full max-w-[90%] flex-col border ">
      <div className="border border-black">Monday - sunday</div>

      <div className="overflow-auto">
        <div className="relative flex">
          <CalendarGridUI columns={columns.length} />
          {/* Events UI  */}
          <div
            ref={containerRef}
            className="absolute inset-0"
            onClick={(event) => {
              // Get relative coordinates in container
              const [relativeX, relativeY] = getRelativeClickCoordinates(
                event,
                containerRef.current!,
              );
              // calculate date from coordinates
              const columnWidth =
                containerRef.current!.getBoundingClientRect().width /
                columns.length;

              const newDate = getDateFromCoordinates(
                [relativeX, relativeY],
                columnWidth,
                columns,
              );
              console.log("newDate: ", newDate);
            }}
          >
            {eventViewModels.map((eventViewModel) => (
              <EventPositioned
                key={eventViewModel.id}
                eventViewModel={eventViewModel}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPageV2;

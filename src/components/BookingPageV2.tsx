import { differenceInMinutes, set } from "date-fns";
import { v4 as uuid } from "uuid";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Point, motion } from "framer-motion";
import { getPixelHeightFromMinutes, getTopPixels } from "../utils/common";

const arrayFromNumber = (count: number) => {
  let arr = [...Array(count)].map((_, i) => i);
  return arr;
};

type EventModel = {
  id: string;
  name: string;
  from: Date;
  to: Date;
};

const EVENTS_DATA: EventModel[] = [
  {
    id: uuid().toString(),
    name: "Event 1",
    from: set(new Date(2023, 9, 9), {
      hours: 7,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    }),
    to: set(new Date(2023, 9, 9), {
      hours: 8,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    }),
  },
  {
    id: uuid().toString(),
    name: "Event 2",
    from: set(new Date(2023, 9, 11), {
      hours: 9,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    }),
    to: set(new Date(2023, 9, 11), {
      hours: 11,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    }),
  },
];

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
  event: EventModel;
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
  event: EventModel;
  containerRect: DOMRect;
  columns: number;
};
const EventPositioned = (props: EventPositionedProps) => {
  const { event, containerRect, columns } = props;
  // Calculate position here
  const calculatePosition = (): CSSProperties => {
    const eventHeight = getPixelHeightFromMinutes(
      differenceInMinutes(event.to, event.from),
    );
    const eventWidth = containerRect.width / columns;
    const topPx = getTopPixels(event.from);
    return {
      height: `${eventHeight}px`,
      width: `${eventWidth}px`,
      top: `${topPx}px`,
      left: "40px",
    };
  };

  const [point, setPoint] = useState<Point | null>(null);

  // TODO: save the event's position in state top calculate correct transform etc
  // TODO: fix Event click, when dragging. Maybe check inside onClick that isDragging is not enabled
  return (
    <motion.div
      className="absolute"
      style={{
        ...calculatePosition(),
        transform: `translate(${point?.x}px, ${point?.y}px)`,
      }}
      onPan={(event, point) => setPoint(point.offset)}
    >
      <Event event={event} />
      {/* <div className="h-[40px] w-[100px] bg-sky-700"></div> */}
    </motion.div>
  );
};

// const DraggableEvent = (props: PropsWithChildren) => {
//   // Act as a draggable wrapper around the event
//   const [point, setPoint] = useState<Point | null>(null);
//   return (
//     <motion.div
//       style={{
//         transform: `translate(${point?.x}px, ${point?.y}px)`,
//       }}
//       className="absolute h-[40px] w-[80px] bg-red-500"
//       onPan={(event, pointInfo) => {
//         setPoint({ x: pointInfo.point.x, y: pointInfo.point.y });
//         // setPoint({ x: pointInfo.point.x, y: pointInfo.point.y });
//       }}
//       onPanStart={(event, pointInfo) =>
//         console.log("onPanStart ", "event: ", event, " - pi: ", pointInfo)
//       }
//       onPanEnd={(event, pointInfo) =>
//         console.log("onPanEnd ", "event: ", event, " - pi: ", pointInfo)
//       }
//     >
//       {props.children}
//     </motion.div>
//   );
// };

// TODO: test if event can be dragged and also be a button
const BookingPageV2 = () => {
  const [events, setEvents] = useState<EventModel[]>(EVENTS_DATA);

  const [columns, setColumns] = useState(7); // Should be array of dates reflecting the week
  const [refInitialized, setRefInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current == null) return;
    setRefInitialized(true);
  }, [containerRef.current]);

  return (
    <div className=" borde-white flex max-h-[90%] w-full max-w-[1100px] max-w-[90%] flex-col border ">
      <div className="border border-black">Monday - sunday</div>

      <div className="overflow-auto border border-red-500">
        <div className="relative flex">
          <CalendarGridUI columns={columns} />
          {/* Events UI  */}
          <div ref={containerRef} className="absolute inset-0">
            {/* Events should be positioned inside here */}
            {refInitialized
              ? events.map((event) => (
                  <EventPositioned
                    key={event.id}
                    event={event}
                    columns={columns}
                    containerRect={containerRef!.current!.getBoundingClientRect()}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPageV2;

import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

type DropItem = { id: number };
type DropEventHandler = (day: Date, eventId: number) => void;
const ItemTypes = {
  EVENT: "event",
};

type EventProps = { id: number };
const Event = ({ id }: EventProps) => {
  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: ItemTypes.EVENT,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    item: { id },
  });

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      className="absolute left-0 top-12 h-[70px] w-[90%] bg-blue-600"
    >
      <div className="flex h-full items-center justify-center">Event {id}</div>
    </div>
  );
};

type ColumnProps = {
  day: Date;
  onDropEvent: (day: Date, itemId: number) => void;
  children?: React.ReactNode;
};
const Column = ({ day, onDropEvent, children }: ColumnProps) => {
  const [{ isHovered, item }, dropRef] = useDrop({
    accept: ItemTypes.EVENT,
    drop: (item: DropItem) => onDropEvent(day, item.id),
    collect: (monitor) => {
      return {
        isHovered: monitor.isOver(),
        item: monitor.getItem(),
        // curserPos: monitor.getClientOffset(),
      };
    },

    // hover(item, monitor) {
    //   console.log("x", monitor.getSourceClientOffset()?.x);
    // },
  });

  console.log("isHovered", isHovered, "- item: ", item);

  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      console.log("position: ", position);
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };
    if (isHovered) {
      // Add event listener for the mouse movement
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={dropRef}
      className="relative min-w-[81px] flex-1 border border-cyan-600"
    >
      {children}
      {isHovered && position && (
        <div
          className="h-[70px] w-[90%] bg-blue-600"
          style={{ transform: `translateY(${position.y}px)` }}
        >
          Ghost
        </div>
      )}
    </div>
  );
};

function BookingPage() {
  const handleDropEvent: DropEventHandler = (day, eventId) => {
    console.log(`Event ${eventId} dropped on ${day}`);
    // Update your state here
  };

  return (
    <div className="flex h-full w-full flex-col border border-black ">
      {/* Header */}
      <div className="border border-black">Monday - sunday</div>
      {/* Drag n' Drop container */}
      <div className="flex h-full border border-cyan-800">
        <Column day={new Date(2023, 9, 2)} onDropEvent={handleDropEvent}>
          <Event id={1} />
        </Column>
        <Column
          day={new Date(2023, 9, 3)}
          onDropEvent={handleDropEvent}
        ></Column>
        <Column
          day={new Date(2023, 9, 4)}
          onDropEvent={handleDropEvent}
        ></Column>
        <Column
          day={new Date(2023, 9, 5)}
          onDropEvent={handleDropEvent}
        ></Column>
        <Column
          day={new Date(2023, 9, 6)}
          onDropEvent={handleDropEvent}
        ></Column>
        <Column
          day={new Date(2023, 9, 7)}
          onDropEvent={handleDropEvent}
        ></Column>
        <Column
          day={new Date(2023, 9, 8)}
          onDropEvent={handleDropEvent}
        ></Column>
      </div>
    </div>
  );
}

export default BookingPage;

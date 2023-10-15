import { add, differenceInMinutes } from "date-fns";
import { useEffect, useState } from "react";
import {
  getLeftPixels,
  getPixelHeightFromMinutes,
  getTopPixels,
} from "../utils/calendar";
import useCalendar from "../hooks/useCalendar";
import useEvents, {
  CalendarEvent,
  CalendarEventViewModel,
} from "../hooks/useEvents";
import CalendarEventPositioned from "./CalendarEventPositioned";
import CalendarGridUI from "./CalendarGridUI";

export type DateColumn = {
  index: number;
  date: Date;
};

const BookingPageV2 = () => {
  const { ref, cellHeight, columnWidth, columns, getDateFromEvent } =
    useCalendar();
  const { events, updateEvent } = useEvents();

  const [eventViewModels, setEventViewModels] = useState<
    CalendarEventViewModel[]
  >([]);

  useEffect(() => {
    if (ref.current != null) {
      const calculatePosition = (
        event: CalendarEvent,
      ): [number, number, number, number] => {
        const eventHeight = getPixelHeightFromMinutes(
          differenceInMinutes(event.to, event.from),
          cellHeight,
        );
        const eventWidth = columnWidth;
        const topPx = getTopPixels(event.from, cellHeight);
        const leftPx = getLeftPixels(event.from, columns, columnWidth);
        return [leftPx, topPx, eventHeight, eventWidth];
      };
      const viewModels: CalendarEventViewModel[] = events.map((event) => {
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
    const newDate = getDateFromEvent(event);
    console.log("newDate: ", newDate);
  };

  const handleOnPan = (event: PointerEvent): [number, number] => {
    const newDate = getDateFromEvent(event);
    const topPx = getTopPixels(newDate, cellHeight);
    const leftPx = getLeftPixels(newDate, columns, columnWidth);
    return [leftPx, topPx];
  };

  const handleOnPanEnd = (event: PointerEvent, eventId: string) => {
    const calendarEvent = events.find((e) => e.id === eventId);
    if (calendarEvent) {
      const newDate = getDateFromEvent(event);
      const updatedCalendarEvent: CalendarEvent = {
        ...calendarEvent,
        from: newDate,
        to: add(newDate, {
          minutes: differenceInMinutes(calendarEvent.to, calendarEvent.from),
        }),
      };
      updateEvent(updatedCalendarEvent);
    }
  };

  return (
    <div className="borde-white flex max-h-[90%] w-full max-w-[90%] flex-col border ">
      <div className="border border-black">Monday - sunday</div>

      <div className="overflow-auto">
        <div className="relative flex">
          <CalendarGridUI columns={columns.length} />
          {/* Events UI  */}
          <div ref={ref} className="absolute inset-0" onClick={onCalendarClick}>
            {eventViewModels.map((eventViewModel) => (
              <CalendarEventPositioned
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

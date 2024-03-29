import { areIntervalsOverlapping } from "date-fns";
import { CalendarConfig } from "../hooks/useCalendar";
import useEvents from "../hooks/useEvents";
import Calendar from "./Calendar";

export type DateColumn = {
  index: number;
  date: Date;
};

const customConfig: CalendarConfig = {
  timeRange: {
    startHour: 7,
    endHour: 22,
  },
  isEventReadonly: (event, context) => {
    // Check if userId is different from my cookies
    return event.from < new Date() || event.userId !== "JACOB";
  },
  validators: [
    (event, context) => {
      return !context.events
        .filter((e) => e.id !== event.id)
        .some((otherEvent) =>
          areIntervalsOverlapping(
            { start: event.from, end: event.to },
            { start: otherEvent.from, end: otherEvent.to },
            { inclusive: false },
          ),
        );
    },
    (event, context) => {
      return event.from > new Date();
    },
  ],
};

const BookingPage = () => {
  const { events, updateEvent } = useEvents();
  return (
    <div className="flex h-[100%] items-center justify-center">
      <div id="calendar-container" className="h-[90%] max-h-[900px] w-[90%]">
        <Calendar
          events={events}
          onUpdateEvent={updateEvent}
          config={customConfig}
        />
      </div>
    </div>
  );
};

export default BookingPage;

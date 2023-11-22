import useEvents from "../hooks/useEvents";
import Calendar from "./Calendar";

export type DateColumn = {
  index: number;
  date: Date;
};

const BookingPage = () => {
  const { events, updateEvent } = useEvents();
  return (
    <div className="flex h-[100%] items-center justify-center">
      <div className="h-[90%] max-h-[900px] w-[90%]">
        <Calendar events={events} onUpdateEvent={updateEvent} />
      </div>
    </div>
  );
};

/**
 * Calendar should ideally get a config object allowing consumer to customize behavoir,
 * time range (e.g. 7-22)
 * snapping interval - (hour, half hour, quarter).
 * height of each cell
 * Overlapping
 * Calendar
 * Event editible - pass validator function returning true or false which is called for all drag/resize events
 *  - e.g. (event: CalendarModel) => event.userId === currentUserId
 * Event display (JSX)
 */

export default BookingPage;

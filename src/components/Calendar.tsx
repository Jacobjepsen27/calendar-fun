import CalendarEventPositioned from "./CalendarEventPositioned";
import CalendarGridUI from "./CalendarGridUI";
import useCalendarInternals from "../hooks/useCalendarInternals";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";
import usePositionedCalendarEvents from "../hooks/usePositionedCalendarEvents";

type CalendarProps = {
  events: CalendarEvent[];
  onUpdateEvent: (event: CalendarEvent) => void;
};
const Calendar = ({ events, onUpdateEvent }: CalendarProps) => {
  const calendarInternals = useCalendarInternals();
  const positionedCalendarEvents = usePositionedCalendarEvents(
    calendarInternals,
    events,
  );

  const handleEventChange = (
    positionedCalendarEvent: PositionedCalendarEvent,
  ) => {
    onUpdateEvent({
      id: positionedCalendarEvent.id,
      name: positionedCalendarEvent.name,
      from: positionedCalendarEvent.from,
      to: positionedCalendarEvent.to,
    });
  };

  return (
    <div className="flex h-full w-full flex-col border ">
      <div className="border border-black">Monday - sunday</div>
      <div className="overflow-auto" ref={calendarInternals.scrollRef}>
        <div className="relative flex overflow-hidden">
          <CalendarGridUI columns={7} rows={24} />
          <div
            ref={calendarInternals.calendarRef}
            className="absolute inset-0 isolate"
            onClick={(e) => console.log("clicked calendar")}
          >
            {positionedCalendarEvents.map((positionedCalendarEvent) => (
              <CalendarEventPositioned
                key={positionedCalendarEvent.id}
                positionedCalendarEvent={positionedCalendarEvent}
                calendarInternals={calendarInternals}
                onEventChange={handleEventChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

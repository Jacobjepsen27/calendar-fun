import CalendarEventPositioned, {
  EventReadonly,
} from "./CalendarEventPositioned";
import { CalendarConfig, defaultConfig } from "../hooks/useCalendar";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";
import usePositionedCalendarEvents from "../hooks/usePositionedCalendarEvents";
import { format } from "date-fns";
import Header from "./Header";
import { convertToTimeString } from "../utils/dates";
import { getDateFromEvent } from "../utils/calendar";
import useCalendar from "../hooks/useCalendar";

type CalendarProps = {
  events: CalendarEvent[];
  onUpdateEvent: (event: CalendarEvent) => void;
  config?: CalendarConfig;
};
const Calendar = ({
  events,
  onUpdateEvent,
  config = defaultConfig,
}: CalendarProps) => {
  const calendarContext = useCalendar(config, events);
  const positionedCalendarEvents = usePositionedCalendarEvents(calendarContext);

  const handleEventChange = (
    positionedCalendarEvent: PositionedCalendarEvent,
  ) => {
    onUpdateEvent({
      id: positionedCalendarEvent.id,
      userId: positionedCalendarEvent.userId,
      name: positionedCalendarEvent.name,
      from: positionedCalendarEvent.from,
      to: positionedCalendarEvent.to,
    });
  };

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-slate-100">
      <Header calendarContext={calendarContext} />
      <div
        className="isolate z-0 overflow-auto"
        ref={calendarContext.calendarInternals.scrollRef}
      >
        <div className="flex flex-row">
          {/* time column */}
          <div className="w-[96px]">
            {calendarContext.calendarInternals.timeRange.map((time) => (
              <div
                key={time}
                className="flex h-[48px] w-full items-center justify-center border-r-[1px] border-t-[1px] border-solid"
              >
                <p className="text-sm">{convertToTimeString(time)}</p>
              </div>
            ))}
          </div>
          {/* events column */}
          <div className="relative flex flex-1 overflow-hidden">
            {/* Visual layout */}
            {calendarContext.calendarInternals.columns.map((column) => (
              <div key={column.index} className="w-full">
                {calendarContext.calendarInternals.timeRange.map((time) => (
                  <div
                    key={time}
                    className="h-[48px] w-full border-l-[1px] border-t-[1px] border-solid"
                  ></div>
                ))}
              </div>
            ))}
            <div
              ref={calendarContext.calendarInternals.calendarRef}
              className="absolute inset-0 isolate"
              onClick={(e) =>
                console.log(
                  format(getDateFromEvent(e, 0, calendarContext), "eee, HH:mm"),
                )
              }
            >
              {positionedCalendarEvents.map((positionedCalendarEvent) => {
                if (positionedCalendarEvent.isReadonly) {
                  return (
                    <EventReadonly
                      key={positionedCalendarEvent.id}
                      positionedCalendarEvent={positionedCalendarEvent}
                    />
                  );
                } else {
                  return (
                    <CalendarEventPositioned
                      key={positionedCalendarEvent.id}
                      positionedCalendarEvent={positionedCalendarEvent}
                      calendarContext={calendarContext}
                      onEventChange={handleEventChange}
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

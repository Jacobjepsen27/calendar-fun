import CalendarEventPositioned from "./CalendarEventPositioned";
import useCalendarInternals from "../hooks/useCalendarInternals";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";
import usePositionedCalendarEvents from "../hooks/usePositionedCalendarEvents";
import { da } from "date-fns/locale";
import { format } from "date-fns";

export type CalendarConfig = {
  // calendarView: "WEEK" | "DAY";
  timeRange: {
    startHour: number;
    endHour: number;
  };
};

const defaultConfig: CalendarConfig = {
  // calendarView: "WEEK",
  timeRange: {
    startHour: 7,
    endHour: 22,
  },
};

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
  const calendarInternals = useCalendarInternals(config);
  const positionedCalendarEvents = usePositionedCalendarEvents(
    events,
    calendarInternals,
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
      {/* 
        Header
      */}
      <div className="flex h-[48px] flex-row border-b-[1px]">
        <div className="h-[48px] w-[96px]"></div>
        {calendarInternals.columns.map((column) => (
          <div
            key={column.index}
            className="flex h-[48px] flex-1 items-center justify-center"
          >
            {format(column.date, "eee MMMM do", { locale: da })}
          </div>
        ))}
      </div>
      <div className="overflow-auto" ref={calendarInternals.scrollRef}>
        <div className="flex flex-row">
          {/* time column */}
          <div className="w-[96px]">
            {calendarInternals.time.timeRange.map((time) => (
              <div
                key={time}
                className="flex h-[48px] w-full items-center justify-center border-b-[1px] border-r-[1px] border-solid"
              >
                {time}
              </div>
            ))}
          </div>
          {/* events column */}
          <div className="relative flex flex-1 overflow-hidden">
            {/* Visual layout */}
            {calendarInternals.columns.map((column) => (
              <div key={column.index} className="w-full">
                {calendarInternals.time.timeRange.map((time) => (
                  <div
                    key={time}
                    className="h-[48px] w-full border-b-[1px] border-l-[1px] border-solid"
                  ></div>
                ))}
              </div>
            ))}
            <div
              ref={calendarInternals.calendarRef}
              className="absolute inset-0 isolate"
              onClick={(e) =>
                console.log(
                  format(
                    calendarInternals.getDateFromEvent(e, 0),
                    "eee, HH:mm",
                  ),
                )
              }
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
    </div>
  );
};

export default Calendar;

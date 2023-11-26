import CalendarEventPositioned from "./CalendarEventPositioned";
import useCalendarInternals, {
  CalendarConfig,
  defaultConfig,
} from "../hooks/useCalendarInternals";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";
import usePositionedCalendarEvents from "../hooks/usePositionedCalendarEvents";
import { format, startOfDay } from "date-fns";
import { useCalendarControls } from "../hooks/useCalendarControls";
import Header from "./Header";
import { convertToTimeString } from "../utils/dates";

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
  const { state, dispatch } = useCalendarControls({
    date: startOfDay(new Date()),
    view: "WEEK",
  });
  const calendarInternals = useCalendarInternals(config, state);
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
    <div className="flex h-full w-full flex-col rounded-lg bg-slate-100">
      <Header
        calendarInternals={calendarInternals}
        next={() => dispatch({ type: "next" })}
        prev={() => dispatch({ type: "prev" })}
        today={() => dispatch({ type: "today" })}
        onViewChange={(view) => dispatch({ type: "view", payload: view })}
        calendarControlState={state}
      />
      <div
        className="isolate z-0 overflow-auto"
        ref={calendarInternals.scrollRef}
      >
        <div className="flex flex-row">
          {/* time column */}
          <div className="w-[96px]">
            {calendarInternals.time.timeRange.map((time) => (
              <div
                key={time}
                className="flex h-[48px] w-full items-center justify-center border-b-[1px] border-r-[1px] border-solid"
              >
                <p className="text-sm">{convertToTimeString(time)}</p>
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

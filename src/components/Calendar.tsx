import CalendarEventPositioned from "./CalendarEventPositioned";
import useCalendarInternals, {
  CalendarConfig,
  CalendarInternals,
  defaultConfig,
} from "../hooks/useCalendarInternals";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";
import usePositionedCalendarEvents from "../hooks/usePositionedCalendarEvents";
import { da } from "date-fns/locale";
import { format, startOfDay } from "date-fns";
import { useCalendarControls } from "../hooks/useCalendarControls";

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
    <div className="bg-slate-150 flex h-full w-full flex-col border">
      <Header
        calendarInternals={calendarInternals}
        next={() => dispatch({ type: "next" })}
        prev={() => dispatch({ type: "prev" })}
        today={() => dispatch({ type: "today" })}
        onViewChange={(view) => dispatch({ type: "view", payload: view })}
      />
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

type HeaderProps = {
  calendarInternals: CalendarInternals;
  next: () => void;
  prev: () => void;
  today: () => void;
  onViewChange: (view: "WEEK" | "DAY") => void;
};
const Header = ({ calendarInternals, ...actions }: HeaderProps) => {
  return (
    <div className="flex flex-col border-b-[1px]">
      <div className="flex h-[48px] flex-row items-center justify-between">
        <div className="flex gap-1">
          <button
            onClick={() => actions.onViewChange("WEEK")}
            type="button"
            className="rounded-md bg-sky-300 p-2"
          >
            Week
          </button>
          <button
            onClick={() => actions.onViewChange("DAY")}
            type="button"
            className="rounded-md bg-sky-300 p-2"
          >
            Day
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={actions.prev}
            type="button"
            className="rounded-md bg-sky-300 p-2"
          >
            &lt;
          </button>
          <button
            onClick={actions.today}
            type="button"
            className="rounded-md bg-sky-300 p-2"
          >
            Today
          </button>
          <button
            onClick={actions.next}
            type="button"
            className="rounded-md bg-sky-300 p-2"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="h-[48px] w-[96px]"></div>
        {calendarInternals.columns.map((column) => (
          <div
            key={column.index}
            className="flex h-[48px] flex-1 items-center justify-center"
          >
            <p className="sm">
              {format(column.date, "eee MMMM do", { locale: da })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

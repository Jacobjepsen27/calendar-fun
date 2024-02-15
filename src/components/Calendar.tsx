import CalendarEventPositioned, {
  EventReadonly,
} from "./CalendarEventPositioned";
import {
  CalendarConfig,
  CalendarContext,
  defaultConfig,
} from "../hooks/useCalendar";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";
import usePositionedCalendarEvents from "../hooks/usePositionedCalendarEvents";
import { format } from "date-fns";
import Header from "./Header";
import { convertToTimeString } from "../utils/dates";
import {
  getDateFromEvent,
  getLeftPixels,
  getTopPixels,
} from "../utils/calendar";
import useCalendar from "../hooks/useCalendar";
import { useEffect, useMemo } from "react";

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
    <div className="flex h-full w-full flex-col">
      <Header calendarContext={calendarContext} />
      <div
        className="isolate z-0 overflow-auto rounded-bl-lg rounded-br-lg bg-slate-100"
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
            <CurrentTime context={calendarContext} />
          </div>
        </div>
      </div>
    </div>
  );
};

type CurrentTimeProps = {
  context: CalendarContext;
};
const CurrentTime = ({ context }: CurrentTimeProps) => {
  // have columnWidth
  // fixed height
  // Reuse logic calculating event top & left position
  // if current time is not in range of calendar time, dont show anything
  // TODO: useEffect set timer to refresh
  const [left, top, width] = useMemo(() => {
    const now = new Date();
    const topPx = getTopPixels(now, context);
    const leftPx = getLeftPixels(
      now,
      context.calendarInternals.columns,
      context.calendarInternals.columnWidth,
    );
    return [leftPx, topPx, context.calendarInternals.columnWidth];
  }, [context]);

  console.log("val: ", top, left, width);
  return (
    <div style={{ top, left, width }} className="absolute h-[2px] bg-red-500">
      <div className="absolute right-[0px] top-[-3px] h-[8px] w-[8px] rounded-full bg-red-500"></div>
    </div>
  );
};

export default Calendar;

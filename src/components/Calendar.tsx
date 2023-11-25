import CalendarEventPositioned from "./CalendarEventPositioned";
import CalendarGridUI from "./CalendarGridUI";
import useCalendarInternals from "../hooks/useCalendarInternals";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";
import usePositionedCalendarEvents from "../hooks/usePositionedCalendarEvents";
import { PropsWithChildren } from "react";
import { da } from "date-fns/locale";
import { format } from "date-fns";

// export type CalendarConfig = {
//   calendarView: "WEEK" | "DAY";
// };

// const defaultConfig: CalendarConfig = {
//   calendarView: "WEEK",
// };

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
      {/* 
        Header
      */}
      <div className="flex h-[48px] flex-row border-b-[1px]">
        <div className="h-[48px] w-[96px]"></div>
        {calendarInternals.columns.map((column) => (
          <div className="flex h-[48px] flex-1 items-center justify-center">
            {format(column.date, "eee MMMM do", { locale: da })}
          </div>
        ))}
      </div>
      <div className="overflow-auto" ref={calendarInternals.scrollRef}>
        <div className="flex flex-row">
          {/* time column */}
          <div className="w-[96px]">
            {arrayFromNumber(24).map((time) => (
              <div className="flex h-[48px] w-full items-center justify-center border-b-[1px] border-r-[1px] border-solid">
                {time}
              </div>
            ))}
          </div>
          {/* events column */}
          <div className="relative flex flex-1 overflow-hidden">
            {/* Visual layout */}
            {calendarInternals.columns.map((column) => (
              <div className="w-full">
                {arrayFromNumber(24).map(() => (
                  <div className="h-[48px] w-full border-b-[1px] border-l-[1px] border-solid"></div>
                ))}
              </div>
            ))}
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
    </div>
  );
};

export default Calendar;

const arrayFromNumber = (count: number) => {
  let arr = [...Array(count)].map((_, i) => i);
  return arr;
};

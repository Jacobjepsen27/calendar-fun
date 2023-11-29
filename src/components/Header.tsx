import { format } from "date-fns";
import { CalendarContext, CalendarInternals } from "../hooks/useCalendar";
import { CalendarControlResult } from "../hooks/useCalendarControls";
import { ComponentPropsWithoutRef } from "react";
import Chevron from "../icons/Chevron";
import Clock from "../icons/Clock";

type HeaderProps = {
  calendarContext: CalendarContext;
};
const Header = ({ calendarContext }: HeaderProps) => {
  const { calendarControls, calendarInternals } = calendarContext;
  const { state, dispatch } = calendarControls;
  return (
    <div className="isolate z-10 flex flex-col shadow-md">
      <div className="flex flex-row items-center justify-between p-4">
        <div className="flex overflow-hidden rounded">
          <button
            onClick={() => dispatch({ type: "view", payload: "WEEK" })}
            type="button"
            className={`bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 ${
              state.view === "WEEK" ? "bg-blue-700" : "bg-blue-500"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => dispatch({ type: "view", payload: "DAY" })}
            type="button"
            className={`bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 ${
              state.view === "DAY" ? "bg-blue-700 " : "bg-blue-500"
            }`}
          >
            Day
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => dispatch({ type: "prev" })}
            type="button"
            className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Chevron direction="left" />
          </button>
          <button
            onClick={() => dispatch({ type: "today" })}
            type="button"
            className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            Today
          </button>
          <button
            onClick={() => dispatch({ type: "next" })}
            type="button"
            className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Chevron direction="right" />
          </button>
        </div>
      </div>
      <div className="flex flex-row py-2">
        <div className="flex w-[96px] justify-center">
          <Clock />
        </div>
        {calendarInternals.columns.map((column) => (
          <div
            key={column.index}
            className="flex flex-1 items-center justify-center"
          >
            <p className="text-xs font-bold">
              {format(column.date, "E MMMM do")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;

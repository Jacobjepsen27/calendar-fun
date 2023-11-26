import { format } from "date-fns";
import { CalendarInternals } from "../hooks/useCalendarInternals";
import { da } from "date-fns/locale";
import { CalendarControlState } from "../hooks/useCalendarControls";

type HeaderProps = {
  calendarInternals: CalendarInternals;
  next: () => void;
  prev: () => void;
  today: () => void;
  onViewChange: (view: "WEEK" | "DAY") => void;
  calendarControlState: CalendarControlState;
};
const Header = ({
  calendarInternals,
  calendarControlState,
  ...actions
}: HeaderProps) => {
  return (
    <div className="flex flex-col border-b-[1px]">
      <div className="flex h-[48px] flex-row items-center justify-between">
        <div className="flex overflow-hidden rounded">
          <button
            onClick={() => actions.onViewChange("WEEK")}
            type="button"
            className={`bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 ${
              calendarControlState.view === "WEEK"
                ? "bg-blue-700"
                : "bg-blue-500"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => actions.onViewChange("DAY")}
            type="button"
            className={`bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 ${
              calendarControlState.view === "DAY"
                ? "bg-blue-700 "
                : "bg-blue-500"
            }`}
          >
            Day
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={actions.prev}
            type="button"
            className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            &lt;
          </button>
          <button
            onClick={actions.today}
            type="button"
            className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            Today
          </button>
          <button
            onClick={actions.next}
            type="button"
            className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
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
            <p className="text-xs">
              {format(column.date, "iii MMMM do", { locale: da })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;

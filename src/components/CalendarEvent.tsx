import { MouseEventHandler } from "react";
import { CalendarEventViewModel } from "../hooks/useEvents";
import { format } from "date-fns";

type CalendarEventProps = {
  event: CalendarEventViewModel;
  onClick: MouseEventHandler;
};
const CalendarEvent = ({ event, onClick }: CalendarEventProps) => {
  // Ideally this should only be responsible for showing data and acting as a button
  return (
    <button
      onClick={onClick}
      className="h-full w-full rounded-md bg-sky-300 p-2"
    >
      <div className="flex h-full flex-col items-start justify-start">
        <p className="text-xs font-medium">{event.name}</p>
        <p className="text-xs">
          {format(event.from, "HH:mm")} - {format(event.to, "HH:mm")}
        </p>
      </div>
    </button>
  );
};

export default CalendarEvent;

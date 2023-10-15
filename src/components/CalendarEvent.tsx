import { MouseEventHandler } from "react";
import { CalendarEventViewModel } from "../hooks/useEvents";
import { format } from "date-fns";

type CalendarEventProps = {
  event: CalendarEventViewModel;
};
const CalendarEvent = ({ event }: CalendarEventProps) => {
  // Ideally this should only be responsible for showing data and acting as a button
  return (
    <div className="h-full w-full p-2">
      <div className="flex h-full flex-col items-start justify-start">
        <p className="text-xs font-medium">{event.name}</p>
        <p className="text-xs">
          {format(event.from, "HH:mm")} - {format(event.to, "HH:mm")}
        </p>
      </div>
    </div>
  );
};

export default CalendarEvent;

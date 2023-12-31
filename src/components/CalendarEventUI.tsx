import { format } from "date-fns";
import { PositionedCalendarEvent } from "../models/models";

type CalendarEventUIProps = {
  event: PositionedCalendarEvent;
};
const CalendarEventUI = ({ event }: CalendarEventUIProps) => {
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

export default CalendarEventUI;

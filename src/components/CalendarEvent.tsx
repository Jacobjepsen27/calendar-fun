import { MouseEventHandler } from "react";
import { CalendarEventViewModel } from "../hooks/useEvents";

type CalendarEventProps = {
  event: CalendarEventViewModel;
  onClick: MouseEventHandler;
};
const CalendarEvent = ({ event, onClick }: CalendarEventProps) => {
  // Ideally this should only be responsible for showing data and acting as a button
  return (
    <button onClick={onClick} className="h-full w-full bg-green-500">
      {event.name}
    </button>
  );
};

export default CalendarEvent;

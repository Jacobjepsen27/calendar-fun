import { CalendarEventViewModel } from "../hooks/useEvents";

type CalendarEventProps = {
  event: CalendarEventViewModel;
};
const CalendarEvent = ({ event }: CalendarEventProps) => {
  // Ideally this should only be responsible for showing data and acting as a button
  return (
    <button
      onClick={() => console.log("clicked event ", event.id)}
      className="h-full w-full bg-green-500"
    >
      {event.name}
    </button>
  );
};

export default CalendarEvent;

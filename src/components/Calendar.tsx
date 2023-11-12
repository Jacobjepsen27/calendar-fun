import { CalendarEvent } from "../hooks/useEvents";
import CalendarEventPositioned from "./CalendarEventPositioned";
import CalendarGridUI from "./CalendarGridUI";
import CalendarProvider, {
  useCalendarContext,
} from "../context/CalendarProvider";

/* -------------- Internal Calendar below -------------- */
const InternalCalendar = () => {
  const { eventViewModels, ref, onCalendarClick } = useCalendarContext();

  return (
    <div className="flex h-full w-full flex-col border ">
      <div className="border border-black">Monday - sunday</div>
      <div className="overflow-auto">
        <div className="relative flex overflow-hidden">
          <CalendarGridUI />
          {/* <div className="absolute inset-0 isolate">placeholder UI</div> */}
          {/* Events UI */}
          <div
            ref={ref}
            className="absolute inset-0 isolate"
            onClick={onCalendarClick}
          >
            {eventViewModels.map((eventViewModel) => (
              <CalendarEventPositioned
                key={eventViewModel.id}
                eventViewModel={eventViewModel}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------- Calendar below -------------- */

type CalendarProps = {
  events: CalendarEvent[];
  onUpdateEvent: (event: CalendarEvent) => void;
};
const Calendar = ({ events, onUpdateEvent }: CalendarProps) => {
  return (
    <CalendarProvider eventsData={events} updateEvent={onUpdateEvent}>
      <InternalCalendar />
    </CalendarProvider>
  );
};

export default Calendar;

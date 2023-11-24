import CalendarEventPositioned from "./CalendarEventPositioned";
import CalendarGridUI from "./CalendarGridUI";
import useCalendarInternals from "../hooks/useCalendarInternals";
import { CalendarEvent, PositionedCalendarEvent } from "../models/models";
import usePositionedCalendarEvents from "../hooks/usePositionedCalendarEvents";

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

  // const { onPan, onPanEnd, onResize, onResizeEnd, onCalendarClick } =
  //   useInteractiveHandlers(calendarInternals, viewModels);

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

  // const handlePanEnd = (
  //   eventId: string,
  //   event: PointerEvent,
  //   cursorOffsetY: number,
  // ): void => {
  //   const updatedViewModel = onPanEnd(eventId, event, cursorOffsetY);
  //   // Consumer should know something updated
  //   onUpdateEvent({
  //     id: updatedViewModel.id,
  //     name: updatedViewModel.name,
  //     from: updatedViewModel.from,
  //     to: updatedViewModel.to,
  //   });
  // };

  // const handleResizeEnd = (eventId: string, offsetY: number) => {
  //   const updatedViewModel = onResizeEnd(eventId, offsetY);
  //   // Consumer should know something updated
  //   onUpdateEvent({
  //     id: updatedViewModel.id,
  //     name: updatedViewModel.name,
  //     from: updatedViewModel.from,
  //     to: updatedViewModel.to,
  //   });
  // };

  return (
    <div className="flex h-full w-full flex-col border ">
      <div className="border border-black">Monday - sunday</div>
      <div className="overflow-auto" ref={calendarInternals.scrollRef}>
        <div className="relative flex overflow-hidden">
          <CalendarGridUI columns={7} rows={24} />
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
  );
};

export default Calendar;

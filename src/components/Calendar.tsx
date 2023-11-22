import { CalendarEvent } from "../hooks/useEvents";
import CalendarEventPositioned from "./CalendarEventPositioned";
import CalendarGridUI from "./CalendarGridUI";
import useCalendarInternals from "../hooks/useCalendarInternals";
import useViewModels from "../hooks/useViewModels";
import useInteractiveHandlers from "../hooks/useInteractiveHandlers";

type CalendarProps = {
  events: CalendarEvent[];
  onUpdateEvent: (event: CalendarEvent) => void;
};
const Calendar = ({ events, onUpdateEvent }: CalendarProps) => {
  const calendarInternals = useCalendarInternals();
  const { viewModels } = useViewModels(calendarInternals, events);
  const { onPan, onPanEnd, onResize, onResizeEnd, onCalendarClick } =
    useInteractiveHandlers(calendarInternals, viewModels);

  const handlePanEnd = (
    eventId: string,
    event: PointerEvent,
    cursorOffsetY: number,
  ): void => {
    const updatedViewModel = onPanEnd(eventId, event, cursorOffsetY);
    onUpdateEvent({
      id: updatedViewModel.id,
      name: updatedViewModel.name,
      from: updatedViewModel.from,
      to: updatedViewModel.to,
    });
  };

  const handleResizeEnd = (eventId: string, offsetY: number) => {
    const updatedViewModel = onResizeEnd(eventId, offsetY);
    onUpdateEvent({
      id: updatedViewModel.id,
      name: updatedViewModel.name,
      from: updatedViewModel.from,
      to: updatedViewModel.to,
    });
  };

  return (
    <div className="flex h-full w-full flex-col border ">
      <div className="border border-black">Monday - sunday</div>
      <div className="overflow-auto" ref={calendarInternals.scrollRef}>
        <div className="relative flex overflow-hidden">
          <CalendarGridUI columns={7} rows={24} />
          {/* <div className="absolute inset-0 isolate">placeholder UI</div> */}
          {/* Events UI */}
          <div
            ref={calendarInternals.calendarRef}
            className="absolute inset-0 isolate"
            onClick={(e) => console.log(onCalendarClick(e))}
          >
            {viewModels.map((viewModel) => (
              <CalendarEventPositioned
                key={viewModel.id}
                viewModel={viewModel}
                onPan={onPan}
                onPanEnd={handlePanEnd}
                onResize={onResize}
                onResizeEnd={handleResizeEnd}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

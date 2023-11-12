import useEvents from "../hooks/useEvents";
import Calendar from "./Calendar";

export type DateColumn = {
  index: number;
  date: Date;
};

const BookingPage = () => {
  const { events, updateEvent } = useEvents();
  return (
    <div className="flex h-[100%] items-center justify-center">
      <div className="h-[90%] max-h-[900px] w-[90%]">
        <Calendar events={events} onUpdateEvent={updateEvent} />
      </div>
    </div>
  );
};

export default BookingPage;

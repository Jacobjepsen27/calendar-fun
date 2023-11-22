import { set } from "date-fns";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { getWeekDatesFromDate } from "../utils/dates";
import { CalendarEvent } from "../models/models";

const useEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(generateEventData());

  const updateEvent = (event: CalendarEvent) => {
    let updatedList = events.filter((e) => e.id !== event.id);
    updatedList.push(event);
    setEvents(updatedList);
  };
  return { events, updateEvent };
};

export default useEvents;

const generateEventData = (): CalendarEvent[] => {
  const today = new Date();
  const dates = getWeekDatesFromDate(today);

  const monday = dates[0];
  const tuesday = dates[1];
  const thursday = dates[3];

  return [
    {
      id: uuid().toString(),
      name: "Event 1 (Mon)",
      from: set(new Date(2023, monday.getMonth(), monday.getDate()), {
        hours: 7,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      to: set(new Date(2023, monday.getMonth(), monday.getDate()), {
        hours: 8,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
    {
      id: uuid().toString(),
      name: "Event 2 (Tue)",
      from: set(new Date(2023, tuesday.getMonth(), tuesday.getDate()), {
        hours: 9,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      to: set(new Date(2023, tuesday.getMonth(), tuesday.getDate()), {
        hours: 11,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
    {
      id: uuid().toString(),
      name: "Event 3 (Thu)",
      from: set(new Date(2023, thursday.getMonth(), thursday.getDate()), {
        hours: 20,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      to: set(new Date(2023, thursday.getMonth(), thursday.getDate()), {
        hours: 24,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
  ];
};

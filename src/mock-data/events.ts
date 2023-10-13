import { set } from "date-fns";
import { Event } from "../components/BookingPage";
import { v4 as uuid } from "uuid";

export const EVENTS_DATA: Event[] = [
    {
      id: uuid().toString(),
      name: "Event 1",
      from: set(new Date(2023, 9, 9), {
        hours: 7,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      to: set(new Date(2023, 9, 9), {
        hours: 8,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
    {
      id: uuid().toString(),
      name: "Event 2",
      from: set(new Date(2023, 9, 11), {
        hours: 9,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      to: set(new Date(2023, 9, 11), {
        hours: 11,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
    {
      id: uuid().toString(),
      name: "Event 3",
      from: set(new Date(2023, 9, 12), {
        hours: 20,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      to: set(new Date(2023, 9, 12), {
        hours: 24,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
  ];
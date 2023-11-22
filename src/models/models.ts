export type CalendarEvent = {
  id: string;
  name: string;
  from: Date;
  to: Date;
};

export type CalendarEventViewModel = CalendarEvent & {
  left: number;
  top: number;
  width: number;
  height: number;
};

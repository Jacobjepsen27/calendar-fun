export type CalendarEvent = {
  id: string;
  name: string;
  from: Date;
  to: Date;
};

export type PositionedCalendarEvent = CalendarEvent & {
  left: number;
  top: number;
  width: number;
  height: number;
  transformX: number;
  transformY: number;
};

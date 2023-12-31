import { addDays, startOfDay, subDays } from "date-fns";
import { useReducer } from "react";

export type CalendarControlState = {
  date: Date;
  view: "WEEK" | "DAY";
};

type CalendarControlAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "today" }
  | { type: "view"; payload: CalendarControlState["view"] };

const reducer = (
  state: CalendarControlState,
  action: CalendarControlAction,
): CalendarControlState => {
  switch (action.type) {
    case "next":
      return {
        ...state,
        date:
          state.view === "WEEK"
            ? addDays(state.date, 7)
            : addDays(state.date, 1),
      };
    case "prev":
      return {
        ...state,
        date:
          state.view === "WEEK"
            ? subDays(state.date, 7)
            : subDays(state.date, 1),
      };
    case "today":
      return {
        ...state,
        date: startOfDay(new Date()),
      };
    case "view":
      return {
        ...state,
        view: action.payload,
      };
  }
};
export type CalendarControlResult = ReturnType<typeof useCalendarControls>;

export const useCalendarControls = (
  initialData: CalendarControlState = {
    date: startOfDay(new Date()),
    view: "WEEK",
  },
) => {
  const [state, dispatch] = useReducer(reducer, initialData);
  return { state, dispatch };
};

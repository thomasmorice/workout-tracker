import { inferRouterOutputs } from "@trpc/server";
import { create } from "zustand";
import { EventRouterType } from "../server/trpc/router/event-router";

type EventType = "weighing" | "workout-session";

interface AddOrEditEventProps {
  type: EventType;
  eventId?: inferRouterOutputs<EventRouterType>["getEvents"][number]["id"];
  date?: Date;
}
interface EventState {
  showFormWithEventType?: EventType;
  eventDate?: Date;
  closeForm: () => void;
  eventBeingEdited?: inferRouterOutputs<EventRouterType>["getEvents"][number]["id"];
  addOrEditEvent: ({ type, eventId, date }: AddOrEditEventProps) => void;
}

const useEventStore = create<EventState>()((set, get) => ({
  addOrEditEvent: ({ type, eventId, date }) => {
    set({
      showFormWithEventType: type,
      eventBeingEdited: eventId,
      eventDate: date,
    });
  },
  closeForm: () => {
    set({
      showFormWithEventType: undefined,
      eventBeingEdited: undefined,
    });
  },
}));

export { useEventStore };

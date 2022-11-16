import create from "zustand";
import { InferQueryOutput } from "../types/trpc";

type EventType = "weighting" | "workout-session";

interface AddOrEditEventProps {
  type: EventType;
  eventId?: InferQueryOutput<"event.get-events">[number]["id"];
  date?: Date;
}
interface EventState {
  eventTypeToEdit?: EventType;
  eventDate?: Date;
  closeForm: () => void;
  eventBeingEdited?: InferQueryOutput<"event.get-events">[number]["id"];
  addOrEditEvent: ({ type, eventId, date }: AddOrEditEventProps) => void;
}

const useEventStore = create<EventState>()((set, get) => ({
  addOrEditEvent: ({ type, eventId, date }) => {
    set({
      eventTypeToEdit: type,
      eventBeingEdited: eventId,
      eventDate: date,
    });
  },
  closeForm: () => {
    set({
      eventTypeToEdit: undefined,
      eventBeingEdited: undefined,
    });
  },
}));

export { useEventStore };

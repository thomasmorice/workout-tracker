import create from "zustand";
import { InferQueryOutput } from "../types/trpc";

type EventType = InferQueryOutput<"event.get-events">[number];

interface EventState {
  eventFormState?:
    | "add-session"
    | "edit-session"
    | "add-weighing"
    | "edit-weighing";
  openWeighingForm: (existingWeighing?: EventType["weighing"]) => void;
  openSessionForm: (existingSession?: EventType["workoutSession"]) => void;
  closeForm: () => void;
  weighingBeingEdited?: EventType["weighing"];
  sessionBeingEdited?:
    | EventType["workoutSession"]
    | InferQueryOutput<"workout-session.get-workout-session-by-id">;
}

const useEventStore = create<EventState>()((set, get) => ({
  openWeighingForm: (weighing) => {
    if (!weighing) {
      set({
        eventFormState: "add-weighing",
      });
    } else {
      set({
        eventFormState: "edit-weighing",
        weighingBeingEdited: weighing,
      });
    }
  },
  openSessionForm: (session) => {
    if (!session) {
      set({
        eventFormState: "add-session",
      });
    } else {
      set({
        eventFormState: "edit-session",
        sessionBeingEdited: session,
      });
    }
  },
  closeForm: () => {
    set({
      eventFormState: undefined,
      weighingBeingEdited: undefined,
      sessionBeingEdited: undefined,
    });
  },
}));

export { useEventStore };
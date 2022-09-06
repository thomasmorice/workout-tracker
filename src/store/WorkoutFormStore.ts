import { TRPCError } from "@trpc/server";
import create from "zustand";
import { InferQueryOutput } from "../types/trpc";
import { useToastStore } from "./ToastStore";

type StateType = "create" | "duplicate" | "edit" | "delete";

interface WorkoutFormState {
  state?: StateType;
  workout?: InferQueryOutput<"workout.get-infinite-workouts">["workouts"][number];
  showWorkoutForm: (
    state: StateType,
    existingWorkout?: InferQueryOutput<"workout.get-infinite-workouts">["workouts"][number]
  ) => void;
  handleWorkoutFormError: (e: TRPCError) => void;
  closeWorkoutForm: () => void;
}

const useWorkoutFormStore = create<WorkoutFormState>()((set, get) => ({
  showWorkoutForm: (state, workout) => {
    if (state !== "create" && !workout) {
      console.error(
        `The state ${state} needs a workout to be able to show the form probably`
      );
    } else {
      set({
        state: state,
        workout: workout,
      });
    }
  },
  handleWorkoutFormError: (e: TRPCError) => {
    const { addMessage } = useToastStore.getState();
    if (
      e.message.includes(
        "Unique constraint failed on the fields: (`description`)"
      )
    ) {
      addMessage({
        type: "error",
        message: "A workout with this description already exists",
        closeAfter: 7000,
      });
    } else {
      addMessage({
        type: "error",
        message: e.message,
        closeAfter: 7000,
      });
    }
  },
  closeWorkoutForm: () => {
    set({
      state: undefined,
      workout: undefined,
    });
  },
}));

export { useWorkoutFormStore };

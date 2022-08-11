import create from "zustand";
import { WorkoutWithExtras } from "../server/router/workout";

type StateType = "create" | "duplicate" | "edit" | "delete";

interface WorkoutFormState {
  state?: StateType;
  workout?: WorkoutWithExtras;
  showWorkoutForm: (
    state: StateType,
    existingWorkout?: WorkoutWithExtras
  ) => void;
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
  closeWorkoutForm: () => {
    set({
      state: undefined,
      workout: undefined,
    });
  },
}));

export { useWorkoutFormStore };

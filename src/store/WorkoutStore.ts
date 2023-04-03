import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { create } from "zustand";
import { WorkoutRouterType } from "../server/trpc/router/WorkoutRouter/workout-router";
import { useToastStore } from "./ToastStore";

type StateType = "create" | "duplicate" | "edit" | "delete";
type WorkoutType =
  | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
  | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];

interface WorkoutFormState {
  state?: StateType;
  workout?: WorkoutType;
  isWorkoutSelectionModeActive: boolean;
  openWorkoutDetail: (workout: WorkoutType) => void;
  openedWorkoutDetail?: WorkoutType;
  closeWorkoutDetail: () => void;
  selectedWorkouts: WorkoutType[];
  toggleSelectWorkout: (workout: WorkoutType) => void;
  clearSelectedWorkouts: () => void;
  setWorkoutSelectionMode: (isSelectionModActive: boolean) => void;
  showWorkoutForm: (state: StateType, existingWorkout?: WorkoutType) => void;
  handleWorkoutFormError: (e: TRPCError) => void;
  closeWorkoutForm: () => void;
}

const useWorkoutStore = create<WorkoutFormState>()((set, get) => ({
  isWorkoutSelectionModeActive: false,
  setWorkoutSelectionMode: (isSelectionModActive) => {
    set({
      isWorkoutSelectionModeActive: isSelectionModActive,
    });
  },
  openWorkoutDetail: (workout) => {
    set({
      openedWorkoutDetail: workout,
    });
  },
  closeWorkoutDetail: () => {
    set({
      openedWorkoutDetail: undefined,
    });
  },
  selectedWorkouts: [],
  toggleSelectWorkout: (workout) => {
    const { selectedWorkouts } = get();

    if (selectedWorkouts.find((w) => w.id === workout.id)) {
      set({
        selectedWorkouts: selectedWorkouts.filter((w) => w.id !== workout.id),
      });
    } else {
      // selecting a workout
      set({
        selectedWorkouts: [...selectedWorkouts, workout],
        isWorkoutSelectionModeActive: true,
      });
    }
  },
  clearSelectedWorkouts: () => {
    set({
      selectedWorkouts: [],
      isWorkoutSelectionModeActive: false,
    });
  },
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
      console.log("message", e.message);
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

export { useWorkoutStore };

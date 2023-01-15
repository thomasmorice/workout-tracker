import { inferRouterOutputs, TRPCError } from "@trpc/server";
import create from "zustand";
import { WorkoutRouterType } from "../server/trpc/router/workout-router";

type workoutType =
  inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];

interface FloatingActionButtonState {
  hasSelection: () => boolean;
  isSelected: (workout: workoutType) => boolean;
  selectedWorkouts: workoutType[];
  toggleSelectWorkout: (workout: workoutType) => void;
  cleanSelectedWorkouts: () => void;
}

const useFloatingActionButtonStore = create<FloatingActionButtonState>()(
  (set, get) => ({
    isSelected: (workout) => {
      const { selectedWorkouts } = get();
      return !!selectedWorkouts.find((w) => w.id === workout.id);
    },
    hasSelection: () => {
      const { selectedWorkouts } = get();
      return selectedWorkouts.length > 0;
    },
    selectedWorkouts: [],
    toggleSelectWorkout: (workout) => {
      const { selectedWorkouts } = get();
      if (selectedWorkouts.find((w) => w.id === workout.id)) {
        set({
          selectedWorkouts: selectedWorkouts.filter((w) => w.id !== workout.id),
        });
      } else {
        navigator.vibrate(50);
        set({
          selectedWorkouts: [...selectedWorkouts, workout],
        });
      }
    },
    cleanSelectedWorkouts: () => {
      set({
        selectedWorkouts: [],
      });
    },
  })
);

export { useFloatingActionButtonStore };

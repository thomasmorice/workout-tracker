import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { create } from "zustand";
import { WorkoutRouterType } from "../server/trpc/router/workout-router";

type workoutType =
  inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];

interface FloatingActionButtonState {
  // hasSelection: () => boolean;
  // isSelected: (workout: workoutType) => boolean;
}

const useFloatingActionButtonStore = create<FloatingActionButtonState>()(
  (set, get) => ({
    // isSelected: (workout) => {
    //   const { selectedWorkouts } = get();
    //   return !!selectedWorkouts.find((w) => w.id === workout.id);
    // },
    // hasSelection: () => {
    //   const { selectedWorkouts } = get();
    //   return selectedWorkouts.length > 0;
    // },
  })
);

export { useFloatingActionButtonStore };

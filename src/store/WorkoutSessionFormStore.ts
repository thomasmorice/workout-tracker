import create from "zustand";
import { WorkoutSession } from "../server/router/workout-session";

interface WorkoutSessionFormState {
  state?: "create" | "edit";
  session?: WorkoutSession;
}

const useWorkoutSessionFormStore = create<WorkoutSessionFormState>()(
  (set, get) => ({
    state: "create",
  })
);

export { useWorkoutSessionFormStore };

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
  createWorkoutFromSelectedText: (
    workout: WorkoutType,
    selectedText: string
  ) => void;
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
  createWorkoutFromSelectedText: (workout, selectedText) => {
    let timecap = null;
    const isEmom = selectedText.match(/(\d+)\s*x\s*E(\d+)([\.,]\d+)M/);
    const isEmomWithSeconds = selectedText.match(/(\d+)\s*x\s*E(\d+)s/);
    const hasTimecap = selectedText.match(/(\d+)\s*(m[ni]n)/);
    if (isEmom && isEmom[1] && isEmom[2]) {
      timecap = parseInt(isEmom[1], 10) * parseInt(isEmom[2], 10);
    } else if (
      isEmomWithSeconds &&
      isEmomWithSeconds[1] &&
      isEmomWithSeconds[2]
    ) {
      timecap =
        parseInt(isEmomWithSeconds[1], 10) *
        (parseInt(isEmomWithSeconds[2], 10) / 60);
    }
    {
      if (hasTimecap && hasTimecap[1]) {
        timecap = parseInt(hasTimecap[1], 10);
      }
    }

    get().showWorkoutForm("duplicate", {
      ...workout,

      description: selectedText,
      ...(selectedText.includes("STRENGTH") && {
        elementType: "STRENGTH",
      }),
      ...(selectedText.includes("TEAM") && {
        elementType: "TEAMWOD",
      }),

      ...(selectedText.includes("A.") && {
        elementType: "STRENGTH_OR_SKILLS",
        description: selectedText.replace(/^A\.\s*/, ""),
      }),
      ...(selectedText.includes("B.") && {
        elementType: "WOD",
        description: selectedText.replace(/^B\.\s*/, ""),
      }),
      ...(/INTENSE MOBILITY/i.test(selectedText) && {
        elementType: "INTENSE_MOBILITY",
        description: selectedText.replace(/^INTENSE MOBILITY\.\s*/, ""),
      }),
      ...(/AMRAP/i.test(selectedText) && {
        workoutType: "AMRAP",
      }),
      ...(/FORTIME/i.test(selectedText) && {
        workoutType: "FOR_TIME",
      }),

      ...(isEmom && {
        workoutType: "EMOM",
      }),

      totalTime: timecap,
    });
  },
}));

export { useWorkoutStore };

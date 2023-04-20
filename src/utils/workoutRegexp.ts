import { Workout, ElementType } from "@prisma/client";
import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../server/trpc/router/WorkoutRouter/workout-router";

// export const WorkoutElementsSeparatorRegexp = /[A-Z]\./;
export const WorkoutElementsSeparatorRegexp = /\r\n\r\n/;
type WorkoutType =
  | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
  | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];

export function parseWorkout(undefinedWorkout: WorkoutType) {
  const arrayOfUnclassifiedWorkouts = undefinedWorkout.description.split(
    WorkoutElementsSeparatorRegexp
  );
  let type: ElementType = "UNCLASSIFIED";
  const workouts: Omit<WorkoutType, "id">[] = arrayOfUnclassifiedWorkouts.map(
    (unclassifiedWorkout, index) => {
      if (/STRENGTH/.test(unclassifiedWorkout)) {
        type = "STRENGTH";
      } else if (/CARDIO|ENDURANCE/.test(unclassifiedWorkout)) {
        type = "ENDURANCE";
      }

      return {
        ...undefinedWorkout,
        id: undefined,
        // ...(/CARDIO|ENDURANCE/.test(unclassifiedWorkout) && {
        //   elementType: "ENDURANCE",
        // }),
        // ...(/STRENGTH/.test(unclassifiedWorkout) && {
        //   elementType: "ENDURANCE",
        // }),
        elementType: type,
        ...(index === 0 && { elementType: "STRENGTH_OR_SKILLS" }),
        ...(index === 1 && { elementType: "WOD" }),
        description: unclassifiedWorkout,
      };
    }
  );
  return workouts;
}

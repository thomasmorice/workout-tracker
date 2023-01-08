import { inferRouterOutputs } from "@trpc/server";
import { AiFillThunderbolt } from "react-icons/ai";
import { GiBiceps, GiWeightLiftingUp } from "react-icons/gi";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { MdHourglassTop, MdPeople } from "react-icons/md";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { enumToString } from "../../../utils/formatting";

interface WorkoutCardProps {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
}

export default function WorkoutCardBadges({ workout }: WorkoutCardProps) {
  return (
    <div className="badges flex flex-wrap gap-1.5">
      {workout.difficulty && (
        <div
          className={`badge border-${workout.difficulty.toLowerCase()}-700 bg-${workout.difficulty.toLowerCase()}-700 text-${workout.difficulty.toLowerCase()}-300
    ${
      workout.difficulty === "BLACK"
        ? "border-base-content border-opacity-50 bg-black"
        : "border-opacity-30 bg-opacity-20"
    }`}
        >
          {workout.difficulty}
        </div>
      )}

      {workout.elementType && (
        <div className={`badge items-center gap-1.5`}>
          {enumToString(workout.elementType).includes("STRENGTH") && (
            <GiBiceps size={14} />
          )}
          {enumToString(workout.elementType).includes("UNCLASSIFIED") && (
            <HiQuestionMarkCircle size={14} />
          )}

          {enumToString(workout.elementType).includes("WOD") && (
            <AiFillThunderbolt size={14} />
          )}

          {enumToString(workout.elementType).includes("TEAMWOD") && (
            <MdPeople size={14} />
          )}

          {enumToString(workout.elementType).includes("ENDURANCE") && (
            <MdHourglassTop size={14} />
          )}

          {enumToString(workout.elementType).includes("WEIGHTLIFTING") && (
            <GiWeightLiftingUp size={14} />
          )}

          {enumToString(workout.elementType)}
        </div>
      )}

      {workout.workoutType && (
        <div className={`badge items-center gap-1.5`}>
          {enumToString(workout.workoutType)}
        </div>
      )}

      {workout.isDoableAtHome && (
        <div className={`badge-secondary badge-outline badge`}>
          Doable at home
        </div>
      )}

      {workout.totalTime && (
        <div className={`badge`}>{workout.totalTime}MN</div>
      )}
    </div>
  );
}

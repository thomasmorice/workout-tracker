import { inferRouterOutputs } from "@trpc/server";
import { BsLightningChargeFill } from "react-icons/bs";
import { GiBiceps } from "react-icons/gi";
import { MdDone, MdOutlineTimelapse } from "react-icons/md";
import { WiMoonNew } from "react-icons/wi";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { enumToString } from "../../../utils/formatting";

type WorkoutCardBadgesProps = {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
};

export default function WorkoutCardBadges({ workout }: WorkoutCardBadgesProps) {
  return (
    <div className="flex flex-wrap gap-x-1 gap-y-2">
      <div className="badge gap-1 lowercase">
        {workout.elementType.includes("WOD") && (
          <BsLightningChargeFill size={13} />
        )}

        {workout.elementType.includes("STRENGTH") && <GiBiceps size={13} />}
        {enumToString(workout.elementType)}
      </div>
      {workout.difficulty && (
        <div className={`badge items-center gap-1 lowercase`}>
          <div
            className={`h-2 w-2 rounded-full ${
              workout.difficulty === "BLACK"
                ? "border border-primary-content bg-black"
                : `bg-${workout.difficulty.toLowerCase()}-500`
            }`}
          ></div>
          {workout.difficulty}
        </div>
      )}

      {workout.totalTime && (
        <div className="badge items-center gap-0.5">
          <MdOutlineTimelapse size={13} />
          {workout.totalTime}mn
        </div>
      )}
      {workout._count.workoutResults > 0 ? (
        <div className="badge flex gap-0.5">
          <MdDone className="" size={15} />
          {workout._count.workoutResults} result
        </div>
      ) : (
        <div className="badge flex gap-0.5">
          <WiMoonNew className="" size={15} />
          no result
        </div>
      )}
    </div>
  );
}

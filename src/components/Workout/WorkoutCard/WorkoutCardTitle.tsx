import { inferRouterOutputs } from "@trpc/server";
import { BsLightningChargeFill } from "react-icons/bs";
import { GiBiceps } from "react-icons/gi";
import { FaRunning } from "react-icons/fa";
import { WorkoutRouterType } from "../../../server/trpc/router/WorkoutRouter/workout-router";
import { enumToString } from "../../../utils/formatting";
import { AiFillTag } from "react-icons/ai";

type WorkoutCardTitleProps = {
  isFullScreen: boolean;
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];
};

export default function WorkoutCardTitle({
  workout,
  isFullScreen,
}: WorkoutCardTitleProps) {
  return (
    <div
      className={`
        flex flex-col items-center font-bold
        ${isFullScreen ? "mt-5" : "mt-3"}
      `}
    >
      <div
        className={`
        flex items-center gap-1.5 text-center  font-semibold tracking-[0.03rem]
        ${isFullScreen ? "text-lg" : "text-base"}
        `}
      >
        {workout.name ? (
          <>
            <AiFillTag size={14} />
            <div className="text-base uppercase">{workout.name}</div>
          </>
        ) : (
          <>
            {workout.elementType.includes("STRENGTH") && <GiBiceps size={14} />}
            {workout.elementType.includes("WOD") && (
              <BsLightningChargeFill size={14} />
            )}
            {workout.elementType.includes("ENDURANCE") && (
              <FaRunning size={14} />
            )}
            {enumToString(workout.elementType)}
          </>
        )}
      </div>
      {workout.workoutType && (
        <div
          className={`
        flex items-center  font-bold tracking-[0.15rem]
        ${isFullScreen ? "text-base" : "text-sm"}
      `}
        >
          [{enumToString(workout.workoutType)}]
        </div>
      )}
    </div>
  );
}

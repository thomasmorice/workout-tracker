import { inferRouterOutputs } from "@trpc/server";
import { format, intervalToDuration } from "date-fns";
import { MdStar } from "react-icons/md";
import { WorkoutResultRouterType } from "../../../server/trpc/router/workout-result-router";
import { WorkoutSessionRouterType } from "../../../server/trpc/router/workout-session-router";
import { WorkoutRouterType } from "../../../server/trpc/router/WorkoutRouter/workout-router";
import { WorkoutResultInputsWithWorkout } from "../../../types/app";
import { workoutResultIsFilled } from "../../../utils/utils";

type WorkoutResultProps = {
  workoutResult:
    | inferRouterOutputs<WorkoutResultRouterType>["getWorkoutResultsByWorkoutId"][number]
    | inferRouterOutputs<WorkoutSessionRouterType>["getWorkoutSessionById"]["workoutResults"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"]["workoutResults"][number]
    | WorkoutResultInputsWithWorkout;
  fromResultList?: boolean;
  onEditWorkoutResult?: () => void;
};

export default function WorkoutResult({
  workoutResult,
  onEditWorkoutResult,
  fromResultList,
}: WorkoutResultProps) {
  return (
    <>
      <div
        className={`text-center ${
          fromResultList ? "rounded-3xl bg-base-300 px-4 py-7" : "py-4"
        }`}
      >
        {!fromResultList ? (
          <div className="divider text-[0.6rem]">THE OUTCOME</div>
        ) : (
          fromResultList &&
          "workoutSession" in workoutResult && (
            <div className="text-md mb-3 font-bold">
              {format(
                workoutResult.workoutSession.event.eventDate,
                "eeee, do MMM yyyy"
              )}
            </div>
          )
        )}
        {workoutResultIsFilled(workoutResult) ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(workoutResult.rating)].map((e, i) => (
                  <MdStar size={22} key={i} />
                ))}
              </div>
              <div
                className={`badge ${
                  workoutResult.isRx ? "badge-primary" : "badge-secondary"
                }`}
              >
                {workoutResult.isRx ? "RX" : "Scaled"}
              </div>
            </div>
            <div>
              <div className="text-lg font-extrabold">
                {workoutResult.totalReps && (
                  <div>{workoutResult.totalReps} repetitions</div>
                )}
                {workoutResult.weight && <div>{workoutResult.weight}KG</div>}
              </div>
              {workoutResult.time && (
                <div className="flex flex-col text-xl font-extrabold">
                  {Math.floor(workoutResult.time / 60)}:
                  {`0${workoutResult.time % 60}`.slice(-2)}
                  {` minutes`}
                </div>
              )}
            </div>
            <div className="whitespace-pre-wrap text-xs">
              {workoutResult.description || "No description added"}
            </div>
          </div>
        ) : (
          <div className="mt-2 flex w-full justify-center">
            <button
              type="button"
              onClick={onEditWorkoutResult && onEditWorkoutResult}
              className="btn-primary btn-xs btn"
            >
              Add your result!
            </button>
          </div>
        )}
      </div>
    </>
  );
}

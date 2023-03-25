import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { WorkoutResultRouterType } from "../../server/trpc/router/workout-result-router";
import { WorkoutSessionRouterType } from "../../server/trpc/router/workout-session-router";
import { WorkoutResultInputsWithWorkout } from "../../types/app";

interface WorkoutResultCardProps {
  result:
    | inferRouterOutputs<WorkoutResultRouterType>["getWorkoutResultsByWorkoutId"][number]
    | inferRouterOutputs<WorkoutSessionRouterType>["getWorkoutSessionById"]["workoutResults"][number]
    | WorkoutResultInputsWithWorkout;

  eventDate?: Date;
  condensed?: boolean;
}

export default function WorkoutResultCard({
  result,
  condensed,
}: WorkoutResultCardProps) {
  return (
    <div
      className={`${
        condensed ? "" : "rounded-3xl"
      } bg-base-300 p-5 text-center`}
    >
      {"workoutSession" in result && (
        <div className="mb-2 text-sm font-light">
          {format(result.workoutSession.event.eventDate, "eeee, do MMM yyyy")}
        </div>
      )}

      <div className="mb-3.5 flex items-center justify-center gap-1">
        {result.rating && (
          <div
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900 text-2xl
        `}
          >
            {
              {
                1: "😓",
                2: "🙁",
                3: "😐",
                4: "🙂",
                5: "😍",
              }[result.rating]
            }
          </div>
        )}

        <div className="">
          <div className="font-extrabold">
            {result.totalReps && <div>{result.totalReps}</div>}
            {result.weight && <div>{result.weight}KG</div>}
          </div>
          {result.time && (
            <div className="flex flex-col text-2xl font-bold leading-none">
              {format(result.time * 1000, "mm:ss")}
              <div className="-mt-1 text-[17px] font-light">minutes</div>
            </div>
          )}
        </div>
      </div>
      <div className="whitespace-pre-wrap text-xs font-light">
        {result.description ?? <i> no description added.</i>}
      </div>

      <div className="mt-3">
        <div
          className={`badge
          ${result.isRx ? "badge-primary" : "badge-secondary"}
          `}
        >
          {result.isRx ? "RX" : "Scaled"}
        </div>
      </div>
    </div>
  );
}

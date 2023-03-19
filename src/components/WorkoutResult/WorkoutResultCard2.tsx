import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { WorkoutResultRouterType } from "../../server/trpc/router/workout-result-router";

interface WorkoutResultCardProps {
  result: inferRouterOutputs<WorkoutResultRouterType>["getWorkoutResultsByWorkoutId"][number];
  eventDate?: Date;
}

export default function WorkoutResultCard({ result }: WorkoutResultCardProps) {
  return (
    <div className="rounded-3xl bg-base-300 p-5 text-center">
      <div className="mb-2 text-sm font-light">
        {format(result.workoutSession.event.eventDate, "eeee, do MMM yyyy")}
      </div>

      <div className="my-3.5 flex items-center justify-center gap-1">
        {result.rating && (
          <div
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r
        from-fuchsia-500 via-red-600 to-orange-400 text-2xl
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

        <div>{result.totalReps && <div>{result.totalReps}</div>}</div>
        {result.time && (
          <div className="flex flex-col text-2xl font-bold leading-none">
            {format(result.time * 1000, "mm:ss")}
            <div className="-mt-1 text-[17px] font-light">minutes</div>
          </div>
        )}
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

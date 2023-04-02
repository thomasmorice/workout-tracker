import { inferRouterOutputs } from "@trpc/server";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";
import { WorkoutRouterType } from "../../server/trpc/router/WorkoutRouter/workout-router";
import { trpc } from "../../utils/trpc";
import WorkoutResultCard from "./WorkoutResultCard";

type WorkoutResultsProps = {
  workoutId: inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]["id"];
};

export default function WorkoutResults({ workoutId }: WorkoutResultsProps) {
  const { data: sessionData } = useSession();
  const [orderBy, set_orderBy] = useState<"date" | "performance">("date");

  const { data: workoutResults, isLoading } =
    trpc.workoutResult.getWorkoutResultsByWorkoutId.useQuery(
      {
        workoutId,
      },

      {
        enabled: !!workoutId && sessionData?.user !== undefined,
        refetchOnWindowFocus: false,
      }
    );

  if (isLoading) {
    return <TailSpin fontSize={12} />;
  } else if (!workoutResults) {
    return <div>Error</div>;
  }

  return (
    <div className=" mb-6 px-4">
      {workoutResults.length === 0 ? (
        <div className="flex flex-col gap-2 text-center">
          No results associated
          <i className="text-sm font-thin leading-relaxed">
            Ready to see the results of your hard work? Let&apos;s make it
            happen! Use this workout for your next session. It&apos;s time to
            sweat, push yourself and feel the burn. Remember, you&apos;re
            stronger than you think. Let&apos;s do this!{" "}
          </i>
        </div>
      ) : (
        <>
          <h2 className="h2">Results associated</h2>
          <div className="mt-4 mb-8 flex items-center gap-3">
            <div className="text-xs">Order by </div>
            <button
              onClick={() => set_orderBy("date")}
              className={`badge badge-lg font-medium ${
                orderBy === "date" ? "badge-primary" : ""
              }`}
            >
              Date
            </button>

            <button
              disabled
              onClick={() => set_orderBy("performance")}
              className={`badge badge-lg font-medium ${
                orderBy === "performance" ? "badge-primary" : ""
              }`}
            >
              Performance
            </button>
          </div>
          <div className="flex flex-col gap-7">
            {workoutResults.map((result) => (
              <WorkoutResultCard key={result.id} result={result} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

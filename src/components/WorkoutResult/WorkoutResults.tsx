import { inferRouterOutputs } from "@trpc/server";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";
import { WorkoutRouterType } from "../../server/trpc/router/WorkoutRouter/workout-router";
import { router } from "../../server/trpc/trpc";
import { trpc } from "../../utils/trpc";
import WorkoutResult from "../Workout/WorkoutCard/WorkoutResult";
import { useRouter } from "next/router";

type WorkoutResultsProps = {
  workoutId: inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]["id"];
};

export default function WorkoutResults({ workoutId }: WorkoutResultsProps) {
  const { data: sessionData } = useSession();
  const [orderBy, set_orderBy] = useState<"date" | "performance">("date");
  const router = useRouter();
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
    return (
      <div className="flex  w-full justify-center pb-20">
        <TailSpin fontSize={12} />
      </div>
    );
  } else if (!workoutResults) {
    return <div>Error</div>;
  }

  return (
    <div className=" mb-6">
      {workoutResults.length === 0 ? (
        <div className="mt-6 flex flex-col gap-2 text-center">
          No results associated
          <p className="text-xs  leading-relaxed">
            Ready to see the results of your hard work? Let&apos;s make it
            happen! Use this workout for your next session. It&apos;s time to
            sweat, push yourself and feel the burn. Remember, you&apos;re
            stronger than you think. Let&apos;s do this!{" "}
          </p>
        </div>
      ) : (
        <>
          <div className="divider text-[0.6rem] uppercase">
            All results associated
          </div>
          {/* <h2 className="h2 pt-4 text-center text-xl">
            All results associated
          </h2> */}
          <div className="my-8 flex items-center gap-3">
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
          <div className="flex flex-col gap-10">
            {workoutResults.map((result) => (
              <WorkoutResult
                key={result.id}
                workoutResult={result}
                onEditWorkoutResult={() =>
                  router.push(`/session/edit/${result.workoutSession.id}`)
                }
                fromResultList
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

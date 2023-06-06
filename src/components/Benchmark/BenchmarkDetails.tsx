import { useSession } from "next-auth/react";
import {
  getAverageLevelPerAbilities,
  getBenchmarksAndAbilities,
} from "../../utils/benchmark";
import { enumToString } from "../../utils/formatting";
import { trpc } from "../../utils/trpc";

export default function BenchmarkDetails() {
  const { data: sessionData, status } = useSession();

  const { data: benchmarkWorkouts, isFetching } =
    trpc.workout.getAllWorkoutWithResults.useQuery(
      {
        benchmarkOnly: true,
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const benchmarksAndAbilities = getBenchmarksAndAbilities(
    benchmarkWorkouts || [],
    sessionData?.user?.gender
  );

  return (
    <div className="flex flex-col gap-5">
      {getAverageLevelPerAbilities(benchmarksAndAbilities).map(
        (levelPerAbility) => (
          <div key={levelPerAbility.ability} className="flex flex-col gap-1">
            <div className="label-text">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="-mt-1 text-xs font-black uppercase">
                    {enumToString(levelPerAbility.ability).toUpperCase()}
                  </div>
                  <div className="text-[0.72rem]">
                    Based on {levelPerAbility.accuracy} workouts
                  </div>
                </div>
                <div className="flex items-center justify-center rounded-full text-base font-black uppercase">
                  {levelPerAbility.level}
                </div>
              </div>
            </div>

            <progress
              className={`progress progress-primary`}
              value={levelPerAbility.level}
              max="100"
            ></progress>
          </div>
        )
      )}
    </div>
  );
}

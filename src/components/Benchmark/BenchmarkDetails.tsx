import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { BiBarChart } from "react-icons/bi";
import {
  getAverageLevelPerAbilities,
  getBenchmarksAndAbilities,
  getFormattedResultFromBenchmarkWorkout as getFormattedResultFromBenchmarkWorkout,
  getIconFromBenchmarkAbility,
  getResultFromBenchmarkWorkout,
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
    <div className="-mt-10">
      <div className="collapse-arrow collapse rounded-xl bg-base-200">
        <input type="checkbox" className="" />
        <div className="collapse-title flex items-center  text-sm font-black">
          Show Level per ability
        </div>
        <div className="collapse-content flex flex-col gap-5">
          {getAverageLevelPerAbilities(benchmarksAndAbilities).map(
            (levelPerAbility) => (
              <div
                key={levelPerAbility.ability}
                className="flex flex-col gap-1"
              >
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
                    <div className="flex items-center justify-center rounded-full text-base font-bold uppercase">
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
      </div>
      <div className="mt-10 max-h-96 overflow-x-auto">
        <table className="table-xs table-zebra table ">
          <thead>
            <tr>
              <th>Name</th>

              <th>Results</th>
            </tr>
          </thead>
          <tbody>
            {benchmarkWorkouts?.map((bw) => {
              const latestResult = getFormattedResultFromBenchmarkWorkout({
                workout: bw,
                resultType: "latest",
              });
              const bestResult = getFormattedResultFromBenchmarkWorkout({
                workout: bw,
                resultType: "best",
              });
              return (
                <tr key={bw.id}>
                  <td className="flex items-center gap-2">
                    <div className="dropdown">
                      <label
                        tabIndex={0}
                        className="btn-outline btn-xs btn-circle btn text-[0.65rem]"
                      >
                        <BiBarChart size={13} />
                      </label>
                      <div
                        tabIndex={0}
                        className="card-compact card dropdown-content z-50 w-64 p-2 text-primary-content dark:bg-base-300"
                      >
                        <div className="card-body dark:bg-base-300">
                          <ul className="flex flex-col gap-2">
                            {bw.benchmark?.abilitiesRequired.map((ability) => {
                              const Icon = getIconFromBenchmarkAbility(ability);
                              return (
                                <li
                                  className="flex items-center gap-2"
                                  key={ability}
                                >
                                  {<Icon size={16} />} {enumToString(ability)}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {bw.name}{" "}
                  </td>
                  <td>
                    {latestResult && bestResult ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex w-fit rounded-lg bg-primary px-2 py-1 text-primary-content">
                          Best {bestResult.formatted}
                        </div>
                        <div className="flex w-fit rounded-lg bg-secondary px-2 py-1 text-primary-content">
                          Latest {latestResult.formatted}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

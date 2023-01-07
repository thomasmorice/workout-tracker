import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdDone,
  MdRemove,
  MdStarRate,
} from "react-icons/md";
import { useMemo, useCallback } from "react";

import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import DashboardItemGraph from "../DashboardItemGraph";
import Link from "next/link";

type PersonalRecordWorkoutType = {
  workout: inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];
};

export default function PersonalRecordItem({
  workout,
}: PersonalRecordWorkoutType) {
  const resultsByDate = useCallback(() => {
    return workout.workoutResults.sort(
      (a, b) =>
        a.workoutSession.event.eventDate.getTime() -
        b.workoutSession.event.eventDate.getTime()
    );
  }, [workout]);

  const resultsByPerformance = useCallback(() => {
    return workout.workoutResults.sort(
      (a, b) => (b.weight || 0) - (a.weight || 0)
    );
  }, [workout]);

  const getPercentageOfImprovement = useMemo(() => {
    const bestPerformance = resultsByPerformance()[0];
    const latestPerformance = resultsByDate().reverse()[0];
    if (bestPerformance?.weight && latestPerformance?.weight) {
      const isIncreasing =
        bestPerformance.weight - latestPerformance.weight <= 0;
      return {
        result: `${Math.floor(
          ((bestPerformance.weight - latestPerformance.weight) /
            bestPerformance.weight) *
            100
        )} %`,
        isIncreasing,
        isLastPR: bestPerformance.weight === latestPerformance.weight,
      };
    }
  }, [resultsByDate, resultsByPerformance]);

  if (workout.workoutResults.length === 0) {
    return null;
  }

  return (
    <>
      <Link
        href={`/workout/${workout.id}`}
        className={`flex cursor-pointer items-center  gap-1`}
      >
        <div className="stat relative max-w-[280px] rounded-xl bg-base-200 transition-transform hover:scale-[1.03] hover:shadow-inner ">
          <div className="stat-figure text-primary">
            <div
              className={`badge ml-4
              ${
                getPercentageOfImprovement?.isIncreasing
                  ? "badge-success"
                  : "badge-error"
              }`}
            >
              {!getPercentageOfImprovement ? (
                <MdRemove size={18} />
              ) : getPercentageOfImprovement?.isLastPR ? (
                <>
                  <MdStarRate />
                  PR
                </>
              ) : (
                <>
                  {getPercentageOfImprovement?.isIncreasing ? (
                    <>
                      <MdArrowDropUp size={20} />
                      <span>{getPercentageOfImprovement?.result || "0%"}</span>
                    </>
                  ) : (
                    <div className="flex min-w-[52px] items-center">
                      <MdArrowDropDown size={16} />
                      {getPercentageOfImprovement?.result || "0%"}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="stat-title flex items-center gap-2">
            {workout.name ?? workout.id}
            <div className="badge flex items-center gap-0.5">
              <MdDone size="16" />
              {workout.workoutResults.length}
            </div>
          </div>
          <div className="stat-value">
            {resultsByPerformance()[0]?.weight}KG
          </div>
          <div className="stat-desc">
            <DashboardItemGraph
              graphNumbers={resultsByDate()?.map((wr) => wr.weight ?? 0)}
            />
          </div>
        </div>
      </Link>
    </>
  );
}

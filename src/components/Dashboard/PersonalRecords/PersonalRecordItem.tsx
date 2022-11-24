import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdRemove,
  MdStarRate,
} from "react-icons/md";
import { useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";

import DashboardItem from "../DashboardItem";
import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";

type PersonalRecordWorkoutType = {
  personalRecordWorkout: inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];
};

export default function PersonalRecordItem({
  personalRecordWorkout,
}: PersonalRecordWorkoutType) {
  const resultsByDate = useCallback(() => {
    return personalRecordWorkout.workoutResults.sort(
      (a, b) =>
        a.workoutSession.event.eventDate.getTime() -
        b.workoutSession.event.eventDate.getTime()
    );
  }, [personalRecordWorkout]);

  const resultsByPerformance = useCallback(() => {
    return personalRecordWorkout.workoutResults.sort(
      (a, b) => (b.weight || 0) - (a.weight || 0)
    );
  }, [personalRecordWorkout]);

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

  if (personalRecordWorkout.workoutResults.length === 0) {
    return null;
  }

  return (
    <>
      <DashboardItem
        title={personalRecordWorkout.name ?? ""}
        graphNumbers={resultsByDate().map((wr) => wr.weight ?? 0)}
      >
        <>
          <div className="text-2xs -mt-0.5 text-base-content">
            latest - {resultsByDate()[resultsByDate().length - 1]?.weight}KG
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <div className="text-2xl font-bold text-accent-content">
              {resultsByPerformance()[0]?.weight}KG
            </div>

            <span
              className={`mx-2 flex items-center rounded-full px-2 py-0.5 text-sm text-success-content 
          ${
            getPercentageOfImprovement
              ? getPercentageOfImprovement.isIncreasing
                ? "bg-success"
                : "bg-error"
              : "bg-base-content"
          }`}
            >
              {!getPercentageOfImprovement ? (
                <MdRemove size={18} />
              ) : getPercentageOfImprovement.isLastPR ? (
                <>
                  <MdStarRate />
                  <span>PR</span>
                </>
              ) : (
                <>
                  {getPercentageOfImprovement.isIncreasing && (
                    <>
                      <MdArrowDropUp size={20} />
                      <span>{getPercentageOfImprovement?.result || "0%"}</span>
                    </>
                  )}

                  {!getPercentageOfImprovement.isIncreasing && (
                    <>
                      <MdArrowDropDown size={20} />
                      <span>{getPercentageOfImprovement?.result || "0%"}</span>
                    </>
                  )}
                </>
              )}
            </span>
          </div>
        </>
      </DashboardItem>
    </>
  );
}

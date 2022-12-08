import { useMemo, useState } from "react";
import { format, isSameMonth, differenceInYears } from "date-fns";
import { useWorkoutSessionService } from "../../../services/useWorkoutSessionService";
import DashboardItemList from "../DashboardItemList";
import { useWorkoutService } from "../../../services/useWorkoutService";
import { MdFavorite } from "react-icons/md";
import {
  IoCheckmarkDoneCircleSharp,
  IoHeartCircleSharp,
} from "react-icons/io5";
import Link from "next/link";
import DashboardItemGraph from "../DashboardItemGraph";

export default function SessionInsights() {
  const { getInfiniteWorkouts } = useWorkoutService();
  const { getSessionForInsights } = useWorkoutSessionService();
  const { data: sessionsForInsights, isLoading } = getSessionForInsights();
  const { data: mostlyDoneWorkouts, isLoading: isLoadingMostlyDoneWorkout } =
    getInfiniteWorkouts({
      onlyFetchMine: true,
      limit: 3,
      orderByMostlyDone: true,
    });

  const sessionsThisMonth = useMemo(() => {
    return sessionsForInsights?.reduce((acc: number, session) => {
      if (isSameMonth(new Date(), session.event.eventDate)) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
  }, [sessionsForInsights]);

  const monthlySessionsInsights = useMemo(() => {
    let totalSessionsThisYear = 0;
    if (sessionsForInsights) {
      let sessionsPerMonth = sessionsForInsights?.reduce(
        (acc: any, session) => {
          // Data valid should be less than 1 year old and not the current month
          if (
            differenceInYears(new Date(), session.event.eventDate) === 0 &&
            !isSameMonth(new Date(), session.event.eventDate)
          ) {
            totalSessionsThisYear++;
            const yearMonth = `${format(session.event.eventDate, "y'-'MM")}`;
            if (!acc[yearMonth]) {
              acc[yearMonth] = [];
            }
            acc[yearMonth].push(session.event.eventDate);
          }
          return acc;
        },
        [] as {}
      );
      return {
        totalSessionsThisYear: totalSessionsThisYear,
        averageMonthlySessionsThisYear:
          totalSessionsThisYear / Object.entries(sessionsPerMonth).length,
        sessionsPerMonth: sessionsPerMonth,
      };
    }
  }, [sessionsForInsights]);

  const displayWorkoutAndCounter = (
    id: number,
    count: number,
    name: string | null
  ) => (
    <Link
      href={`/workout/${id}`}
      className={`link-hover link flex items-center gap-1.5`}
    >
      <span className="text-secondary">{name || `#${id}`}</span>
      <span className="text-xs text-base-content opacity-60">{`x${count}`}</span>
    </Link>
  );

  return (
    <>
      <DashboardItemList
        loadingMessage="fetching metrics"
        isLoading={isLoading || isLoadingMostlyDoneWorkout}
        title="Workout/session metrics"
      >
        <>
          {sessionsForInsights && sessionsForInsights.length > 0 && (
            <>
              <div className="stat max-w-[280px] rounded-xl bg-base-200">
                <div className="stat-figure text-secondary">
                  <IoCheckmarkDoneCircleSharp size={32} />
                </div>
                <div className="stat-title">Total sessions </div>
                <div className="stat-value text-secondary">
                  {sessionsForInsights.length}
                </div>
                <div className="stat-desc">
                  <span className="text-sm font-bold text-secondary">
                    {sessionsThisMonth}
                  </span>{" "}
                  done this month
                </div>
              </div>

              <div className="stat relative max-w-[280px] rounded-xl bg-base-200">
                <div className="stat-figure text-secondary">
                  <IoCheckmarkDoneCircleSharp size={32} />
                </div>
                <div className="stat-title">Avg monthly session</div>
                <div className="stat-value text-secondary">
                  {monthlySessionsInsights?.averageMonthlySessionsThisYear.toFixed(
                    1
                  )}
                </div>
                <div className="stat-desc">
                  <DashboardItemGraph
                    graphNumbers={Object.entries(
                      monthlySessionsInsights?.sessionsPerMonth
                    ).map((sessionPerMonth: any) => sessionPerMonth[1].length)}
                  />
                </div>
              </div>

              <div className="stat max-w-[280px] rounded-xl bg-base-200">
                <div className="stat-figure text-secondary">
                  <IoHeartCircleSharp size={32} />
                </div>
                <div className="stat-title">Favorite workouts </div>
                <div className="stat-value text-[1.35rem]">
                  {mostlyDoneWorkouts?.pages[0]?.workouts[0] &&
                    displayWorkoutAndCounter(
                      mostlyDoneWorkouts?.pages[0]?.workouts[0].id,
                      mostlyDoneWorkouts?.pages[0]?.workouts[0].workoutResults
                        .length,
                      mostlyDoneWorkouts?.pages[0]?.workouts[0].name
                    )}
                </div>
                <div className="stat-desc flex flex-col gap-0.5 opacity-100">
                  {mostlyDoneWorkouts?.pages[0]?.workouts.map(
                    (workout, index) =>
                      index > 0 && (
                        <div key={workout.id}>
                          {displayWorkoutAndCounter(
                            workout.id,
                            workout?.workoutResults.length,
                            workout.name
                          )}
                        </div>
                      )
                  )}
                </div>
              </div>
            </>
          )}
        </>
      </DashboardItemList>
    </>
  );
}

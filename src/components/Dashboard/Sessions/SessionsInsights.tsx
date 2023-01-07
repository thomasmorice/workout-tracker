import { useMemo, useState } from "react";
import { format, isSameMonth, differenceInYears } from "date-fns";
import { useWorkoutSessionService } from "../../../services/useWorkoutSessionService";
import DashboardItemList from "../DashboardItemList";
import { useWorkoutService } from "../../../services/useWorkoutService";
import { MdDone, MdFavorite } from "react-icons/md";
import {
  IoCheckmarkDoneCircleSharp,
  IoHeartCircleSharp,
} from "react-icons/io5";
import Link from "next/link";
import DashboardItemGraph from "../DashboardItemGraph";
import DashboardItem from "../DashboardItem";

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
              <DashboardItem
                title={"Total sessions"}
                illustration={<IoCheckmarkDoneCircleSharp size={32} />}
                value={sessionsForInsights.length}
              >
                <div className="stat-desc flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
                    {sessionsThisMonth}
                  </div>
                  done this month
                </div>
              </DashboardItem>

              <DashboardItem
                title={"Avg monthly session"}
                illustration={<IoCheckmarkDoneCircleSharp size={32} />}
                value={
                  monthlySessionsInsights?.averageMonthlySessionsThisYear.toFixed(
                    1
                  ) || ""
                }
              >
                <DashboardItemGraph
                  graphNumbers={Object.entries(
                    monthlySessionsInsights?.sessionsPerMonth
                  ).map((sessionPerMonth: any) => sessionPerMonth[1].length)}
                />
              </DashboardItem>

              <DashboardItem
                title={"Favorite workouts"}
                illustration={<MdFavorite size={32} />}
              >
                <>
                  {mostlyDoneWorkouts?.pages[0]?.workouts.map((workout) => (
                    <div key={workout.id}>
                      <Link
                        href={`/workout/${workout.id}`}
                        className={`link-hover link flex items-center gap-1`}
                      >
                        {workout.name || `#${workout.id}`}
                        <div className="flex items-center gap-0.5">
                          <MdDone size="16" />
                          {workout.workoutResults.length}
                        </div>
                      </Link>
                    </div>
                  ))}
                </>
              </DashboardItem>
            </>
          )}
        </>
      </DashboardItemList>
    </>
  );
}

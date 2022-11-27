import { useMemo, useState } from "react";
import { format, isSameMonth, differenceInYears } from "date-fns";
import { useWorkoutSessionService } from "../../../services/useWorkoutSessionService";

import DashboardItem from "../DashboardItem";
import DashboardItemList from "../DashboardItemList";
import { useWorkoutService } from "../../../services/useWorkoutService";
import { MdFavorite } from "react-icons/md";
import Link from "next/link";

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

  const weeklySessionsInsights = useMemo(() => {
    // Data valid should be less than 1 year old
    let totalSessionsThisYear = 0;
    if (sessionsForInsights) {
      let sessionsPerWeek = sessionsForInsights?.reduce((acc: any, session) => {
        if (differenceInYears(new Date(), session.event.eventDate) === 0) {
          totalSessionsThisYear++;
          const yearWeek = `${format(session.event.eventDate, "y'-'II")}`;
          if (!acc[yearWeek]) {
            acc[yearWeek] = [];
          }
          acc[yearWeek].push(session.event.eventDate);
        }
        return acc;
      }, [] as {});
      return {
        totalSessionsThisYear: totalSessionsThisYear,
        averageSessionsThisYear:
          totalSessionsThisYear / Object.entries(sessionsPerWeek).length,
        sessionsPerWeek: sessionsPerWeek,
      };
    }
  }, [sessionsForInsights]);

  // console.log(
  //   "graph content",
  //   Object.entries(weeklySessionsInsights?.sessionsPerWeek).map(
  //     (sessionPerWeek: any) => sessionPerWeek[1]
  //   )
  // );

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
              <DashboardItem title="Session insights">
                <div className="">
                  <div className="relative z-10 flex items-center gap-2 text-sm">
                    <div className="text-xl font-bold text-accent-content">
                      {sessionsForInsights.length}
                    </div>
                    total sessions
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="text-xl font-bold text-accent-content">
                      {sessionsThisMonth}
                    </div>
                    done this month
                  </div>
                </div>
              </DashboardItem>
              <DashboardItem title="Favorite workouts">
                <div className="relative z-10 mt-3 flex flex-col gap-0.5 text-sm">
                  {mostlyDoneWorkouts?.pages[0]?.workouts.map((workout) => (
                    <Link
                      key={workout.id}
                      href={`/workout/${workout.id}`}
                      className="flex items-center gap-2"
                    >
                      <>
                        <MdFavorite className="text-primary-content" />
                        {workout?.name || `#${workout.id}`}
                        {` (${workout?.workoutResults.length} times)`}
                      </>
                    </Link>
                  ))}
                </div>
              </DashboardItem>
              <DashboardItem
                graphNumbers={Object.entries(
                  weeklySessionsInsights?.sessionsPerWeek
                ).map((sessionPerWeek: any) => sessionPerWeek[1].length)}
                title="Avg weekly session"
              >
                <div className="text-xs">{`Based on data < 1 year`}</div>
                <div className="relative z-10 flex items-center gap-2">
                  <div className="text-2xl font-bold text-accent-content">
                    {weeklySessionsInsights?.averageSessionsThisYear.toFixed(2)}
                  </div>
                </div>
              </DashboardItem>
              {/* <DashboardItem title="Sessions this month">
                <div className="relative z-10 flex items-center gap-2">
                  <div className="text-2xl font-bold text-accent-content">
                    {sessionsThisMonth}
                  </div>
                </div>
              </DashboardItem> */}
            </>
          )}
        </>
      </DashboardItemList>
    </>
  );
}

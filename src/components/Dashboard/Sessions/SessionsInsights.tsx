import { useMemo, useState } from "react";
import { format, isSameMonth, differenceInYears } from "date-fns";
import { useWorkoutSessionService } from "../../../services/useWorkoutSessionService";
import { useEventStore } from "../../../store/EventStore";
import Modal from "../../Layout/Navigation/Modal/Modal";
import WorkoutSessionForm from "../../WorkoutSession/WorkoutSessionForm";
import DashboardAddItem from "../DashboardAddItem";
import DashboardItem from "../DashboardItem";
import DashboardItemList from "../DashboardItemList";
import { useWorkoutService } from "../../../services/useWorkoutService";

export default function SessionInsights() {
  const [showAddSessionModal, set_showAddSessionModal] = useState(false);
  const { getInfiniteWorkouts } = useWorkoutService();
  const { getSessionForInsights } = useWorkoutSessionService();
  const { data: sessionsForInsights, isLoading } = getSessionForInsights();
  const { data: mostlyDoneWorkouts, isLoading: isLoadingMostlyDoneWorkout } =
    getInfiniteWorkouts({
      onlyFetchMine: true,
      limit: 3,
      orderByMostlyDone: true,
    });
  const { closeForm } = useEventStore();

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
      {showAddSessionModal && (
        <Modal
          withCloseButton={true}
          onClose={() => set_showAddSessionModal(false)}
        >
          <>
            <h3 className="text-lg font-bold">Add a session</h3>
            <WorkoutSessionForm onSuccess={() => console.log("success")} />
          </>
        </Modal>
      )}

      <DashboardItemList
        loadingMessage="fetching metrics"
        isLoading={isLoading}
        title="Workout/session metrics"
      >
        <>
          <DashboardAddItem
            title="Add a session"
            onClick={() => {
              closeForm(); // This will close the workout session form in case it has been opened in the "activities" section
              set_showAddSessionModal(true);
            }}
          />

          {sessionsForInsights && sessionsForInsights.length > 0 && (
            <>
              <DashboardItem title="Total sessions">
                {/* <div className="text-2xs">total</div> */}
                <div className="relative z-10 flex items-center gap-2">
                  <div className="text-2xl font-bold text-accent-content">
                    {sessionsForInsights.length}
                  </div>
                </div>
              </DashboardItem>
              <DashboardItem title="Top 3 workouts">
                {/* <div className="text-2xs">total</div> */}
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="mt-3 text-sm font-bold text-accent-content ">
                    1. {mostlyDoneWorkouts?.pages[0]?.workouts[0]?.name}
                    <span>
                      {` (${mostlyDoneWorkouts?.pages[0]?.workouts[0]?.workoutResults.length} times)`}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-accent-content">
                    2. {mostlyDoneWorkouts?.pages[0]?.workouts[1]?.name}
                    <span>
                      {` (${mostlyDoneWorkouts?.pages[0]?.workouts[1]?.workoutResults.length} times)`}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-accent-content">
                    3. {mostlyDoneWorkouts?.pages[0]?.workouts[2]?.name}
                    <span>
                      {` (${mostlyDoneWorkouts?.pages[0]?.workouts[2]?.workoutResults.length} times)`}
                    </span>
                  </div>
                </div>
              </DashboardItem>
              <DashboardItem
                graphNumbers={Object.entries(
                  weeklySessionsInsights?.sessionsPerWeek
                ).map((sessionPerWeek: any) => sessionPerWeek[1].length)}
                title="Avg weekly session"
              >
                <div className="text-2xs">{`Based on data < 1 year`}</div>
                <div className="relative z-10 flex items-center gap-2">
                  <div className="text-2xl font-bold text-accent-content">
                    {weeklySessionsInsights?.averageSessionsThisYear.toFixed(2)}
                  </div>
                </div>
              </DashboardItem>
              <DashboardItem title="Sessions this month">
                {/* <div className="text-2xs"></div> */}
                <div className="relative z-10 flex items-center gap-2">
                  <div className="text-2xl font-bold text-accent-content">
                    {sessionsThisMonth}
                  </div>
                </div>
              </DashboardItem>
            </>
          )}
        </>
      </DashboardItemList>
    </>
  );
}

import { useWorkoutService } from "../../../services/useWorkoutService";
import DashboardItemList from "../DashboardItemList";
import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import PersonalRecordItem from "./PersonalRecordItem";

type PersonalRecordWorkoutType =
  inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];

export default function PersonalRecordsInsights() {
  const { getInfiniteWorkouts } = useWorkoutService();

  const { data: personalRecordWorkouts, isLoading } = getInfiniteWorkouts({
    workoutTypes: ["ONE_REP_MAX"],
    onlyFetchMine: true,
    orderResults: [
      {
        weight: "desc",
      },
      {
        time: "asc",
      },
      {
        totalReps: "desc",
      },
    ],

    limit: 7,
    withResults: true,
  });

  if (
    !personalRecordWorkouts ||
    !personalRecordWorkouts?.pages[0]?.workouts?.length
  ) {
    return null;
  }

  return (
    <>
      <DashboardItemList
        isLoading={isLoading}
        loadingMessage="fetching personal records"
        title="Latest personal records"
      >
        <>
          {personalRecordWorkouts.pages[0]?.workouts.map((workout) => (
            <div className="px-4 snap-start" key={workout.id}>
              <PersonalRecordItem workout={workout} />
            </div>
          ))}
        </>
      </DashboardItemList>
    </>
  );
}

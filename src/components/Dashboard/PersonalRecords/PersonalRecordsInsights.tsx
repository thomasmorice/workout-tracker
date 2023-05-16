import { trpc } from "../../../utils/trpc";
import DashboardItemList from "../DashboardItemList";
import PersonalRecordItem from "./PersonalRecordItem";

export default function PersonalRecordsInsights() {
  const { data: personalRecordWorkouts, isLoading } =
    trpc.workout.getInfiniteWorkoutWithResults.useInfiniteQuery({
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
        {!personalRecordWorkouts ||
          (!personalRecordWorkouts?.pages[0]?.workouts?.length &&
            personalRecordWorkouts.pages[0]?.workouts.map((workout) => (
              <div className="snap-start px-4" key={workout.id}>
                <PersonalRecordItem workout={workout} />
              </div>
            )))}
      </DashboardItemList>
    </>
  );
}

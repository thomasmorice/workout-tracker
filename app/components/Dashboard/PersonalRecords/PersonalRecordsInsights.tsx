import { useWorkoutService } from "../../../services/useWorkoutService";
import PersonalRecordItem from "./PersonalRecordItem";
import DashboardItemList from "../DashboardItemList";

export default function PersonalRecordsInsights({}) {
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

  return (
    <>
      {personalRecordWorkouts &&
      personalRecordWorkouts?.pages[0]?.workouts?.length ? (
        <DashboardItemList
          isLoading={isLoading}
          loadingMessage="fetching personal records"
          title="Latest personal records"
        >
          <>
            {personalRecordWorkouts &&
              personalRecordWorkouts.pages[0]?.workouts.map((workout) => (
                <PersonalRecordItem
                  key={workout.id}
                  personalRecordWorkout={workout}
                />
              ))}
          </>
        </DashboardItemList>
      ) : (
        <> </>
      )}
    </>
  );
}

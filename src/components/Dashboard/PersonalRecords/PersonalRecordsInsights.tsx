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
          title="Latest personal records"
        >
          <div className="flex w-full gap-4 overflow-x-scroll py-3 sm:gap-8 sm:py-5">
            {personalRecordWorkouts &&
              personalRecordWorkouts.pages[0]?.workouts.map((workout) => (
                <PersonalRecordItem
                  key={workout.id}
                  personalRecordWorkout={workout}
                />
              ))}
          </div>
        </DashboardItemList>
      ) : (
        <> </>
      )}
    </>
  );
}

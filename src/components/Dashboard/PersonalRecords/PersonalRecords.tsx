import { useWorkoutService } from "../../../services/useWorkoutService";
import { Rings } from "react-loading-icons";
import PersonalRecordItem from "./PersonalRecordItem";

export default function PersonalRecords({}) {
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

    limit: 8,
    withResults: true,
  });

  return (
    <>
      <h2 className="h2 mt-10 mb-4">Latest personal records</h2>
      {isLoading ? (
        <div className="flex items-center gap-3">
          <Rings /> Fetching data
        </div>
      ) : personalRecordWorkouts &&
        personalRecordWorkouts?.pages[0]?.workouts?.length ? (
        <div className="flex w-full flex-wrap gap-4 py-3 sm:gap-8 sm:py-5">
          {personalRecordWorkouts &&
            personalRecordWorkouts.pages[0]?.workouts.map((workout) => (
              <PersonalRecordItem
                key={workout.id}
                personalRecordWorkout={workout}
              />
            ))}
        </div>
      ) : (
        <p>
          😢 Too bad, you currently have no personal records, start doing some{" "}
          <span className="text-accent-content">one rep max</span> workout!
        </p>
      )}
    </>
  );
}

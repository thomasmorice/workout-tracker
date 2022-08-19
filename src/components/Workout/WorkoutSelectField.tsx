import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Rings } from "react-loading-icons";
import { useDebounce } from "usehooks-ts";
import { WorkoutWithExtras } from "../../server/router/workout";
import { useWorkoutService } from "../../services/useWorkoutService";

interface WorkoutSelectProps {
  handleAddWorkout: (workout: WorkoutWithExtras) => void;
}

export default function WorkoutSelectField({
  handleAddWorkout,
}: WorkoutSelectProps) {
  const [searchTerm, set_searchTerm] = useState("");
  const [showWorkoutSearchResult, set_showWorkoutSearchResult] =
    useState(false);
  let searchTermDebounced = useDebounce<string>(searchTerm, 500);

  const [workouts, set_workouts] = useState<WorkoutWithExtras[]>([]);
  const { getInfiniteWorkouts } = useWorkoutService();

  const {
    data: fetchedWorkouts,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = getInfiniteWorkouts({
    searchTerm: searchTermDebounced,
    enabled: searchTermDebounced.length > 2,
    showClassifiedWorkoutOnly: true,
  });

  useEffect(() => {
    console.log("data", fetchedWorkouts);
  }, [fetchedWorkouts]);
  const workoutSearchResult = (
    <>
      {(fetchedWorkouts?.pages[0]?.workouts.length ?? 0) > 0 &&
        searchTerm.length !== 0 && (
          <div className="absolute top-14 bg-base-200 max-h-[580px] overflow-auto rounded-xl">
            {fetchedWorkouts?.pages.map((workoutPage, pageIndex) => (
              <div className="flex flex-col" key={pageIndex}>
                {workoutPage.workouts.map((workout) => (
                  <div
                    className="text-[0.8rem] border-y border-base-100 hover:bg-base-300 p-3 py-5 flex gap-5 cursor-pointer whitespace-pre-wrap border-b "
                    key={workout.id}
                    onClick={() => {
                      // set_workouts([...workouts, workout]);
                      handleAddWorkout(workout);
                      set_searchTerm("");
                      searchTermDebounced = "";
                    }}
                  >
                    <div className="opacity-70">
                      {format(workout.createdAt, "dd/MM/yyyy")}
                    </div>

                    {workout.description}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
    </>
  );

  return (
    <div className="flex flex-col gap-2 relative">
      <input
        className="input w-full pr-8 bg-base-200"
        onFocus={() => set_showWorkoutSearchResult(true)}
        // onBlur={() => set_showWorkoutSearchResult(false)}
        type="search"
        placeholder={"search..."}
        onChange={(e) => set_searchTerm(e.target.value)}
      />
      {isFetching && (
        <div className="absolute top-0 right-1">
          <Rings className="w-12" />
        </div>
      )}
      {showWorkoutSearchResult && workoutSearchResult}
    </div>
  );
}

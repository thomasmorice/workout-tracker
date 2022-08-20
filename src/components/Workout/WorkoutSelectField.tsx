import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Rings } from "react-loading-icons";
import { useDebounce } from "usehooks-ts";
import { WorkoutWithExtras } from "../../server/router/workout";
import { useWorkoutService } from "../../services/useWorkoutService";
import WorkoutCard from "./WorkoutCard";

interface WorkoutSelectProps {
  handleAddWorkout: (workout: WorkoutWithExtras) => void;
  selectedIds: number[];
}

export default function WorkoutSelectField({
  handleAddWorkout,
  selectedIds,
}: WorkoutSelectProps) {
  const [searchTerm, set_searchTerm] = useState("");
  const [showWorkoutSearchResult, set_showWorkoutSearchResult] =
    useState(false);
  let searchTermDebounced = useDebounce<string>(searchTerm, 500);

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
    ids: {
      hide: selectedIds,
    },
  });

  // Workout Search Results
  const workoutSearchResult = (
    <>
      {(fetchedWorkouts?.pages[0]?.workouts.length ?? 0) > 0 &&
        searchTerm.length !== 0 && (
          <div className="absolute top-14 bg-base-200 max-h-[520px] overflow-auto rounded-xl">
            {fetchedWorkouts?.pages.map((workoutPage, pageIndex) => (
              <div className="flex flex-col" key={pageIndex}>
                {workoutPage.workouts.map((workout) => (
                  <div
                    onClick={() => {
                      handleAddWorkout(workout);
                      set_searchTerm("");
                    }}
                    key={workout.id}
                    className=""
                  >
                    <WorkoutCard workout={workout} />
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

import { useState, useEffect, useRef } from "react";
import { Rings } from "react-loading-icons";
import { useDebounce } from "usehooks-ts";
import { useWorkoutService } from "../../services/useWorkoutService";
import { InferQueryOutput } from "../../types/trpc";
import WorkoutCard from "./WorkoutCard";

interface WorkoutSelectProps {
  handleAddWorkout: (
    workout: InferQueryOutput<"workout.get-infinite-workouts">["workouts"][number]
  ) => void;
  selectedIds?: number[];
}

export default function WorkoutSelectField({
  handleAddWorkout,
  selectedIds,
}: WorkoutSelectProps) {
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchTerm, set_searchTerm] = useState("");
  const [showWorkoutSearchResult, set_showWorkoutSearchResult] =
    useState(false);

  const searchTermDebounced = useDebounce<string>(searchTerm, 500);

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
      notIn: selectedIds,
    },
  });

  // Workout Search Results
  const workoutSearchResult = (
    <>
      {(fetchedWorkouts?.pages[0]?.workouts.length ?? 0) > 0 &&
        searchTerm.length !== 0 && (
          <div className="absolute z-30 top-14 bg-base-200 max-h-[520px] overflow-auto rounded-xl">
            {fetchedWorkouts?.pages.map((workoutPage, pageIndex) => (
              <div className="flex flex-col" key={pageIndex}>
                {workoutPage.workouts.map((workout) => (
                  <div
                    onClick={() => {
                      set_searchTerm("");
                      handleAddWorkout(workout);
                    }}
                    key={workout.id}
                    className="cursor-pointer"
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
        ref={searchInput}
        // onBlur={() => set_showWorkoutSearchResult(false)}
        type="search"
        placeholder={"search..."}
        value={searchTerm}
        onChange={(e) => set_searchTerm(e.target.value)}
      />
      {isFetching && (
        <div className="absolute top-0 right-1">
          <Rings className="w-12" />
        </div>
      )}
      {showWorkoutSearchResult && workoutSearchResult}
      <button
        type="button"
        onClick={() => {
          set_searchTerm(">latest");
          searchInput.current?.focus();
        }}
        className="btn btn-xs w-fit"
      >
        Latest workouts
      </button>
    </div>
  );
}

import { useState, useRef } from "react";
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
          <div className="absolute top-14 z-30 max-h-[520px] overflow-auto rounded-xl bg-base-100">
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
    <div className="relative flex flex-col gap-2">
      <input
        className="input w-full bg-base-200 pr-8"
        onFocus={() => set_showWorkoutSearchResult(true)}
        onBlur={() => set_showWorkoutSearchResult(false)}
        ref={searchInput}
        type="search"
        placeholder={"search..."}
        value={searchTerm}
        onChange={(e) => set_searchTerm(e.target.value)}
      />
      {searchTerm === "" && showWorkoutSearchResult && (
        <ul
          tabIndex={0}
          className="dropdown-content menu text-2xs w-full rounded-lg bg-base-300 p-1 shadow md:w-64"
        >
          <li
            onMouseDown={() => {
              set_searchTerm(">latest");
              searchInput.current?.focus();
            }}
          >
            <a> Show latest classified workouts</a>
          </li>
        </ul>
      )}

      {isFetching && (
        <div className="absolute top-0 right-1">
          <Rings className="w-12" />
        </div>
      )}
      {searchTerm !== "" && workoutSearchResult}
    </div>
  );
}

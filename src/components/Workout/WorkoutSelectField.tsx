import { useState, useRef } from "react";
import { Rings } from "react-loading-icons";
import { useDebounce } from "usehooks-ts";
import { useWorkoutService } from "../../services/useWorkoutService";
import WorkoutCard from "./WorkoutCard";
import { MdClose } from "react-icons/md";
import { useToastStore } from "../../store/ToastStore";
import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../server/trpc/router/workout-router";

interface WorkoutSelectProps {
  handleAddWorkout: (
    workout: inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
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

  const { addMessage } = useToastStore();

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
    <div className="">
      <div className="absolute top-2 right-3 z-40">
        <button
          type="button"
          onClick={() => {
            set_searchTerm("");
          }}
          className="btn btn-error btn-sm btn-circle"
        >
          <MdClose size={19} />
        </button>
      </div>
      {(fetchedWorkouts?.pages[0]?.workouts.length ?? 0) > 0 &&
        searchTerm.length !== 0 && (
          <div className="absolute top-14 z-30 max-h-[380px] w-full overflow-auto rounded-xl bg-base-200 px-4 pt-2">
            {fetchedWorkouts?.pages.map((workoutPage, pageIndex) => (
              <div className="flex flex-col" key={pageIndex}>
                {workoutPage.workouts.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    onSelect={() => {
                      addMessage({
                        message: "Workout added",
                        type: "info",
                        closeAfter: 1000,
                      });
                      handleAddWorkout(workout);
                    }}
                    condensed
                    workout={workout}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
    </div>
  );

  return (
    <div className="relative flex w-full flex-col gap-2">
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
          className="dropdown-content menu w-full rounded-lg bg-base-300 p-1 text-xs shadow"
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

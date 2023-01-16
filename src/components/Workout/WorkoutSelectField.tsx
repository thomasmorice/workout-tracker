import { useState, useRef, useMemo } from "react";
import { TailSpin } from "react-loading-icons";
import { useDebounce } from "usehooks-ts";
import { useWorkoutService } from "../../services/useWorkoutService";
import WorkoutCard from "./WorkoutCard/WorkoutCard";
import { MdClose } from "react-icons/md";

import { useToastStore } from "../../store/ToastStore";
import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../server/trpc/router/workout-router";
import { AnimatePresence, motion } from "framer-motion";

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
  });

  const filteredWorkouts = useMemo(() => {
    if (fetchedWorkouts) {
      return fetchedWorkouts.pages[0]?.workouts.filter(
        (workout) => !selectedIds?.includes(workout.id)
      );
    }
  }, [fetchedWorkouts, selectedIds]);

  // Workout Search Results
  const workoutSearchResult = (
    <div className="">
      <div className="absolute top-2 right-3 z-40">
        <button
          type="button"
          onClick={() => {
            set_searchTerm("");
          }}
          className="btn-sm btn-circle btn"
        >
          <MdClose size={14} />
        </button>
      </div>
      {(filteredWorkouts?.length ?? 0) > 0 && searchTerm.length !== 0 && (
        <div
          style={
            {
              // background: "#2a303c",
              // boxShadow: "inset 5px 5px 8px #20242d, inset -5px -5px 8px #353c4b",
            }
          }
          className="absolute top-16 z-30 -ml-2 flex max-h-[380px] w-[calc(100%_+_1rem)] flex-col gap-4 overflow-auto rounded-2xl border border-white border-opacity-5 bg-base-200"
        >
          <div className="py-6 px-4">
            {/* {fetchedWorkouts?.pages.map((workoutPage, pageIndex) => ( */}
            <div className="flex flex-col gap-10">
              <AnimatePresence>
                {filteredWorkouts?.map((workout) => (
                  <motion.div
                    key={workout.id}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    <WorkoutCard
                      onSelect={() => {
                        addMessage({
                          message: "Workout added",
                          type: "info",
                          closeAfter: 1000,
                        });
                        handleAddWorkout(workout);
                      }}
                      mode="selecteable"
                      workout={workout}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* ))} */}
          </div>
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
          className="dropdown-content menu w-full rounded-lg bg-base-300 text-xs shadow"
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
          <TailSpin className="h-8" stroke="#2D68FF" speed={1.2} />{" "}
        </div>
      )}
      {searchTerm !== "" && workoutSearchResult}
    </div>
  );
}

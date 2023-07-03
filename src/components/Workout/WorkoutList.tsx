import { Difficulty } from "@prisma/client";
import { LayoutGroup } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoOptions } from "react-icons/io5";
import { MdClose, MdFilterList, MdSearch } from "react-icons/md";
import Masonry from "react-masonry-css";
import { useDebounce, useIntersectionObserver } from "usehooks-ts";
import { trpc } from "../../utils/trpc";
import Dialog from "../Layout/Dialog/Dialog";
import WorkoutFilters, {
  defaultFilters,
  IWorkoutFilters,
} from "../WorkoutFilters/WorkoutFilters";
import WorkoutFiltersBadges from "../WorkoutFilters/WorkoutFiltersBadges";
import WorkoutCard from "./WorkoutCard/WorkoutCard";
import WorkoutCardSkeleton from "./WorkoutCardSkeleton";

export default function WorkoutList() {
  const lastWorkoutRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(lastWorkoutRef, {});

  const [filters, set_filters] = useState<IWorkoutFilters>(defaultFilters);

  const [showFiltersModal, set_showFiltersModal] = useState(false);
  const [searchTerm, set_searchTerm] = useState("");
  const searchTermDebounced = useDebounce<string>(searchTerm, 500);

  const { data, fetchNextPage, hasNextPage, isFetching, isSuccess } =
    trpc.workout.getInfiniteWorkout.useInfiniteQuery(
      {
        classifiedOnly: filters?.global === "classified",
        workoutTypes: filters?.workoutType ? [filters?.workoutType] : undefined,
        elementTypes: filters?.elementType ? [filters?.elementType] : undefined,
        difficulties: filters?.difficulty ? [filters?.difficulty] : undefined,
        minDuration: filters?.minDuration,
        maxDuration: filters?.maxDuration,
        benchmarkOnly: filters?.global === "benchmarks",
        workoutRecommendedOnly: filters?.global === "recommended",
        searchTerm: searchTermDebounced,
      },
      {
        getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage]);

  const hasNoWorkouts = useMemo(() => {
    return data?.pages[0]?.workouts?.length === 0 && isSuccess;
  }, [data, isSuccess]);

  return (
    <>
      <Dialog
        title={"Workout filters"}
        onClose={() => set_showFiltersModal(false)}
        isVisible={showFiltersModal}
      >
        <WorkoutFilters
          savedFilters={filters}
          updateFilters={(filters) => {
            set_filters(filters);
            set_showFiltersModal(false);
          }}
        />
      </Dialog>

      <div className="flex flex-wrap items-center gap-2 md:pt-6">
        <div className="group relative flex w-full items-center justify-between">
          <input
            id="searchWorkoutInput"
            type="search"
            placeholder="Search movement, equipement..."
            value={searchTerm}
            onChange={(e) => set_searchTerm(e.target.value)}
            className="input input-md w-full bg-base-100 px-4 placeholder:opacity-70"
          />
          <button
            onClick={() => set_showFiltersModal(true)}
            className="btn-neutral btn-square btn-sm btn absolute right-3 z-10"
          >
            <IoOptions size={18} />
          </button>
        </div>
      </div>

      <div className="my-2 ">
        <WorkoutFiltersBadges
          filters={filters}
          setFilters={(newFilters) => set_filters(newFilters)}
        />
      </div>

      <Masonry
        breakpointCols={{
          default: 3,
          1500: 2,
          1226: 1,
        }}
        className="-ml-16 mt-1 flex w-auto"
        columnClassName="pl-16 bg-clip-padding "
      >
        <LayoutGroup>
          {data?.pages
            ? data.pages.map((page) =>
                page.workouts.map((workout) => (
                  <div
                    // ref={showWorkoutDetail ? openedWorkoutRef : null}
                    key={workout.id}
                    className="relative mb-12"
                  >
                    <WorkoutCard workout={workout} />
                  </div>
                ))
              )
            : Array(9)
                .fill(0)
                .map((_, i) => <WorkoutCardSkeleton key={i} />)}
        </LayoutGroup>
      </Masonry>
      {hasNoWorkouts && <p>No results found yet, start creating workouts</p>}
      <div className="mb-10 h-10 w-1/2" ref={lastWorkoutRef}></div>
      {isFetching &&
        hasNextPage &&
        Array(9)
          .fill(0)
          .map((_, i) => <WorkoutCardSkeleton key={i} />)}
    </>
  );
}

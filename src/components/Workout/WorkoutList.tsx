import { LayoutGroup } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdSearch } from "react-icons/md";
import Masonry from "react-masonry-css";
import { useDebounce, useIntersectionObserver } from "usehooks-ts";
import { trpc } from "../../utils/trpc";
import WorkoutCard from "./WorkoutCard/WorkoutCard";
import WorkoutCardSkeleton from "./WorkoutCardSkeleton";

export default function WorkoutList() {
  const lastWorkoutRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(lastWorkoutRef, {});

  const [classifiedOnly, set_classifiedOnly] = useState(true);
  const [filterOn, set_filterOn] = useState<
    undefined | "classified" | "benchmarks"
  >("classified");
  const [searchTerm, set_searchTerm] = useState("");
  const searchTermDebounced = useDebounce<string>(searchTerm, 500);

  const { data, fetchNextPage, hasNextPage, isFetching, isSuccess } =
    trpc.workout.getInfiniteWorkout.useInfiniteQuery(
      {
        classifiedOnly: filterOn === "classified",
        benchmarkOnly: filterOn === "benchmarks",
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
      <div className="flex flex-wrap items-center gap-2 md:pt-6">
        <div className="relative flex w-full items-center justify-between">
          <label className="absolute z-10 ml-3" htmlFor="searchWorkoutInput">
            <MdSearch size={22} />
          </label>
          <input
            id="searchWorkoutInput"
            type="search"
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => set_searchTerm(e.target.value)}
            className="input left-0 w-full  rounded-full bg-base-200 px-12"
          />
        </div>
      </div>
      <div className="mb-2 mt-6 text-lg font-bold">Filters</div>
      <div className=" flex flex-wrap items-center gap-3">
        <button
          onClick={() => set_filterOn(undefined)}
          className={`badge badge-lg font-medium ${
            !filterOn ? "badge-primary" : ""
          }`}
        >
          All workouts
        </button>
        <button
          onClick={() => set_filterOn("classified")}
          className={`badge badge-lg font-medium ${
            filterOn === "classified" ? "badge-primary" : ""
          }`}
        >
          Classified
        </button>
        <button
          onClick={() => set_filterOn("benchmarks")}
          className={`badge badge-lg font-medium ${
            filterOn === "benchmarks" ? "badge-primary" : ""
          }`}
        >
          Only Benchmarks
        </button>
      </div>
      <div className="mb-2 mt-8 text-lg font-bold">Workout List</div>
      <Masonry
        breakpointCols={{
          default: 3,
          1500: 2,
          1226: 1,
        }}
        className="-ml-16 flex w-auto"
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

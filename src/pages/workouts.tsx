import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { useIntersectionObserver, useDebounce } from "usehooks-ts";
import WorkoutCard from "../components/Workout/WorkoutCard";
import WorkoutCardSkeleton from "../components/Workout/WorkoutCardSkeleton";
import { useWorkoutService } from "../services/useWorkoutService";
import { useWorkoutStore } from "../store/WorkoutStore";
import { MdSearch } from "react-icons/md";

const Workouts: NextPage = () => {
  const { data: sessionData } = useSession();
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});

  const { showWorkoutForm } = useWorkoutStore();
  const { getInfiniteWorkouts } = useWorkoutService();

  const [classifiedOnly, set_classifiedOnly] = useState(true);
  const [searchTerm, set_searchTerm] = useState("");
  const searchTermDebounced = useDebounce<string>(searchTerm, 500);

  const { data, fetchNextPage, hasNextPage, isFetching, isSuccess, ...rest } =
    getInfiniteWorkouts({
      showClassifiedWorkoutOnly: classifiedOnly,
      searchTerm: searchTermDebounced,
    });

  useEffect(() => {
    !!entry?.isIntersecting && hasNextPage && fetchNextPage();
  }, [entry, fetchNextPage, hasNextPage]);

  const hasNoWorkouts = useMemo(() => {
    return data?.pages[0]?.workouts?.length === 0 && isSuccess;
  }, [data, isSuccess]);

  return (
    <>
      <Head>
        <title>Workouts</title>
        <meta name="description" content="Manage and share your workouts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="h1 mt-3">Workout list</h1>

      {sessionData && (
        <>
          <div className="">
            <div className="flex flex-wrap items-center gap-2 pt-8">
              <div className="form-control items-start ">
                <label className="label cursor-pointer gap-2">
                  <span className="label-text">
                    {classifiedOnly
                      ? "Only classified workouts"
                      : "All workouts"}
                  </span>
                  <input
                    type="checkbox"
                    onChange={(e) => set_classifiedOnly(e.target.checked)}
                    className="toggle"
                    checked={classifiedOnly}
                  />
                </label>
              </div>

              <div className="input relative flex w-full items-center justify-between bg-base-200">
                <label className="z-10" htmlFor="searchWorkoutInput">
                  <MdSearch size={22} />
                </label>
                <input
                  id="searchWorkoutInput"
                  type="search"
                  placeholder="Search…"
                  value={searchTerm}
                  onChange={(e) => set_searchTerm(e.target.value)}
                  className="input absolute left-0 w-full bg-base-200 px-12"
                />

                {/* <div className="z-10">
                  <kbd className="kbd bg-base-100">⌘</kbd>
                  <kbd className="kbd bg-base-100">K</kbd>
                </div> */}
              </div>
            </div>

            <h2 className="group mt-12 flex cursor-pointer items-center gap-3 text-2xl font-bold text-accent-content">
              {`Latest ${classifiedOnly ? "classified" : ""} workouts`}
            </h2>

            <button
              type="button"
              onClick={() => showWorkoutForm("create")}
              className="btn btn-primary mt-6 mb-2"
            >
              Create a new workout
            </button>

            <Masonry
              breakpointCols={{
                default: 2,
                1226: 2,
                720: 1,
              }}
              className="-ml-8 flex w-auto pt-6 "
              columnClassName="pl-8 bg-clip-padding "
            >
              {data?.pages
                ? data.pages.map((page) =>
                    page.workouts.map((workout) => (
                      <div key={workout.id} className="mb-8">
                        <WorkoutCard
                          onEdit={() => showWorkoutForm("edit", workout)}
                          onDuplicate={() =>
                            showWorkoutForm("duplicate", workout)
                          }
                          onDelete={() => showWorkoutForm("delete", workout)}
                          workout={workout}
                        />
                      </div>
                    ))
                  )
                : Array(9)
                    .fill(0)
                    .map((_, i) => <WorkoutCardSkeleton key={i} />)}
            </Masonry>

            {hasNoWorkouts && (
              <p>No results found yet, start creating workouts</p>
            )}

            <div className="mb-10 h-10 w-1/2" ref={ref}></div>

            {isFetching &&
              hasNextPage &&
              Array(9)
                .fill(0)
                .map((_, i) => <WorkoutCardSkeleton key={i} />)}
          </div>
        </>
      )}
    </>
  );
};

export default Workouts;

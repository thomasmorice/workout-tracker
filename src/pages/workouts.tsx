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

      <div className="hero  rounded-3xl bg-base-200 py-16 ">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold sm:text-5xl ">Workout list</h1>
            <p className="py-6">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste,
              perspiciatis consequuntur in, similique quo magnam molestiae non
              delectus modi, beatae voluptatibus laboriosam.
            </p>

            {sessionData && (
              <button
                type="button"
                onClick={() => showWorkoutForm("create")}
                className="btn btn-primary"
              >
                Create a new workout
              </button>
            )}
          </div>
        </div>
      </div>
      {sessionData && (
        <>
          <div className="">
            {!hasNoWorkouts && (
              <div className="flex flex-wrap gap-2 items-center pt-8">
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

                <div className="input bg-base-200 w-full relative flex items-center justify-between">
                  <label className="z-10" htmlFor="searchWorkoutInput">
                    <MdSearch size={22} />
                  </label>
                  <input
                    id="searchWorkoutInput"
                    type="search"
                    placeholder="Search…"
                    value={searchTerm}
                    onChange={(e) => set_searchTerm(e.target.value)}
                    className="input absolute w-full left-0 px-12 bg-base-200"
                  />

                  {/* <div className="z-10">
                  <kbd className="kbd bg-base-100">⌘</kbd>
                  <kbd className="kbd bg-base-100">K</kbd>
                </div> */}
                </div>
              </div>
            )}

            <h2 className="text-2xl text-accent-content font-bold flex gap-3 items-center group cursor-pointer mt-12">
              Latest classified workouts
            </h2>

            <Masonry
              breakpointCols={{
                default: 3,
                1400: 2,
                1120: 1,
              }}
              className="-ml-8 flex w-auto pt-4 "
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

            <div className="mb-10 w-1/2 h-10" ref={ref}></div>

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

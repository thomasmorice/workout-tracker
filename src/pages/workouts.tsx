import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { useIntersectionObserver, useDebounce } from "usehooks-ts";
import WorkoutCard from "../components/Workout/WorkoutCard/WorkoutCard";
import WorkoutCardSkeleton from "../components/Workout/WorkoutCardSkeleton";
import { useWorkoutService } from "../services/useWorkoutService";
import { useWorkoutStore } from "../store/WorkoutStore";
import { MdSearch } from "react-icons/md";
import Header from "../components/Layout/Header";
import { useRouter } from "next/router";
import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../server/trpc/router/workout-router";

const Workouts: NextPage = () => {
  const { data: sessionData } = useSession();
  const ref = useRef<HTMLDivElement | null>(null);

  const entry = useIntersectionObserver(ref, {});
  const router = useRouter();

  const { toggleSelectWorkout, showWorkoutForm } = useWorkoutStore();
  const { getInfiniteWorkouts } = useWorkoutService();
  const [showWorkoutDetail, set_showWorkoutDetail] =
    useState<
      inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]["id"]
    >();
  const [classifiedOnly, set_classifiedOnly] = useState(true);
  const [searchTerm, set_searchTerm] = useState("");
  const [scrollPosition, set_scrollPosition] = useState(0);
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

  useEffect(() => {
    const id = parseInt(router.query.id as string, 10);

    // if (id) {
    //   set_scrollPosition(window.scrollY);
    // } else {
    //   window.scrollBy(0, scrollPosition);
    // }
    id ? set_showWorkoutDetail(id) : set_showWorkoutDetail(undefined);
  }, [router.query.id, showWorkoutDetail]);

  if (showWorkoutDetail) {
    const selectedWorkout = data?.pages.forEach((page) =>
      page.workouts.find((w) => w.id === showWorkoutDetail)
    );
    if (selectedWorkout) {
      return <WorkoutCard workout={selectedWorkout} isFullScreen />;
    }
  }

  return (
    <>
      <Head>
        <title>Workouts</title>
        <meta name="description" content="Manage and share your workouts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header h1={"Workout list"} />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => showWorkoutForm("create")}
          className="btn-primary btn-sm btn hidden md:block"
        >
          + Create a new workout
        </button>
      </div>

      {sessionData && (
        <>
          <div className="">
            <div className="flex flex-wrap items-center gap-2 md:pt-6">
              <div className="relative flex w-full items-center justify-between">
                <label
                  className="absolute z-10 ml-3"
                  htmlFor="searchWorkoutInput"
                >
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

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => set_classifiedOnly(false)}
                className={`badge badge-lg font-medium ${
                  !classifiedOnly ? "badge-primary" : ""
                }`}
              >
                All workouts
              </button>

              <button
                onClick={() => set_classifiedOnly(true)}
                className={`badge badge-lg font-medium ${
                  classifiedOnly ? "badge-primary" : ""
                }`}
              >
                Classified workouts
              </button>
            </div>

            <Masonry
              breakpointCols={{
                default: 3,
                1500: 2,
                1226: 1,
              }}
              className="-ml-16 mt-6 flex w-auto"
              columnClassName="pl-16 bg-clip-padding "
            >
              {data?.pages
                ? data.pages.map((page) =>
                    page.workouts.map((workout) => (
                      <div
                        // ref={showWorkoutDetail ? openedWorkoutRef : null}
                        key={workout.id}
                        className="relative mb-12"
                      >
                        <WorkoutCard
                          isFullScreen={workout.id === showWorkoutDetail}
                          onEdit={() => showWorkoutForm("edit", workout)}
                          onDuplicate={() =>
                            showWorkoutForm("duplicate", workout)
                          }
                          onSelect={() => toggleSelectWorkout(workout)}
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

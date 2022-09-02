import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { useIntersectionObserver, useDebounce } from "usehooks-ts";
import WorkoutCard from "../components/Workout/WorkoutCard";
import WorkoutCardSkeleton from "../components/Workout/WorkoutCardSkeleton";
import { useWorkoutService } from "../services/useWorkoutService";
import { useWorkoutFormStore } from "../store/WorkoutFormStore";
import { MdSearch } from "react-icons/md";

const Workouts: NextPage = () => {
  const { data: sessionData } = useSession();
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});

  const { showWorkoutForm } = useWorkoutFormStore();
  const { getInfiniteWorkouts } = useWorkoutService();

  const [classifiedOnly, set_classifiedOnly] = useState(true);
  const [searchTerm, set_searchTerm] = useState("");
  const searchTermDebounced = useDebounce<string>(searchTerm, 500);

  const { data, fetchNextPage, hasNextPage, isFetching, ...rest } =
    getInfiniteWorkouts({
      showClassifiedWorkoutOnly: classifiedOnly,
      searchTerm: searchTermDebounced,
    });

  useEffect(() => {
    !!entry?.isIntersecting && hasNextPage && fetchNextPage();
  }, [entry, fetchNextPage, hasNextPage]);

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
          <div className="pt-8">
            <div className="flex flex-wrap gap-2 items-center">
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

                <div className="z-10">
                  <kbd className="kbd bg-base-100">⌘</kbd>
                  <kbd className="kbd bg-base-100">K</kbd>
                </div>
              </div>
            </div>

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
                      <WorkoutCard
                        key={workout.id}
                        onEdit={() => showWorkoutForm("edit", workout)}
                        onDuplicate={() =>
                          showWorkoutForm("duplicate", workout)
                        }
                        onDelete={() => showWorkoutForm("delete", workout)}
                        workout={workout}
                      />
                    ))
                  )
                : Array(9)
                    .fill(0)
                    .map((_, i) => <WorkoutCardSkeleton key={i} />)}
            </Masonry>

            <div className="bg-white mb-10 w-1/2 h-10" ref={ref}></div>

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

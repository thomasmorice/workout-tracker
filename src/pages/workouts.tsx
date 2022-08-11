import { ElementType, Workout } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { useIntersectionObserver } from "usehooks-ts";
import WorkoutCard from "../components/Workout/WorkoutCard";
import WorkoutCardSkeleton from "../components/Workout/WorkoutCardSkeleton";
import { useWorkoutService } from "../hooks/useWorkoutService";
import { useToastStore } from "../store/ToastStore";
import { useWorkoutFormStore } from "../store/WorkoutFormStore";
import { trpc } from "../utils/trpc";

const Workouts: NextPage = () => {
  const { data: sessionData } = useSession();
  const { deleteWorkout } = useWorkoutService();
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});

  const [confirmDeleteWorkout, set_confirmDeleteWorkout] = useState<Workout>();

  const { addMessage, closeMessage } = useToastStore();
  const { showWorkoutForm } = useWorkoutFormStore();

  const [elementTypeFilter, set_elementTypeFilter] = useState<
    `${ElementType}`[]
  >([]);
  const [classifiedOnly, set_classifiedOnly] = useState(true);

  const { data, fetchNextPage, hasNextPage, isFetching, ...rest } =
    trpc.useInfiniteQuery(
      [
        "workout.get-infinite-workouts",
        {
          elementTypes: elementTypeFilter,
          classifiedOnly: classifiedOnly,
          limit: 12,
        },
      ],
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!sessionData,
      }
    );

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
            <h1 className="text-3xl font-bold sm:text-5xl">Workout list</h1>
            <p className="py-6">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste,
              perspiciatis consequuntur in, similique quo magnam molestiae non
              delectus modi, beatae voluptatibus laboriosam. Cum, neque iste
              minus debitis inventore excepturi pariatur!
            </p>

            {sessionData && (
              <button
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
            <div className="form-control items-start ">
              <label className="label cursor-pointer gap-2">
                <span className="label-text">
                  {classifiedOnly ? "Only classified" : "All workouts"}
                </span>
                <input
                  type="checkbox"
                  onChange={(e) => set_classifiedOnly(e.target.checked)}
                  className="toggle"
                  checked={classifiedOnly}
                />
              </label>
            </div>
            <Masonry
              breakpointCols={{
                default: 3,
                1400: 2,
                980: 1,
              }}
              className="-ml-8 flex w-auto pt-4"
              columnClassName="pl-8 bg-clip-padding"
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

            <div className="mb-10 w-1/2" ref={ref}></div>

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

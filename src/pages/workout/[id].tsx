import { NextPage } from "next";
import { useRouter } from "next/router";
import { useWorkoutService } from "../../services/useWorkoutService";
import Image from "next/image";
import formatDistance from "date-fns/formatDistance";
import { useSession } from "next-auth/react";

const Workout: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  const id = parseInt(router.query.id as string, 10);
  const { getWorkoutById } = useWorkoutService();
  const { data: workout, isFetching } = getWorkoutById(id);

  if (isFetching || sessionStatus === "loading") {
    return <>Loading...</>;
  }
  if (!sessionData) {
    return <>Not conneceted</>;
  }
  return (
    <>
      {workout ? (
        <>
          <div
            style={{}}
            // className="hero relative rounded-3xl overflow-hidden bg-[url('/workout-bg.avif')]"
            className="hero relative rounded-3xl overflow-hidden"
          >
            <div className="hero-overlay bg-opacity-60 bg-base-300"></div>
            <div className="hero-content text-center py-16 ">
              <div className="flex justify-between items-center">
                {/* Author */}
                <div className="flex items-center gap-3 absolute left-5 top-5 text-left">
                  <div className="mask mask-circle relative h-10 w-10 ">
                    <Image
                      layout="fill"
                      referrerPolicy="no-referrer"
                      src={workout.creator.image ?? "https://i.pravatar.cc/300"}
                      alt="Workout creator"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-lg leading-tight">
                      {workout?.creator.name}
                    </div>
                    <div className={`text-xs opacity-50 font-light`}>
                      Created{" "}
                      {formatDistance(new Date(), new Date(workout.createdAt))}{" "}
                      ago
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-md pt-8">
                <h1 className="text-3xl font-bold sm:text-5xl">
                  {workout.name ? workout.name : `Workout #${workout.id}`}
                </h1>
                <p className="py-6 whitespace-pre-wrap text-sm">
                  {workout.description}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl">
            Workout is unreacheable 😢 you might be
          </div>
          <ul className="list-decimal mt-3 ml-10 text-md">
            <li className="list-item">
              accessing a workout that does not exists
            </li>
            <li className="list-item">unauthorized to access it</li>
            <li className="list-item">complitely high..</li>
          </ul>
        </>
      )}
    </>
  );
};

export default Workout;

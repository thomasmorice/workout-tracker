import { NextPage } from "next";
import { useRouter } from "next/router";
import { useWorkoutService } from "../../hooks/useWorkoutService";
import Image from "next/image";
import formatDistance from "date-fns/formatDistance";

const Workouts: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);
  const { getWorkoutById } = useWorkoutService();
  const { data: workout, isFetching } = getWorkoutById(id);

  if (isFetching) {
    return <>Loading...</>;
  }
  return (
    <>
      {}
      {workout ? (
        <>
          <h1 className="card-title text-4xl">
            {workout.name ? workout.name : `#${workout.id}`}
          </h1>
          <div className="flex justify-between items-center">
            {/* Author */}
            <div className="flex items-center gap-3">
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
                  {formatDistance(new Date(), new Date(workout.createdAt))} ago
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl">
            {" "}
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

export default Workouts;

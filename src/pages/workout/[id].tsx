import { NextPage } from "next";
import { useRouter } from "next/router";

import WorkoutCard from "../../components/Workout/WorkoutCard/WorkoutCard";
import { Rings } from "react-loading-icons";
import WorkoutResults from "../../components/WorkoutResult/WorkoutResults";

import { trpc } from "../../utils/trpc";

const Workout: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);

  const { data: workout } = trpc.workout.getWorkoutById.useQuery(
    {
      id: id,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  return (
    <>
      {workout ? (
        <>
          {/* <Header
            onGoBack={() => router.back()}
            h1={workout.name ? workout.name : "Workout detail"}
          /> */}
          <div className="-ml-4 h-full w-[calc(100%_+_2rem)]">
            <WorkoutCard workout={workout} isFullScreen />
            <div className="mt-12 px-4">
              {<WorkoutResults workoutId={workout.id} />}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* <Header onGoBack={() => router.back()} h1={"Workout detail"} /> */}
          <div className=" flex h-screen w-screen items-center justify-center">
            <Rings strokeWidth={1.5} width={64} height={64} />
          </div>
        </>
      )}
    </>
  );
};

export default Workout;

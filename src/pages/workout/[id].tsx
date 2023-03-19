import { NextPage } from "next";
import { useRouter } from "next/router";
import { useWorkoutService } from "../../services/useWorkoutService";
import WorkoutCard from "../../components/Workout/WorkoutCard/WorkoutCard";
import { Rings } from "react-loading-icons";
import WorkoutResults from "../../components/WorkoutResult/WorkoutResults";

const Workout: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);
  const { getWorkoutById } = useWorkoutService();
  const { data: workout } = getWorkoutById(id);

  return (
    <>
      {workout ? (
        <div className="-ml-4 h-full w-[calc(100%_+_2rem)]">
          <WorkoutCard workout={workout} isFullScreen />
          <div className="mt-12 px-4">
            {<WorkoutResults workoutId={workout.id} />}
          </div>
        </div>
      ) : (
        <div className=" flex h-screen w-screen items-center justify-center">
          <Rings strokeWidth={1.5} width={64} height={64} />
        </div>
      )}
    </>
  );
};

export default Workout;

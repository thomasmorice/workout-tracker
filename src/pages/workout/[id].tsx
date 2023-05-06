import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import WorkoutAndResults from "../../components/Workout/WorkoutAndResults";

const Workout: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);
  const { data: workout, isFetching } = trpc.workout.getWorkoutById.useQuery(
    {
      id: id,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!id,
    }
  );
  return <>{workout && <WorkoutAndResults workout={workout} />}</>;
};

export default Workout;

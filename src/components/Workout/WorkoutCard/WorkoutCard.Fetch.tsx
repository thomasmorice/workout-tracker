import { inferRouterOutputs } from "@trpc/server";
import { Rings } from "react-loading-icons";
import { WorkoutRouterType } from "../../../server/trpc/router/WorkoutRouter/workout-router";
import { trpc } from "../../../utils/trpc";
import WorkoutResults from "../../WorkoutResult/WorkoutResults";
import WorkoutCard from "./WorkoutCard";

type WorkoutCardFullProps = {
  id: inferRouterOutputs<WorkoutRouterType>["getWorkoutById"]["id"];
};

export default function WorkoutCardFull({ id }: WorkoutCardFullProps) {
  const { data: workout, isFetching } = trpc.workout.getWorkoutById.useQuery(
    {
      id: id,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  if (isFetching) {
    return (
      <div className=" flex h-screen w-screen items-center justify-center">
        <Rings strokeWidth={1.5} width={64} height={64} />
      </div>
    );
  } else if (workout) {
    return (
      <div className="-ml-4 w-[calc(100%_+_2rem)]">
        <WorkoutCard workout={workout} isFullScreen />
        <div className="mt-12 px-4">
          {<WorkoutResults workoutId={workout.id} />}
        </div>
      </div>
    );
  }
  return <></>;
}

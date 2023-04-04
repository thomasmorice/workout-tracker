import { inferRouterOutputs } from "@trpc/server";
import { Rings } from "react-loading-icons";
import { WorkoutRouterType } from "../../server/trpc/router/WorkoutRouter/workout-router";
import { useWorkoutStore } from "../../store/WorkoutStore";
import { trpc } from "../../utils/trpc";
import WorkoutResults from "../WorkoutResult/WorkoutResults";
import WorkoutCard from "./WorkoutCard/WorkoutCard";

type WorkoutAndResultsProps = {
  // id?: inferRouterOutputs<WorkoutRouterType>["getWorkoutById"]["id"];
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
};

export default function WorkoutAndResults({ workout }: WorkoutAndResultsProps) {
  // const { data: workout, isFetching } = trpc.workout.getWorkoutById.useQuery(
  //   {
  //     id: id,
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //     enabled: !!id,
  //   }
  // );

  const {
    closeWorkoutDetail: closeWorkoutDetailModal,
    toggleSelectWorkout,
    showWorkoutForm,
  } = useWorkoutStore();
  return (
    <>
      <div className="-ml-4 w-[calc(100%_+_2rem)]">
        <WorkoutCard
          onGoBack={closeWorkoutDetailModal}
          onSelect={() => toggleSelectWorkout(workout)}
          workout={workout}
          isFullScreen
        />
        <div className="mt-12 px-4">
          {<WorkoutResults workoutId={workout.id} />}
        </div>
      </div>
    </>
  );
}

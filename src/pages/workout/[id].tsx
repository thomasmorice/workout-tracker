import { NextPage } from "next";
import { useRouter } from "next/router";
import { useWorkoutService } from "../../services/useWorkoutService";
import WorkoutCard from "../../components/Workout/WorkoutCardSimple/WorkoutCard";
import Header from "../../components/Layout/Header";
import { TailSpin } from "react-loading-icons";
import WorkoutResultCard from "../../components/WorkoutResult/WorkoutResultCard";

const Workout: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);
  const { getWorkoutById } = useWorkoutService();
  const { data: workout, isFetching } = getWorkoutById(id);

  return (
    <>
      <>
        <Header
          h1={`${
            workout
              ? workout.name
                ? workout.name
                : `#${workout.id}`
              : `Workout`
          } details`}
        />
        {workout ? (
          <>
            <div className="max-w-2xl">
              <WorkoutCard workout={workout} />
            </div>
            <div className="mt-10">
              <h2 className="h2 mt-5 mb-8">Workout results</h2>
              <div className="flex flex-col gap-4">
                {workout.workoutResults.map((result) => (
                  <div
                    key={result.id}
                    className="rounded-xl border border-base-content border-opacity-10 bg-base-200"
                  >
                    <WorkoutResultCard
                      eventDate={result.workoutSession.event.eventDate}
                      result={result}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            Loading workout{" "}
            <TailSpin className="h-8" stroke="#2D68FF" speed={1.2} />
          </div>
        )}
      </>
    </>
  );
};

export default Workout;

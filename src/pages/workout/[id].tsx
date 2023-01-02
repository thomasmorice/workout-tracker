import { NextPage } from "next";
import { useRouter } from "next/router";
import { useWorkoutService } from "../../services/useWorkoutService";
import WorkoutCard from "../../components/Workout/WorkoutCard/WorkoutCard";
import Header from "../../components/Layout/Header";
import { Rings } from "react-loading-icons";
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
              <div className="flex flex-col gap-8">
                {workout.workoutResults.map((result) => (
                  <WorkoutResultCard
                    eventDate={result.workoutSession.event.eventDate}
                    key={result.id}
                    result={result}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            Loading workout <Rings />
          </div>
        )}
      </>
    </>
  );
};

export default Workout;

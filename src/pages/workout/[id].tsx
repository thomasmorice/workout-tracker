import { NextPage } from "next";
import { useRouter } from "next/router";
import { useWorkoutService } from "../../services/useWorkoutService";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import WorkoutCard from "../../components/Workout/WorkoutCard";
import Header from "../../components/Layout/Header";
import { Rings } from "react-loading-icons";

const Workout: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
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
            <WorkoutCard workout={workout} />
            <div className="mt-4">
              <h2 className="h2 mt-3 mb-8">Workout results</h2>
              {workout.workoutResults?.map((result) => (
                <div key={result.id}>
                  <div className="mt-4 ">
                    <div className="text-accent-content">
                      {format(
                        result.workoutSession.event.eventDate,
                        "do MMMM yyyy"
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm">
                      {result.description}
                    </p>
                    {result.totalReps && (
                      <p className="">{result.totalReps} reps</p>
                    )}
                    {(result.time || result.totalReps || result.weight) && (
                      <div className="badge badge-primary mt-4">
                        {result.time &&
                          format(result.time * 1000, "mm:ss' minutes'")}
                        {result.totalReps && `${result.totalReps} reps`}
                        {result.weight && `${result.weight}KG`}
                      </div>
                    )}
                  </div>
                  <div className="divider my-2 opacity-50"></div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            Loading workout <Rings />
          </div>
        )}
      </>
    </>
  );
};

export default Workout;

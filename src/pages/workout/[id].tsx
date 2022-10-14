import { NextPage } from "next";
import { useRouter } from "next/router";
import { useWorkoutService } from "../../services/useWorkoutService";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import WorkoutCard from "../../components/Workout/WorkoutCard";

const Workout: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  const id = parseInt(router.query.id as string, 10);
  const { getWorkoutById } = useWorkoutService();
  const { data: workout, isFetching } = getWorkoutById(id);

  const secondsToMinutesAndSeconds = (time: number) => {
    const minutes = Math.floor(time / 60);
    return {
      minutes,
      seconds: time - minutes * 60,
    };
  };

  if (isFetching || sessionStatus === "loading") {
    return <>Loading...</>;
  }
  if (!sessionData) {
    return <>Not connected</>;
  }

  return (
    <>
      {workout ? (
        <>
          <h1 className="h1 mt-3 mb-8">Workout details</h1>
          <h2 className="h2 mt-3 mb-8">
            <div className="card-title text-2xl">
              {workout.name ? workout.name : `#${workout.id}`}
            </div>
          </h2>
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
        <>
          <div className="text-2xl">
            Workout is unreacheable 😢 you might be
          </div>
          <ul className="text-md mt-3 ml-10 list-decimal">
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

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useWorkoutService } from "../../services/useWorkoutService";
import { format } from "date-fns";
import WorkoutCard from "../../components/Workout/WorkoutCard";
import Header from "../../components/Layout/Header";
import { Rings } from "react-loading-icons";
import { MdEdit } from "react-icons/md";
import { resultHasBenchmarkeableWorkout } from "../../utils/utils";
import { moods } from "../../components/MoodSelector/MoodSelector";

const Workout: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);
  const { getWorkoutById } = useWorkoutService();
  const { data: workout, isFetching } = getWorkoutById(id);

  const MoodIcon = ({
    moodIndex,
    props,
  }: {
    moodIndex: number;
    props: any;
  }) => {
    const Icon = moods.find((mood) => mood.key === moodIndex)?.icon;
    return <>{Icon && <Icon {...props} />}</>;
  };

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
                {workout.workoutResults
                  ?.sort(
                    (a, b) =>
                      new Date(a.workoutSession.event.eventDate).getDate() -
                      new Date(b.workoutSession.event.eventDate).getDate()
                  )
                  .map((result) => (
                    <div key={result.id}>
                      <div className="card relative bg-base-200 transition-all duration-300">
                        <div className="card-body">
                          <div className="flex flex-col gap-4">
                            <div className="text-sm text-accent-content">
                              {`Event date:  ${format(
                                result.workoutSession.event.eventDate,
                                "do MMMM yyyy"
                              )}`}
                            </div>
                            <div className="flex items-center gap-3">
                              {result.isRx && (
                                <div className="badge  badge-success">RX</div>
                              )}
                              {result.rating && (
                                <div className="badge badge-success">
                                  <MoodIcon
                                    props={{
                                      size: "18px",
                                    }}
                                    moodIndex={result.rating}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="whitespace-pre-wrap text-xs opacity-80">
                              {result.description}
                            </div>
                            {resultHasBenchmarkeableWorkout(result) && (
                              <div className="badge badge-primary">
                                {result.time &&
                                  format(result.time * 1000, "mm:ss' minutes'")}
                                {result.totalReps && `${result.totalReps} reps`}
                                {result.weight && `${result.weight}KG`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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

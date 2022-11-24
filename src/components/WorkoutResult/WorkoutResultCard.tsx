import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { MdEdit } from "react-icons/md";
import { WorkoutRouterType } from "../../server/trpc/router/workout-router";
import { WorkoutResultInputsWithWorkout } from "../../types/app";
import { resultHasBenchmarkeableWorkout } from "../../utils/utils";
import { moods } from "../MoodSelector/MoodSelector";

interface WorkoutResultCardProps {
  result:
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"]["workoutResults"][number]
    | WorkoutResultInputsWithWorkout;
  eventDate?: Date;
  onEdit?: () => void;
  onOpen?: () => void;
}

export default function WorkoutResultCard({
  result,
  onOpen,
  onEdit,
  eventDate,
}: WorkoutResultCardProps) {
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
    <div className="card relative bg-base-200 transition-all duration-300">
      <div className="card-body">
        <div className="flex flex-col gap-4">
          {eventDate && (
            <div className="text-sm text-accent-content">
              {`Event date:  ${format(eventDate, "do MMMM yyyy")}`}
            </div>
          )}
          <div className="flex items-center gap-3">
            {result.isRx && <div className="badge  badge-success">RX</div>}
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
              {result.time && format(result.time * 1000, "mm:ss' minutes'")}
              {result.totalReps && `${result.totalReps} reps`}
              {result.weight && `${result.weight}KG`}
            </div>
          )}
        </div>
        {onEdit && (
          <div className="card-actions justify-end pt-5">
            <button
              type="button"
              onClick={onEdit}
              className="btn-outline btn btn-sm z-20 gap-x-2 text-xs"
            >
              <MdEdit size={17} /> {`Edit result`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

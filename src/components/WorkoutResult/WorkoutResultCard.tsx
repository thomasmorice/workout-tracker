import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { MdEdit, MdOutlineCalendarToday } from "react-icons/md";
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
    <div className="card relative -z-10 rounded-xl border border-base-content pt-8">
      <div className=" card-body  p-5">
        <h3 className="h3">
          {eventDate && (
            <div className="mb-3 flex items-center gap-2">
              <MdOutlineCalendarToday />
              {`${format(eventDate, "do MMMM yyyy")}`}
            </div>
          )}
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {result.isRx && <div className="badge-success  badge">RX</div>}
            {result.rating && (
              <div className="badge-success badge">
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
            <div className="badge-primary badge">
              {result.time && format(result.time * 1000, "mm:ss' minutes'")}
              {result.totalReps && `${result.totalReps} reps`}
              {result.weight && `${result.weight}KG`}
            </div>
          )}
        </div>
        {onEdit && (
          <div className="card-actions justify-end pt-3">
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

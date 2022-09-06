import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import {
  MdDragIndicator,
  MdTimer,
  MdEdit,
  MdDelete,
  MdLink,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { WorkoutResultWithWorkout } from "../../../types/app";
import { format } from "date-fns";
import { moods } from "../../MoodSelector/MoodSelector";

interface WorkoutSessionResultItemProps {
  result: WorkoutResultWithWorkout;
  isDone: boolean;
  onOpenWorkoutResultDetail: () => void;
  onRemoveWorkoutResult: () => void;
  onMoveResultDown: () => void;
  onMoveResultUp: () => void;
}

export default function WorkoutSessionResultItem({
  result,
  onOpenWorkoutResultDetail,
  isDone,
  onRemoveWorkoutResult,
  onMoveResultDown,
  onMoveResultUp,
}: WorkoutSessionResultItemProps) {
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const [isDragging, set_isDragging] = useState(false);

  const hasResults = useMemo(() => {
    if (
      isDone &&
      (result.isRx ||
        result.description !== "" ||
        result.totalReps ||
        result.weight ||
        result.rating ||
        result.time)
    ) {
      return true;
    }
    return false;
  }, [result, isDone]);

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
    <Reorder.Item
      dragListener={false}
      dragControls={dragControls}
      value={result}
      whileDrag={{
        scale: 1.02,
        position: "relative",
      }}
      onPointerDown={() => set_isDragging(true)}
      onPointerUp={() => set_isDragging(false)}
      className="mb-5"
    >
      <div className="relative card mb-2 bg-base-200 transition-all hover:shadow-lg duration-300">
        <div className="card-body p-5">
          {/* Drag & drop on desktop */}
          <div
            className={`absolute p-2 top-4 right-1.5  cursor-grab hidden md:flex ${
              isDragging ? "z-50" : ""
            }`}
            onPointerDown={(event) => {
              event.preventDefault();
              dragControls.start(event);
            }}
          >
            <MdDragIndicator className="w-7 h-7" />
          </div>

          {/* Move position on phone */}

          <div className="md:hidden absolute right-4">
            <div className="btn-group">
              <button
                disabled={!onMoveResultDown}
                onClick={onMoveResultDown}
                type="button"
                className="btn btn-sm"
              >
                <MdOutlineArrowDropDown size="24px" />
              </button>
              <button
                disabled={!onMoveResultUp}
                onClick={onMoveResultUp}
                type="button"
                className="btn btn-sm"
              >
                <MdOutlineArrowDropUp size="24px" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <a
                className="inline-flex items-center text-lg gap-2 hover:underline"
                target="blank"
                href={`/workout/${result.workoutId}`}
              >
                {result.workout.name && result.workout.name !== ""
                  ? result.workout.name
                  : `#${result.workout.id}`}
                <MdLink size={19} />
              </a>
              <div className="text-sm opacity-80 flex items-center gap-x-0.5">
                {result.workout.totalTime && (
                  <>
                    <MdTimer /> {`${result.workout.totalTime}mn`}
                  </>
                )}
              </div>
            </div>

            <div
              className={`text-xs opacity-50 font-light  whitespace-pre-wrap max-h-28 overflow-y-scroll`}
            >
              {result.workout.description}
            </div>
          </div>

          <div className="divider opacity-50 my-2"></div>

          {hasResults && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {result.isRx && <div className="badge  badge-success">RX</div>}
                {result.rating && (
                  <div>
                    <MoodIcon
                      props={{
                        size: "32px",
                        className: "badge badge-success",
                      }}
                      moodIndex={result.rating}
                    />
                  </div>
                )}
              </div>
              <div className="whitespace-pre-wrap text-xs opacity-80">
                {result.description}
              </div>
              {(result.time || result.totalReps || result.weight) && (
                <div className="badge badge-primary">
                  {result.time && format(result.time * 1000, "mm:ss' minutes'")}
                  {result.totalReps && `${result.totalReps} reps`}
                  {result.weight && `${result.weight}KG`}
                </div>
              )}
            </div>
          )}

          <div className="card-actions justify-end mt-2">
            <div className="btn-group ">
              {isDone && (
                <button
                  type="button"
                  onClick={onOpenWorkoutResultDetail}
                  className="btn btn-sm btn-outline gap-x-2 text-xs"
                >
                  <MdEdit size={17} />{" "}
                  {`${hasResults ? "Edit" : "Save"} the result`}
                </button>
              )}

              <button
                type="button"
                onClick={onRemoveWorkoutResult}
                className="btn btn-sm btn-outline btn-error text-xs"
              >
                <MdDelete size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}

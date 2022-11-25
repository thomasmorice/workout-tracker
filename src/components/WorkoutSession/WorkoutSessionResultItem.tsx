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
import { WorkoutResultInputsWithWorkout } from "../../types/app";
import { format } from "date-fns";
import { moods } from "../MoodSelector/MoodSelector";
import {
  resultHasBenchmarkeableWorkout,
  workoutResultIsFilled,
} from "../../utils/utils";
import WorkoutResultCard from "../WorkoutResult/WorkoutResultCard";

interface WorkoutSessionResultItemProps {
  result: WorkoutResultInputsWithWorkout;
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
    if (isDone && workoutResultIsFilled(result)) {
      return true;
    }
    return false;
  }, [result, isDone]);

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
      className="mb-12"
    >
      <div className="relative flex flex-col gap-7">
        {/* Workout */}
        <div className="card relative  z-20 bg-base-200 transition-all duration-300">
          <div className="card-body p-4">
            <div
              className={`absolute top-3 right-3 hidden  cursor-grab items-center gap-2 p-2 md:flex`}
            >
              {/* Drag & drop on desktop */}
              <div
                className={`flex ${isDragging ? "z-50" : ""}`}
                onPointerDown={(event) => {
                  event.preventDefault();
                  dragControls.start(event);
                }}
              >
                <MdDragIndicator className="h-7 w-7" />
              </div>

              <button
                onClick={onRemoveWorkoutResult}
                type="button"
                className="btn btn-error btn-xs btn-circle"
              >
                <MdDelete size="18px" />
              </button>
            </div>

            {/* Move position on phone */}
            <div className="absolute right-4 md:hidden">
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
              <div className="flex flex-col gap-1 ">
                <a
                  className="flex max-w-[calc(100%_-_5rem)] gap-2 font-bold hover:underline"
                  target="blank"
                  href={`/workout/${result.workoutId}`}
                >
                  {result.workout.name && result.workout.name !== ""
                    ? result.workout.name
                    : `#${result.workout.id}`}
                </a>
                <div className="flex items-center gap-x-0.5 text-sm opacity-80">
                  {result.workout.totalTime && (
                    <>
                      <MdTimer /> {`${result.workout.totalTime}mn`}
                    </>
                  )}
                </div>
              </div>

              <div
                className={`whitespace-pre-wrap text-xs font-light opacity-80`}
              >
                {result.workout.description}
              </div>
            </div>
            <div className="card-actions items-center justify-end">
              <button
                onClick={onRemoveWorkoutResult}
                type="button"
                className="btn btn-error btn-sm items-center gap-2"
              >
                <MdDelete size="20px" /> Delete
              </button>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 bottom-0 border-[1px] border-dashed border-base-content"></div>
        {hasResults ? (
          <WorkoutResultCard
            onEdit={onOpenWorkoutResultDetail}
            result={result}
          />
        ) : (
          <button
            type="button"
            onClick={onOpenWorkoutResultDetail}
            className="btn btn-primary z-20 gap-x-2 text-xs"
          >
            <MdEdit size={17} /> {`Enter the result`}
          </button>
        )}
      </div>
    </Reorder.Item>
  );
}

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
import WorkoutCard from "../Workout/WorkoutCard/WorkoutCard";

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
    // <div className="group mb-12">
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
      className="group mb-12"
    >
      <WorkoutCard
        onMoveResultUp={onMoveResultUp}
        onMoveResultDown={onMoveResultDown}
        workout={result.workout}
        mode="for-result"
        footer={
          <div className="card-actions  items-center justify-end">
            <div className="btn-group">
              {!hasResults && (
                <button
                  type="button"
                  onClick={onOpenWorkoutResultDetail}
                  className="btn-outline btn btn-sm z-20 gap-x-2 text-xs"
                >
                  <MdEdit size={17} /> {`Enter the result`}
                </button>
              )}
              <button
                onClick={onRemoveWorkoutResult}
                type="button"
                className="btn-outline btn-error btn btn-sm items-center gap-2"
              >
                <MdDelete size="20px" />
              </button>
            </div>
          </div>
        }
      />

      {hasResults && (
        <div className="mx-2 -mt-8 rounded-b-xl border border-base-content border-opacity-10 bg-base-200 pt-8 transition-all group-hover:-mt-1">
          <WorkoutResultCard
            onEdit={onOpenWorkoutResultDetail}
            result={result}
          />
        </div>
      )}
    </Reorder.Item>
  );
}

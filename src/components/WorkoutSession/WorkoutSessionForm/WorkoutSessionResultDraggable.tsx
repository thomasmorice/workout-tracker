import { z } from "zod";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { CreateWorkoutSessionInputSchema } from "../../../server/router/workout-session";
import { DifficultyBadge } from "../../Workout/WorkoutBadges";
import { MdRemove, MdDragIndicator } from "react-icons/md";
import { useEffect, useState } from "react";

type CreateWorkoutSessionInput = z.infer<
  typeof CreateWorkoutSessionInputSchema
>["workoutResults"][number];

interface WorkoutSessionResultDraggableProps {
  result: CreateWorkoutSessionInput;
  onOpenWorkoutResultDetail: (result: CreateWorkoutSessionInput) => void;
  onRemoveWorkoutResult: (result: CreateWorkoutSessionInput) => void;
}

export default function WorkoutSessionResultDraggable({
  result,
  onOpenWorkoutResultDetail,
  onRemoveWorkoutResult,
}: WorkoutSessionResultDraggableProps) {
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const [isDragging, set_isDragging] = useState(false);

  useEffect(() => {
    if (isDragging) {
      document.body.classList.add("select-none", "touch-none");
    } else {
      document.body.classList.remove("select-none", "touch-none");
    }
  }, [isDragging]);

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={dragControls}
      style={{ y }}
      value={result}
      whileDrag={{
        scale: 1.02,
        position: "relative",
        zIndex: 999,
      }}
      onMouseDown={() => set_isDragging(true)}
      onMouseUp={() => set_isDragging(false)}
      onTouchStart={() => set_isDragging(true)}
      onTouchEnd={() => set_isDragging(false)}
      className="mb-5"
    >
      <div
        className={`flex flex-col px-5 py-4 bg-base-200 gap-1 rounded-lg transition-all ${
          isDragging && "shadow-xl bg-base-300"
        }`}
      >
        <MdDragIndicator
          onPointerDown={(e) => dragControls.start(e)}
          className="absolute right-3 w-7 h-7 cursor-pointer"
        />
        <div className=" flex items-center gap-2 ">
          {/* <div className="flex items-center ">
            <button
              type="button"
              onClick={() => onRemoveWorkoutResult(result)}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <MdRemove size={27} className="text-error p-1" />
            </button>
          </div> */}
          <div className="text-xl">
            {result.workout.name || `#${result.workout.id}`}
          </div>
          <DifficultyBadge difficulty={result.workout.difficulty} />
        </div>
        <div className="overflow-hidden text-ellipsis whitespace-pre-wrap cursor-default text-2xs mt-4">
          {result.workout.description}
        </div>
        <div className="flex mt-4  gap-2 items-center">
          <button
            type="button"
            onClick={() => {
              onOpenWorkoutResultDetail(result);
            }}
            className="btn btn-primary btn-sm w-1/2"
          >
            <div className="">{`${
              result.workout.description ? "edit" : "save"
            } result`}</div>
          </button>

          <button
            type="button"
            onClick={() => onRemoveWorkoutResult(result)}
            className="btn btn-sm btn-error w-1/2"
          >
            Remove workout
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

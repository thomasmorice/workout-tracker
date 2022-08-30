import { z } from "zod";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { CreateWorkoutSessionInputSchema } from "../../../server/router/workout-session";
import { DifficultyBadge } from "../../Workout/WorkoutBadges";
import { MdRemove, MdDragIndicator } from "react-icons/md";
import { useState } from "react";

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
  const [isDragged, set_isDragged] = useState(false);
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
      onMouseDown={() => {
        document.body.classList.add("select-none");
        set_isDragged(true);
      }}
      onMouseUp={() => {
        document.body.classList.add("select-none");
        set_isDragged(false);
      }}
      className="mb-5"
    >
      <div
        className={`flex flex-col px-5 py-4 bg-base-200 gap-1 rounded-lg transition-all ${
          isDragged && "shadow-xl bg-base-300"
        }`}
      >
        <MdDragIndicator
          onPointerDown={(e) => dragControls.start(e)}
          className="absolute right-2 w-7 h-7 cursor-pointer"
        />
        <div className=" flex items-center gap-2 ">
          <div className="flex items-center ">
            <button
              type="button"
              onClick={() => onRemoveWorkoutResult(result)}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <MdRemove size={27} className="text-error p-1" />
            </button>
          </div>
          <div className="text-xl">
            {result.workout.name || `#${result.workout.id}`}
          </div>
          <DifficultyBadge difficulty={result.workout.difficulty} />
        </div>
        <div className="overflow-hidden text-ellipsis whitespace-pre-wrap cursor-default text-2xs">
          {result.workout.description}
        </div>
        <button
          type="button"
          onClick={() => {
            onOpenWorkoutResultDetail(result);
          }}
          className="mt-4 btn btn-primary btn-sm"
        >
          <div className="">{`${
            result.workout.description ? "edit" : "save"
          } result`}</div>
        </button>
      </div>
    </Reorder.Item>
  );
}

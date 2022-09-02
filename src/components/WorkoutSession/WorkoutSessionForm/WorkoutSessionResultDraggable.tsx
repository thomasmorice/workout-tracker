import { z } from "zod";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { CreateWorkoutSessionInputSchema } from "../../../server/router/workout-session";
import { DifficultyBadge } from "../../Workout/WorkoutBadges";
import {
  MdRemove,
  MdDragIndicator,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { useLockedBody } from "usehooks-ts";
import { CreateWorkoutSessionResultInput } from "../../../server/router/workout-result";

interface WorkoutSessionResultDraggableProps {
  result: CreateWorkoutSessionResultInput;
  onOpenWorkoutResultDetail: (result: CreateWorkoutSessionResultInput) => void;
  onRemoveWorkoutResult: () => void;
  onMoveResultDown?: () => void;
  onMoveResultUp?: () => void;
}

export default function WorkoutSessionResultDraggable({
  result,
  onOpenWorkoutResultDetail,
  onRemoveWorkoutResult,
  onMoveResultDown,
  onMoveResultUp,
}: WorkoutSessionResultDraggableProps) {
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const [isDragging, set_isDragging] = useState(false);
  const [locked, set_locked] = useLockedBody();
  const [showExpandedDescription, set_showExpandedDescription] =
    useState(false);

  useEffect(() => {
    // if (isDragging) {
    //   set_locked(true);
    //   document.body.classList.add("select-none", "touch-none");
    // } else {
    //   set_locked(false);
    //   document.body.classList.remove("select-none", "touch-none");
    // }
  }, [isDragging, set_locked]);

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={dragControls}
      // style={{ y }}
      value={result}
      drag={"y"}
      whileDrag={{
        scale: 1.02,
        position: "relative",
      }}
      onPointerDown={() => set_isDragging(true)}
      onPointerUp={() => set_isDragging(false)}
      className="mb-5"
    >
      <div
        className={`flex flex-col px-5 py-4 bg-base-200 gap-1 rounded-lg transition-all ${
          isDragging && "relative shadow-lg shadow-base-100 md:bg-base-300 z-40"
        }`}
      >
        <div className=" flex items-center gap-2 ">
          <div className="text-xl">
            {result.workout.name || `#${result.workout.id}`}
          </div>
          <DifficultyBadge difficulty={result.workout.difficulty} />

          <div
            className={`absolute p-2 right-4  cursor-grab hidden md:flex ${
              isDragging ? "z-50" : ""
            }`}
            onPointerDown={(event) => {
              event.preventDefault();
              dragControls.start(event);
            }}
          >
            <MdDragIndicator className="w-7 h-7" />
          </div>

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
        </div>
        <div className="relative group p-2 bg-base-100 rounded-md overflow-y-scroll whitespace-pre-wrap max-h-28 cursor-default leading-[1.2rem] text-2xs mt-4 hover:bg-base-300">
          {result.workout.description}
        </div>

        <div className="flex mt-4  gap-2 items-center">
          <button
            type="button"
            onClick={() => {
              onOpenWorkoutResultDetail(result);
            }}
            className="btn btn-primary btn-sm w-1/2 text-xs"
          >
            <div className="">{`${
              result.workout.description ? "edit" : "save"
            } result`}</div>
          </button>

          <button
            type="button"
            onClick={onRemoveWorkoutResult}
            className="btn btn-sm btn-error w-1/2 text-xs"
          >
            Remove workout
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

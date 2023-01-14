import { format } from "date-fns";
import Image from "next/image";
import { MdDone, MdOutlineTimelapse } from "react-icons/md";

import { WiMoonNew } from "react-icons/wi";
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { inferRouterOutputs } from "@trpc/server";
import { enumToString } from "../../../utils/formatting";
import Dropdown from "../../Dropdown/Dropdown";
import { useMemo, useState } from "react";
import { useFloatingActionButtonStore } from "../../../store/FloatingActionButtonStore";
import { useLongPress } from "use-long-press";
import { motion } from "framer-motion";
import { GiButtonFinger } from "react-icons/gi";

interface WorkoutCardProps {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
  isSelected?: boolean;
  hasSelection?: boolean;
  onDuplicate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  onMoveResultUp?: () => void;
  onMoveResultDown?: () => void;
  footer?: React.ReactElement;
  mode?: "card" | "selecteable" | "for-result";
}

export default function WorkoutCard({
  workout,
  mode = "card",
  onDuplicate,
  onEdit,
  onDelete,
  onSelect,
  onMoveResultUp,
  onMoveResultDown,
  footer,
}: WorkoutCardProps) {
  const { data: sessionData } = useSession();
  const { isSelected, hasSelection } = useFloatingActionButtonStore();
  const [showFullDescription, set_showFullDescription] = useState(false);

  const onLongPress = useLongPress(() => {
    onSelect && onSelect();
  });

  const workoutActions = useMemo(() => {
    const actions = [];
    if (onMoveResultUp) {
      actions.push({
        label: "Move result up",
        onClick: onMoveResultUp,
      });
    }
    if (onMoveResultDown) {
      actions.push({
        label: "Move result down",
        onClick: onMoveResultDown,
      });
    }
    if (onSelect) {
      actions.push({
        label: "Select workout",
        onClick: onSelect,
      });
    }
    if (onDuplicate) {
      actions.push({
        label: "Duplicate",
        onClick: onDuplicate,
      });
    }
    if (onEdit) {
      actions.push({
        label: "Edit",
        onClick: onEdit,
      });
    }
    if (onDelete) {
      actions.push({
        label: "Delete",
        onClick: onDelete,
      });
    }
    return actions;
  }, [
    onMoveResultUp,
    onMoveResultDown,
    onSelect,
    onDuplicate,
    onEdit,
    onDelete,
  ]);

  return (
    <div
      style={{
        boxShadow: isSelected(workout)
          ? "0px 0px 11px 8px rgba(0, 0, 0, 0.1)"
          : "0px 4px 4px rgba(0, 0, 0, 0.1)",
      }}
      className={`
        ${
          isSelected(workout)
            ? "scale-[0.97] border-primary border-opacity-70"
            : "border-base-content border-opacity-[0.1]"
        }
        relative flex flex-col rounded-xl border-4  bg-base-200 bg-opacity-50  px-6 pt-8 pb-5 pr-10 transition-all`}
    >
      <div
        style={{ writingMode: "vertical-rl" }}
        className="absolute right-0 top-0 flex h-full w-6 rotate-180 items-center justify-center rounded-l-xl bg-base-300 text-[0.85rem] font-bold leading-[10px] tracking-[0.2rem] text-base-content text-opacity-50"
      >
        {enumToString(workout.workoutType ?? "")}
      </div>
      {/* Header */}
      <div className="flex w-full justify-between" {...onLongPress()}>
        <div className="flex items-center gap-2">
          <div
            className="tooltip tooltip-right z-20"
            data-tip={`Created by ${workout.creator.name}`}
          >
            <div className="mask mask-circle relative h-8 w-8 ">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={workout.creator.image ?? "https://i.pravatar.cc/300"}
                alt="Workout creator"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[3px]">
            <div className="text-sm font-semibold leading-none tracking-tight">
              {workout.creator.name}
            </div>
            <div className="text-[0.83rem] font-light leading-none opacity-60">
              {format(workout.createdAt, "dd MMM yy 'at' p")}
            </div>
          </div>
        </div>

        {isSelected(workout) || hasSelection() ? (
          <div
            onClick={onSelect}
            className={`
              btn-outline btn-sm btn-circle btn border-base-content  text-base-content  hover:border-opacity-100 hover:bg-base-300 hover:text-base-content hover:text-opacity-80
              ${
                hasSelection() &&
                "border-opacity-40 text-opacity-40 hover:border-opacity-40 hover:text-opacity-40"
              }
              ${
                isSelected(workout) &&
                "border-opacity-90 bg-primary text-opacity-90 hover:border-opacity-90 hover:text-opacity-100"
              }
            `}
          >
            <MdDone size={17} />
          </div>
        ) : (
          <Dropdown
            buttons={workoutActions}
            containerClass="dropdown-left bg-base-100"
          >
            <div
              className={`btn-outline btn-sm btn-circle btn border-base-content text-base-content opacity-50  hover:bg-base-300 hover:text-base-content hover:text-opacity-80`}
            >
              <HiOutlineEllipsisHorizontal size={17} />
            </div>
          </Dropdown>
        )}
      </div>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-1">
        <div className="badge">{enumToString(workout.elementType)}</div>
        {workout.difficulty && (
          <div
            className={`
          ${
            workout.difficulty === "GREEN" &&
            "border-green-300 bg-green-700  text-green-300"
          }
          ${
            workout.difficulty === "YELLOW" &&
            "border-yellow-300  bg-yellow-700  text-yellow-300"
          }
          ${
            workout.difficulty === "RED" &&
            "border-red-300  bg-red-700  text-red-300 "
          }
          ${workout.difficulty === "BLACK" && ""}
        badge `}
          >
            {workout.difficulty}
          </div>
        )}

        {workout.totalTime && (
          <div className="badge items-center gap-0.5">
            <MdOutlineTimelapse size={15} />
            {workout.totalTime}mn
          </div>
        )}
        {workout._count.workoutResults > 0 ? (
          <div className="badge flex gap-0.5">
            <MdDone className="" size={15} />
            {workout._count.workoutResults} result
          </div>
        ) : (
          <div className="badge flex gap-0.5">
            <WiMoonNew className="" size={15} />
            no result
          </div>
        )}
      </div>

      <div className="mt-4 whitespace-pre-wrap font-script">
        {workout.name && <div className="text-xl">{workout.name}</div>}
        <div
          style={
            {
              // textShadow: `0 0 1px #FFffff`,
            }
          }
          className={`
          mt-1 text-sm leading-6  tracking-wider text-base-content transition-all 
          ${isSelected(workout) ? "text-opacity-100" : "text-opacity-80"}
        `}
        >
          {showFullDescription
            ? workout.description
            : workout.description.substring(0, 120)}

          <>
            <div>
              <button
                onClick={() => set_showFullDescription(!showFullDescription)}
                className="underline"
              >
                show {`${showFullDescription ? "less" : "more"}`}
              </button>
            </div>
          </>
        </div>
      </div>

      {/* Footer */}

      <div className="mt-3 flex items-center gap-1"></div>
    </div>
  );
}

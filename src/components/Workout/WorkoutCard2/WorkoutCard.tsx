import { format } from "date-fns";
import Image from "next/image";
import {
  MdDone,
  MdDelete,
  MdCopyAll,
  MdEdit,
  MdOutlineExpandMore,
  MdOutlineExpandLess,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md";
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { inferRouterOutputs } from "@trpc/server";
import { HiDotsHorizontal } from "react-icons/hi";
import { TbLink } from "react-icons/tb";
import useCollapse from "react-collapsed";
import { IoAddCircle, IoTimerOutline } from "react-icons/io5";
import { enumToString } from "../../../utils/formatting";

interface WorkoutCardProps {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
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

  return (
    <div
      style={{
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
      }}
      className={`relative flex flex-col rounded-xl border border-base-content border-opacity-[0.15] bg-base-100 px-4 pt-5 pb-3 pr-8`}
    >
      {/* Header */}
      <div className="flex w-full justify-between">
        <div
          style={{ writingMode: "vertical-rl" }}
          className="absolute right-0 top-0 flex h-full w-6 rotate-180 items-center justify-center rounded-l-xl bg-base-200 text-[0.85rem] font-bold leading-[10px] tracking-[0.2rem] text-base-content text-opacity-30"
        >
          {enumToString(workout.workoutType ?? "")}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="tooltip tooltip-right z-40"
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

          <div className="flex flex-col gap-0.5">
            <div className="text-sm font-semibold leading-none tracking-tight">
              {workout.creator.name}
            </div>
            <div className="text-[0.83rem] font-light leading-none opacity-60">
              {format(workout.createdAt, "dd MMM yy 'at' p")}
            </div>
          </div>
        </div>

        <button className="btn-outline btn-square btn-sm btn border-base-content border-opacity-25 text-base-content text-opacity-60 hover:border-opacity-50 hover:bg-base-300 hover:text-base-content hover:text-opacity-80 ">
          <HiOutlineEllipsisHorizontal size={17} />
        </button>
      </div>

      {/* Badges */}
      <div className="mt-4 flex gap-1.5">
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
          ${
            workout.difficulty === "BLACK" &&
            "border-base-content  bg-black  text-base-content"
          }
        badge border-opacity-70 bg-opacity-[0.35] `}
          >
            {workout.difficulty}
          </div>
        )}
      </div>

      <div className="mt-2 whitespace-pre-wrap font-script">
        {workout.name && <div className="text-xl">{workout.name}</div>}
        <div className="mt-1 text-sm leading-[1.45rem] text-base-content text-opacity-75">
          {workout.description}
        </div>
      </div>
    </div>
  );
}

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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { inferRouterOutputs } from "@trpc/server";
import { HiDotsHorizontal } from "react-icons/hi";
import { TbLink } from "react-icons/tb";
import useCollapse from "react-collapsed";
import { IoAddCircle, IoTimerOutline } from "react-icons/io5";
import WorkoutCardBadges from "./WorkoutCardBadges";

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

  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    collapsedHeight: mode === "selecteable" ? 48 : 128,
  });

  return (
    <div
      className={`workout-card group relative ${workout.difficulty?.toLowerCase()}`}
    >
      <div className={`glowing-bg -z-10`}></div>

      <div className="card z-10 bg-base-100 p-6">
        {/* Title and actions */}
        <div className="flex items-center justify-between">
          <Link
            className="flex flex-wrap items-center gap-2 text-sm font-bold uppercase text-white opacity-75 transition-all hover:gap-4"
            href={`/workout/${workout.id}`}
          >
            <TbLink size={16} />
            {workout.name ? (
              workout.name
            ) : (
              <div>
                Workout N°
                {workout.id}
              </div>
            )}
          </Link>

          {/* Card actions */}
          {mode === "card" && (
            <div className="dropdown-end dropdown">
              <label tabIndex={0} className="btn btn-square btn-sm">
                <HiDotsHorizontal />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-52 bg-base-100 p-1 shadow"
              >
                <li>
                  <a onClick={onEdit}>
                    <MdEdit size={17} /> Edit
                  </a>
                </li>
                <li>
                  <a onClick={onDuplicate}>
                    <MdCopyAll size={17} />
                    Duplicate
                  </a>
                </li>
                <li>
                  <a onClick={onDelete}>
                    <MdDelete size={17} />
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          )}

          {mode === "selecteable" && (
            <button type="button" onClick={onSelect} className="btn btn-sm">
              <IoAddCircle size={19} />
            </button>
          )}

          {mode === "for-result" && (
            <>
              {/* Move position on phone */}
              <div className="absolute right-4 md:hidden">
                <div className="btn-group">
                  <button
                    disabled={!onMoveResultDown}
                    onClick={onMoveResultDown}
                    type="button"
                    className="btn-outline btn btn-xs"
                  >
                    <MdOutlineArrowDropDown size="20px" />
                  </button>
                  <button
                    disabled={!onMoveResultUp}
                    onClick={onMoveResultUp}
                    type="button"
                    className="btn-outline btn btn-xs "
                  >
                    <MdOutlineArrowDropUp size="20px" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Badges */}
        <div className="mt-5 flex items-center justify-between">
          <WorkoutCardBadges workout={workout} />
        </div>

        <div
          className={`mt-3 whitespace-pre-wrap  text-[0.75rem] leading-5 text-base-content transition-opacity  ${
            isExpanded || mode === "for-result"
              ? "text-opacity-95"
              : "text-opacity-70"
          }`}
          {...getToggleProps()}
        >
          <div
            className="p-1"
            {...(mode !== "for-result" && { ...getCollapseProps() })}
          >
            {workout.description}
          </div>
          <div className="divider w-full opacity-50">
            <div className="flex cursor-pointer flex-col items-center text-xs">
              {mode !== "for-result" &&
                (isExpanded ? (
                  <>
                    COLLAPSE <MdOutlineExpandLess />
                  </>
                ) : (
                  <>
                    EXPAND <MdOutlineExpandMore />
                  </>
                ))}
            </div>
          </div>
        </div>

        {/* Illustration */}
        {/* <div className="relative my-5 h-44 w-full">
        <Image
          className="rounded-lg object-cover"
          fill
          src="/workout-illustration/deadlift.jpeg"
          alt="Deadlift"
        />
      </div> */}

        {/* Footer */}
        <>
          {mode === "card" && (
            <div className="flex w-full items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {workout.creator && (
                  <div
                    className="tooltip tooltip-right z-40"
                    data-tip={`Created by ${workout.creator.name}`}
                  >
                    <div className="mask mask-circle relative h-7 w-7 ">
                      <Image
                        fill
                        referrerPolicy="no-referrer"
                        src={
                          workout.creator.image ?? "https://i.pravatar.cc/300"
                        }
                        alt="Workout creator"
                      />
                    </div>
                  </div>
                )}
                <div className="badge text-xs">
                  {format(workout.createdAt, "dd/MM/yyyy")}
                </div>
              </div>
              {workout._count && (
                <div
                  className="tooltip tooltip-left "
                  data-tip={`Done ${workout._count.workoutResults} times`}
                >
                  <div className="badge flex gap-1">
                    <MdDone className="" size={17} />
                    {workout._count.workoutResults}
                  </div>
                </div>
              )}
            </div>
          )}
          {footer && footer}
        </>
      </div>
    </div>
  );
}

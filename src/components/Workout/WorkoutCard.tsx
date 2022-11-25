import { format } from "date-fns";
import Image from "next/image";
import {
  MdDone,
  MdDelete,
  MdTimer,
  MdCopyAll,
  MdEdit,
  MdOpenInNew,
  MdOutlineExpandMore,
  MdOutlineExpandLess,
  MdAdd,
} from "react-icons/md";
import { enumToString } from "../../utils/formatting";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { WorkoutRouterType } from "../../server/trpc/router/workout-router";
import { inferRouterOutputs } from "@trpc/server";

interface WorkoutCardProps {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
  condensed?: boolean;
  onDuplicate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
}

export default function WorkoutCard({
  workout,
  condensed,
  onDuplicate,
  onEdit,
  onDelete,
  onSelect,
}: WorkoutCardProps) {
  const { data: sessionData } = useSession();
  const [isCondensedCardExpanded, set_isCondensedCardExpanded] =
    useState(false);

  return (
    <div className="box group card mb-4 rounded-2xl">
      {condensed ? (
        <div className="card-body p-5 pb-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 leading-none transition-colors hover:text-primary-content">
              {workout.name ? workout.name : `#${workout.id}`}
              <button
                className="btn btn-primary btn-sm btn-circle"
                type="button"
                onClick={onSelect && onSelect}
              >
                <MdAdd size={22} />
              </button>
            </div>

            <div className={`text-xs`}>
              Created{" "}
              <span className="text-accent-content">
                {format(workout.createdAt, "MM/dd/yyyy")}
              </span>
            </div>
            <div className={`badge badge-primary text-xs font-medium `}>
              {enumToString(workout.elementType)}
            </div>
            <div className="divider my-0.5 opacity-50"></div>
            <div
              onClick={() =>
                set_isCondensedCardExpanded(!isCondensedCardExpanded)
              }
            >
              <div
                className={`description  overflow-hidden  whitespace-pre-wrap break-words text-[0.7rem] transition-all ${
                  isCondensedCardExpanded ? "max-h-[500px]" : "max-h-[64px]"
                }`}
              >
                {workout.description}
              </div>
              <div className="divider opacity-50">
                <div className="flex flex-col items-center text-xs">
                  {isCondensedCardExpanded ? (
                    <>
                      Collaps <MdOutlineExpandLess />
                    </>
                  ) : (
                    <>
                      EXPAND <MdOutlineExpandMore />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card-body">
            <div className="flex items-center justify-between">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="mask mask-circle relative h-10 w-10 ">
                  <Image
                    layout="fill"
                    referrerPolicy="no-referrer"
                    src={workout.creator.image ?? "https://i.pravatar.cc/300"}
                    alt="Workout creator"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-lg leading-tight">
                    {workout?.creator.name}
                  </div>
                  <div className={`text-xs font-light opacity-50`}>
                    Created on the{" "}
                    {/* {formatDistance(new Date(), new Date(workout.createdAt))} ago */}
                    {format(workout.createdAt, "MM/dd/yyyy")}
                  </div>
                </div>
              </div>

              {workout._count.workoutResults > 0 && (
                <div className="flex opacity-70">
                  <MdDone className="" size={21} />
                  <sup className="text-[0.65rem]">
                    {workout._count.workoutResults}
                  </sup>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="badges flex flex-wrap gap-2 pt-4 uppercase">
              {workout.difficulty && (
                <div
                  className={`badge badge-outline text-xs font-medium text-${workout.difficulty.toLowerCase()}-600
          ${
            workout.difficulty === "BLACK"
              ? "border-white bg-black text-white"
              : ""
          }`}
                >
                  {workout.difficulty}
                </div>
              )}

              <div className={`badge badge-primary text-xs font-medium `}>
                {enumToString(workout.elementType)}
              </div>

              {workout.isDoableAtHome && (
                <div
                  className={`badge badge-secondary badge-outline text-xs font-medium`}
                >
                  Doable at home
                </div>
              )}
            </div>

            <div className="divider my-2 opacity-50"></div>

            {/* Title */}
            <div className="card-title text-xl md:text-2xl">
              <Link href={`/workout/${workout.id}`}>
                <div className="flex items-center gap-2 transition-colors hover:text-primary-content">
                  {workout.name ? workout.name : `#${workout.id}`}
                  <MdOpenInNew size={17} />
                </div>
              </Link>
            </div>

            {/* Timecap and workout type */}
            <div className="flex items-center gap-1">
              {workout.totalTime && (
                <>
                  <MdTimer /> {workout.totalTime}mn
                  {workout.workoutType && (
                    <>
                      {" — "}
                      <span className="capitalize">
                        {enumToString(workout.workoutType.toLowerCase())}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <div className="description mt-2 whitespace-pre-wrap break-words text-[0.7rem] leading-relaxed opacity-70">
              {workout.description}
            </div>

            {onEdit &&
              onDuplicate &&
              onDelete &&
              (workout.creator.id === sessionData?.user?.id ||
                workout.elementType === "UNCLASSIFIED") && (
                <>
                  <div className="divider opacity-50"></div>

                  {/* Card footer */}

                  <div className="card-actions justify-end ">
                    <div className="btn-group ">
                      <button
                        type="button"
                        onClick={onEdit}
                        className="btn-outline btn btn-sm gap-x-2 text-xs"
                      >
                        <MdEdit size={17} /> Edit
                      </button>

                      <button
                        type="button"
                        onClick={onDuplicate}
                        className="btn-outline btn btn-sm gap-x-2 text-xs"
                      >
                        <MdCopyAll size={17} /> Duplicate
                      </button>

                      <button
                        type="button"
                        onClick={onDelete}
                        className="btn-outline btn btn-error btn-sm text-xs"
                      >
                        <MdDelete size={17} />
                      </button>
                    </div>
                  </div>
                </>
              )}
          </div>
        </>
      )}
    </div>
  );
}

import { Prisma } from "@prisma/client";
import formatDistance from "date-fns/formatDistance";
import Image from "next/image";
import {
  MdOutlineMenu,
  MdOutlinePlaylistAddCheck,
  MdDone,
  MdDelete,
  MdMenu,
  MdTimer,
  MdCopyAll,
  MdEdit,
} from "react-icons/md";
import { WorkoutWithExtras } from "../../server/router/workout";
import { enumToString } from "../../utils/formatting";

interface WorkoutCardProps {
  workout: WorkoutWithExtras;
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function WorkoutCard({
  workout,
  onDuplicate,
  onEdit,
  onDelete,
}: WorkoutCardProps) {
  return (
    <div className="group card mb-8 bg-base-200 transition-all hover:shadow-lg duration-300">
      <div className="card-body ">
        <div className="flex justify-between items-center">
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
              <div className={`text-xs opacity-50 font-light`}>
                Created{" "}
                {formatDistance(new Date(), new Date(workout.createdAt))} ago
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
              className={`badge badge-outline rounded-none text-xs font-medium text-${workout.difficulty.toLowerCase()}-600
            ${
              workout.difficulty === "BLACK"
                ? "border-white bg-black text-white"
                : ""
            }`}
            >
              {workout.difficulty}
            </div>
          )}

          <div className={`badge rounded-none text-xs font-medium `}>
            {enumToString(workout.elementType)}
          </div>

          {workout.isDoableAtHome && (
            <div
              className={`badge badge-outline badge-secondary rounded-none text-xs font-medium`}
            >
              Doable at home
            </div>
          )}
        </div>

        <div className="divider opacity-50 my-2"></div>

        {/* Title */}
        <div className="card-title text-2xl">
          {workout.name ? workout.name : `#${workout.id}`}
        </div>

        {/* Timecap and workout type */}

        <div className="flex gap-1 items-center">
          {workout.totalTime && (
            <>
              <MdTimer /> {workout.totalTime}mn
            </>
          )}
        </div>

        {/* Description */}
        <div className="description whitespace-pre-wrap break-words text-[0.8rem] leading-relaxed font-medium opacity-70">
          {workout.description}
        </div>

        <div className="divider opacity-50"></div>

        {/* Card footer */}
        <div className="card-actions justify-end">
          <div className="btn-group ">
            <button
              onClick={onEdit}
              className="btn btn-sm btn-outline gap-x-2 text-xs"
            >
              <MdEdit size={17} /> Edit
            </button>

            <button
              onClick={onDuplicate}
              className="btn btn-sm btn-outline gap-x-2 text-xs"
            >
              <MdCopyAll size={17} /> Duplicate
            </button>

            <button
              onClick={onDelete}
              className="btn btn-sm btn-outline btn-error text-xs"
            >
              <MdDelete size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

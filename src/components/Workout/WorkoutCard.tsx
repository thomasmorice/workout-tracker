import { format } from "date-fns";
import Image from "next/image";
import {
  MdDone,
  MdDelete,
  MdTimer,
  MdCopyAll,
  MdEdit,
  MdOpenInNew,
} from "react-icons/md";
import { InferQueryOutput } from "../../types/trpc";
import { enumToString } from "../../utils/formatting";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface WorkoutCardProps {
  workout: InferQueryOutput<"workout.get-infinite-workouts">["workouts"][number];
  onDuplicate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function WorkoutCard({
  workout,
  onDuplicate,
  onEdit,
  onDelete,
}: WorkoutCardProps) {
  const { data: sessionData } = useSession();
  return (
    <div
      style={
        {
          // boxShadow: "-22px -22px 30px #232832, 22px 22px 30px #313846",
          // background: "linear-gradient(315deg, #2d3340, #262b36)",
        }
      }
      className="group card mb-8 border border-base-content border-opacity-10 bg-gradient-to-br from-base-200 to-base-100 shadow-xl"
    >
      <div className="card-body ">
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
                {format(workout.createdAt, "do MMMM yyyy")}
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
              className={`badge-outline badge rounded-none text-xs font-medium text-${workout.difficulty.toLowerCase()}-600
            ${
              workout.difficulty === "BLACK"
                ? "border-white bg-black text-white"
                : ""
            }`}
            >
              {workout.difficulty}
            </div>
          )}

          <div
            className={`badge-primary badge rounded-none text-xs font-medium `}
          >
            {enumToString(workout.elementType)}
          </div>

          {workout.isDoableAtHome && (
            <div
              className={`badge-secondary badge-outline badge rounded-none text-xs font-medium`}
            >
              Doable at home
            </div>
          )}
        </div>

        <div className="divider my-2 opacity-50"></div>

        {/* Title */}
        <div className="card-title text-2xl">
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
        <div className="description whitespace-pre-wrap break-words text-[0.77rem] font-medium leading-relaxed opacity-70">
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
    </div>
  );
}

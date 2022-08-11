import { Prisma } from "@prisma/client";
import formatDistance from "date-fns/formatDistance";
import { MdOutlineMenu, MdOutlinePlaylistAddCheck } from "react-icons/md";
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
    <div className="group card mb-8 bg-base-200 shadow-sm transition-shadow hover:shadow-lg">
      <div className="card-body ">
        <div className="flex justify-between">
          {/* Author */}
          <div className="flex items-center gap-5">
            <div className="mask mask-circle h-12 w-12 ">
              <img src={workout.creator.image as string} alt="" />
            </div>
            <div className="text-xl font-extralight">
              {workout?.creator.name}
            </div>
          </div>
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn btn-square btn-sm">
              <MdOutlineMenu size="24" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box  bg-base-100 p-2 text-sm shadow"
            >
              <li>
                <a onClick={onEdit}>Edit</a>
              </li>
              <li>
                <a onClick={onDuplicate}>Duplicate</a>
              </li>
              <li>
                <a
                  onClick={onDelete}
                  className="hover:bg-error hover:text-white"
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Title */}
        <div className="card-title py-3 text-2xl">
          {workout.name ? workout.name : `#${workout.id}`}
        </div>

        {/* Description */}
        <div className="description whitespace-pre-wrap break-words text-sm font-light">
          {workout.description}
        </div>

        {/* Badges */}
        <div className="badges flex flex-wrap gap-2 pt-4 uppercase">
          {workout.difficulty && (
            <div
              className={`badge badge-outline rounded-none text-xs font-medium border-${workout.difficulty.toLowerCase()}-600 text-${workout.difficulty.toLowerCase()}-600
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
            className={`badge badge-primary rounded-none text-xs font-medium `}
          >
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

        <div className="divider opacity-50"></div>

        <div className="flex items-center justify-between">
          <div
            className={`badge badge-ghost rounded-none text-xs font-medium `}
          >
            Added {formatDistance(new Date(), new Date(workout.createdAt))} ago
          </div>

          {workout._count.workoutResults > 0 && (
            <div className="tooltip" data-tip={`View results `}>
              <div className="flex">
                <div className="btn btn-ghost btn-sm">
                  <MdOutlinePlaylistAddCheck size={27} />
                  <sup className="text-xs">{workout._count.workoutResults}</sup>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

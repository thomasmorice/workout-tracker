import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/WorkoutRouter/workout-router";
import Image from "next/image";
import { format } from "date-fns";
import { RxDotsVertical } from "react-icons/rx";
import { MdDone, MdOutlineArrowBackIos } from "react-icons/md";
import { useMemo } from "react";
import Dropdown from "../../Dropdown/Dropdown";
import { useRouter } from "next/router";

type WorkoutCardUserAndActionsProps = {
  isFullScreen: boolean;
  isSelected?: boolean;
  onOpenFullScreen?: () => void;
  onDuplicate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleSelect?: () => void;
  onGoBack: () => void;
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
};

export default function WorkoutCardUserAndActions({
  onOpenFullScreen,
  onDuplicate,
  isSelected,
  onEdit,
  onDelete,
  onToggleSelect,
  onGoBack,
  isFullScreen,
  workout,
}: WorkoutCardUserAndActionsProps) {
  const workoutActions = useMemo(() => {
    const actions = [];
    onOpenFullScreen &&
      actions.push({
        label: "Open card details",
        onClick: onOpenFullScreen,
      });
    onToggleSelect &&
      actions.push({
        label: "Select workout",
        onClick: onToggleSelect,
      });

    onDuplicate &&
      actions.push({
        label: "Duplicate",
        onClick: onDuplicate,
      });

    // onGoBack &&
    // actions.push({
    //   label: "Duplicate",
    //   onClick: onDuplicate,
    // });

    onEdit &&
      actions.push({
        label: "Edit",
        onClick: onEdit,
      });

    onDelete &&
      actions.push({
        label: "Delete",
        onClick: onDelete,
      });

    return actions;
  }, [onToggleSelect, onDuplicate, onEdit, onDelete, onOpenFullScreen]);

  return (
    <div className="w-full">
      <div
        onClick={onGoBack}
        className={`btn btn-ghost btn-circle z-10
              ${isFullScreen ? "absolute " : "hidden "}`}
      >
        <MdOutlineArrowBackIos className="" size={22} />
      </div>
      {/* AUTHOR */}
      <div
        className={`flex items-center gap-3
            ${isFullScreen ? "flex-col justify-center" : ""}
          `}
      >
        <div className={`avatar`}>
          <div
            className={`relative rounded-full border-2 border-base-content border-opacity-50 bg-transparent ${
              isFullScreen ? "mt-12 h-12 w-12" : "h-8 w-8"
            }`}
          >
            <Image
              fill
              className="rounded-full object-cover p-0.5"
              referrerPolicy="no-referrer"
              src={workout.creator.image ?? "https://i.pravatar.cc/300"}
              alt="Workout creator"
            />
          </div>
        </div>

        {/* Creator name and date */}
        <div
          className={`flex w-full flex-col self-center
              ${isFullScreen ? "text-center" : "text-left"}
            }`}
        >
          <div className="text-xs font-bold uppercase leading-[15px] tracking-[0.05em]">
            {workout.creator.name}
          </div>
          <div className="text-[11px] tracking-tight text-base-content text-opacity-50">
            {format(workout.createdAt, "dd/MM/yyyy")}
          </div>
        </div>

        <div
          className={`
            ${
              isFullScreen
                ? "absolute top-1 right-2"
                : `btn-sm absolute -right-6 -top-2`
            }
            
          `}
        >
          {isSelected ? (
            <button
              className="btn btn-primary btn-sm btn-circle mr-3 mt-2"
              onClick={onToggleSelect}
            >
              <MdDone size={17} />
            </button>
          ) : (
            <Dropdown
              withBackdrop
              buttons={workoutActions}
              containerClass="dropdown-left"
            >
              <div
                className={`btn btn-ghost btn-circle
                  ${isSelected ? "btn-primary" : ""}
                `}
              >
                <RxDotsVertical size={isFullScreen ? 28 : 23} />
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}

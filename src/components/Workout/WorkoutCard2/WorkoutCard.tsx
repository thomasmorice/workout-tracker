import { format } from "date-fns";
import Image from "next/image";
import { MdDone } from "react-icons/md";
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { inferRouterOutputs } from "@trpc/server";
import { enumToString } from "../../../utils/formatting";
import Dropdown from "../../Dropdown/Dropdown";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFloatingActionButtonStore } from "../../../store/FloatingActionButtonStore";
import { useLongPress } from "use-long-press";
import WorkoutCardBadges from "./WorkoutCardBadges";

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

  const [showFullDescription, set_showFullDescription] = useState(true);
  const [isTruncated, set_isTruncated] = useState(false);

  const onLongPress = useLongPress(() => {
    onSelect && onSelect();
  });

  const workoutDescriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (workoutDescriptionRef && workoutDescriptionRef.current) {
      if (
        workoutDescriptionRef.current.offsetHeight <
          workoutDescriptionRef.current.scrollHeight ||
        workoutDescriptionRef.current.offsetWidth <
          workoutDescriptionRef.current.scrollWidth
      ) {
        set_isTruncated(true);
      }
    }
  }, []);

  // const isWorkoutDescriptionTruncated = () => {
  //   if (workoutDescriptionRef && workoutDescriptionRef.current) {
  //     if (
  //       workoutDescriptionRef.current.offsetHeight <
  //         workoutDescriptionRef.current.scrollHeight ||
  //       workoutDescriptionRef.current.offsetWidth <
  //         workoutDescriptionRef.current.scrollWidth
  //     ) {
  //       return true;
  //     }
  //     return false;
  //   }
  // };

  const workoutName = useMemo(() => {
    if (workout.name) {
      return workout.name;
    } else {
      if (workout.totalTime && workout.workoutType) {
        return `${workout.totalTime}mn ${enumToString(
          workout.workoutType ?? ""
        )}`;
      } else {
        return workout.elementType;
      }
    }
  }, [workout]);

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
            ? "scale-[0.98] border-4 border-primary border-opacity-70"
            : "border border-base-content border-opacity-[0.2]"
        }
        relative flex flex-col rounded-xl  bg-base-200 bg-opacity-50  px-6 pt-8 pb-5 pr-10 transition-all`}
    >
      <div
        style={{ writingMode: "vertical-rl" }}
        className="absolute right-0 top-0 flex h-full w-7 rotate-180 items-center justify-center rounded-l-xl bg-base-300 text-sm font-bold uppercase leading-[10px] tracking-[0.1rem] text-base-content text-opacity-60"
      >
        {workoutName}
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
            <div className="text-base font-medium leading-none tracking-tight">
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
              btn-outline btn btn-sm btn-circle border-base-content  text-base-content  hover:border-opacity-100 hover:bg-base-300 hover:text-base-content hover:text-opacity-80
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
              className={`btn-outline btn btn-sm btn-circle border-base-content text-base-content opacity-50  hover:bg-base-300 hover:text-base-content hover:text-opacity-80`}
            >
              <HiOutlineEllipsisHorizontal size={17} />
            </div>
          </Dropdown>
        )}
      </div>

      <div className="mt-4 whitespace-pre-wrap">
        {workoutName && <div className="pb-1 font-semibold">{workoutName}</div>}
        <div className={`mt-1`}>
          <p
            className={`  text-[0.73em] leading-5 tracking-wider text-base-content transition-all
            ${isSelected(workout) ? "text-opacity-100" : "text-opacity-80"}
            ${
              showFullDescription
                ? "max-h-[5000px] line-clamp-none"
                : "max-h-40 line-clamp-6"
            }
          `}
            ref={workoutDescriptionRef}
          >
            {workout.description}
          </p>
          {isTruncated && (
            <div className="pt-1 text-sm">
              <button
                type={"button"}
                className="font-medium underline"
                onClick={() => set_showFullDescription(!showFullDescription)}
              >
                Read {`${showFullDescription ? "less" : "more"}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}

      <div className="mt-5 flex items-center gap-1">
        <WorkoutCardBadges workout={workout} />
      </div>
    </div>
  );
}

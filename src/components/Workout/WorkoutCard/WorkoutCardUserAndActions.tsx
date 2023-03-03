import { inferRouterOutputs } from "@trpc/server";
import { motion } from "framer-motion";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
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
  onGoback: () => void;
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];
};

export default function WorkoutCardUserAndActions({
  onOpenFullScreen,
  onDuplicate,
  isSelected,
  onEdit,
  onDelete,
  onToggleSelect,
  onGoback,
  isFullScreen,
  workout,
}: WorkoutCardUserAndActionsProps) {
  const router = useRouter();
  const workoutActions = useMemo(() => {
    const actions = [];
    // if (onMoveResultUp) {
    //   actions.push({
    //     label: "Move result up",
    //     onClick: onMoveResultUp,
    //   });
    // }
    // if (onMoveResultDown) {
    //   actions.push({
    //     label: "Move result down",
    //     onClick: onMoveResultDown,
    //   });
    // }
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
    <motion.div className="w-full">
      <motion.div
        layout="position"
        onClick={onGoback}
        className={`btn btn-ghost btn-circle z-10
              ${isFullScreen ? "fixed " : "hidden "}`}
        // transition={{
        //   duration: isFullScreen ? 0.5 : 0.2,
        // }}
        animate={{
          opacity: isFullScreen ? 1 : 0,
          x: isFullScreen ? 0 : -10,
        }}
      >
        <MdOutlineArrowBackIos className="" size={22} />
      </motion.div>
      {/* AUTHOR */}
      <motion.div
        className={`flex items-center gap-3
            ${isFullScreen ? "flex-col justify-center" : ""}
          `}
      >
        <motion.div layout className={`avatar`}>
          <motion.div
            className={`relative rounded-full border-2 border-base-content border-opacity-50 bg-transparent ${
              isFullScreen ? "h-12 w-12" : "h-8 w-8"
            }`}
          >
            <Image
              fill
              className="rounded-full object-cover p-0.5"
              referrerPolicy="no-referrer"
              src={workout.creator.image ?? "https://i.pravatar.cc/300"}
              alt="Workout creator"
            />
          </motion.div>
        </motion.div>

        {/* Creator name and date */}
        <motion.div
          className={`flex w-full flex-col self-center
              ${isFullScreen ? "text-center" : "text-left"}
            }`}
        >
          <motion.div className="text-xs font-bold uppercase leading-[15px] tracking-[0.05em]">
            {workout.creator.name}
          </motion.div>
          <motion.div className="text-[11px] tracking-tight text-base-content text-opacity-50">
            {format(workout.createdAt, "dd/MM/yyyy")}
          </motion.div>
        </motion.div>

        <motion.div
          layout={"position"}
          className={`
            ${
              isFullScreen
                ? "fixed top-5 right-5"
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
              withBackdrop={isFullScreen}
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

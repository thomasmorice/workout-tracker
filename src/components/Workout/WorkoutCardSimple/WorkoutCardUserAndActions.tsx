import { inferRouterOutputs } from "@trpc/server";
import { motion } from "framer-motion";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import Image from "next/image";
import { format } from "date-fns";
import { RxDotsVertical } from "react-icons/rx";
import { MdDone, MdOutlineArrowBackIos } from "react-icons/md";
import { useMemo } from "react";
import Dropdown from "../../Dropdown/Dropdown";

type WorkoutCardUserAndActionsProps = {
  mode: "minified" | "expanded" | "full-screen";
  isSelected?: boolean;
  onDuplicate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleSelect?: () => void;
  onGoback: () => void;
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];
};

export default function WorkoutCardUserAndActions({
  onDuplicate,
  isSelected,
  onEdit,
  onDelete,
  onToggleSelect,
  onGoback,
  mode,
  workout,
}: WorkoutCardUserAndActionsProps) {
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
    if (onToggleSelect) {
      actions.push({
        label: "Select workout",
        onClick: onToggleSelect,
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
  }, [onToggleSelect, onDuplicate, onEdit, onDelete]);

  return (
    <motion.div className="w-full">
      <motion.div
        layout="position"
        onClick={onGoback}
        className={`btn btn-circle 
              ${mode === "full-screen" ? "fixed " : "hidden "}`}
        transition={{
          duration: mode === "full-screen" ? 0.5 : 0.2,
        }}
        animate={{
          opacity: mode === "full-screen" ? 1 : 0,
          x: mode === "full-screen" ? 0 : -10,
        }}
      >
        <MdOutlineArrowBackIos className="" size={22} />
      </motion.div>
      {/* AUTHOR */}
      <motion.div
        className={`flex items-center gap-3
            ${mode === "full-screen" ? "flex-col justify-center" : ""}
          `}
      >
        <motion.div layout className={`avatar`}>
          <motion.div
            className={`relative rounded-full border-2 border-base-content border-opacity-50 bg-transparent ${
              mode === "full-screen" ? "w-12" : "w-8"
            }`}
          >
            <Image
              fill
              className="rounded-full object-contain p-0.5 "
              referrerPolicy="no-referrer"
              src={workout.creator.image ?? "https://i.pravatar.cc/300"}
              alt="Workout creator"
            />
          </motion.div>
        </motion.div>

        {/* Creator name and date */}
        <motion.div
          layout="position"
          className={`flex w-full flex-col self-center
              ${mode !== "full-screen" ? "text-left" : "text-center"}
            }`}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: mode === "minified" ? 0 : 1,
            x: mode === "minified" ? -7 : 0,
            lineHeight: mode === "minified" ? "6px" : "14px",
          }}
          transition={{
            delay: mode !== "expanded" ? 0.07 : 0.12,
          }}
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
          className={`btn  btn-circle z-30
            ${isSelected ? "btn-primary" : ""}
            ${
              mode === "full-screen"
                ? "fixed top-5 right-7"
                : `btn-sm absolute right-0`
            }
            
          `}
        >
          {isSelected ? (
            <MdDone onClick={onToggleSelect} size={17} />
          ) : (
            <Dropdown buttons={workoutActions} containerClass="dropdown-left ">
              <RxDotsVertical size={mode === "full-screen" ? 28 : 23} />
            </Dropdown>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

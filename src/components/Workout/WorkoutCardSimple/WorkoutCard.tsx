import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import Image from "next/image";
import { enumToString } from "../../../utils/formatting";
import { GiBiceps } from "react-icons/gi";
import { BsLightningChargeFill } from "react-icons/bs";
import { format } from "date-fns";
import { RxDotsVertical } from "react-icons/rx";
import { BiExpandAlt } from "react-icons/bi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
// import WorkoutCardHeader from "./WorkoutCardHeader";
import WorkoutCardHeader from "./WorkoutCardHeaderSimplified";
import WorkoutCardTitle from "./WorkoutCardTitle";

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
  const [isExpanded, set_isExpanded] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed top-0 left-0 z-50 h-full w-full bg-base-300 bg-opacity-60"
          ></motion.div>
        )}
      </AnimatePresence>
      <motion.div
        layout
        transition={{
          ease: "backInOut",
          duration: 0.7,
          borderRadius: {
            duration: 0.5,
          },
          zIndex: {
            delay: isExpanded ? 0 : 0.4,
          },
        }}
        className="min-h-[180px] rounded-3xl bg-base-300 p-5"
        animate={{
          borderRadius: isExpanded ? "0px" : "25px",
          zIndex: isExpanded ? "50" : "10",
        }}
        style={
          !isExpanded
            ? {
                position: "relative",
                padding: "28px",
              }
            : {
                top: 0,
                left: 0,
                width: "100%",
                position: "fixed",
                padding: "28px",
              }
        }
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              transition={{
                delay: isExpanded ? 0.2 : 1,
              }}
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -20,
              }}
            >
              <MdArrowBack className="absolute" size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="btn-ghost btn btn-sm btn-circle absolute right-4 z-30">
          <RxDotsVertical size={23} />
        </div>
        <WorkoutCardHeader workout={workout} isExpanded={isExpanded} />
        <WorkoutCardTitle workout={workout} isExpanded={isExpanded} />
        <div className="relative z-30 mt-3.5 flex justify-center">
          <button
            onClick={() => set_isExpanded(!isExpanded)}
            type="button"
            className="btn-ghost btn btn-sm btn-circle"
          >
            <BiExpandAlt size={20} />
          </button>
        </div>
      </motion.div>
    </>
  );
}

import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import Image from "next/image";
import { enumToString } from "../../../utils/formatting";
import { GiBiceps } from "react-icons/gi";
import {
  BsArrowsCollapse,
  BsChevronContract,
  BsChevronExpand,
  BsLightningChargeFill,
} from "react-icons/bs";
import { format } from "date-fns";
import { RxDotsVertical } from "react-icons/rx";
import { BiExpandAlt } from "react-icons/bi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
// import WorkoutCardHeader from "./WorkoutCardHeader";
import WorkoutCardHeader from "./WorkoutCardHeader";
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
  const [expanded, set_expanded] = useState<
    "minified" | "expanded" | "full-screen"
  >("minified");

  return (
    <>
      <AnimatePresence>
        {expanded === "full-screen" && (
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
            className="fixed top-0 left-0 z-50 h-full w-full bg-base-300 bg-opacity-60 backdrop-blur-sm"
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
            delay: expanded !== "minified" ? 0 : 0.4,
          },
        }}
        className={`bg-base-300 p-5 pb-4
          ${
            expanded === "full-screen"
              ? "border-b border-b-base-content border-opacity-10"
              : ""
          }
        `}
        animate={{
          borderRadius: expanded === "full-screen" ? "0px" : "25px",
          zIndex: expanded === "full-screen" ? "50" : "10",
        }}
        style={
          expanded === "full-screen"
            ? {
                top: 0,
                left: 0,
                width: "100%",
                position: "fixed",
              }
            : {
                position: "relative",
                borderRadius: "24px",
              }
        }
      >
        <AnimatePresence>
          {expanded === "full-screen" && (
            <motion.div
              transition={{
                delay: 0.2,
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
        <WorkoutCardHeader workout={workout} expanded={expanded} />
        <WorkoutCardTitle
          workout={workout}
          isExpanded={expanded !== "minified"}
        />

        <AnimatePresence>
          {expanded !== "minified" && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className={`mt-5 whitespace-pre-wrap text-center text-[11px] leading-[15px] text-base-content text-opacity-70`}
            >
              {workout.description}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-30 mt-3.5 flex items-center justify-center gap-3 ">
          <button
            onClick={() =>
              set_expanded(expanded === "minified" ? "expanded" : "full-screen")
            }
            type="button"
            className="btn-ghost btn btn-sm btn-circle"
          >
            <BsChevronExpand size={18} />
          </button>

          <button
            onClick={() =>
              set_expanded(expanded === "full-screen" ? "expanded" : "minified")
            }
            type="button"
            className="btn-ghost btn btn-sm btn-circle"
          >
            <BsChevronContract size={18} />
          </button>
        </div>
      </motion.div>
    </>
  );
}

import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { RxDotsVertical } from "react-icons/rx";
import { BiExpand } from "react-icons/bi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineArrowBackIos } from "react-icons/md";
import WorkoutCardUserAndActions from "./WorkoutCardUserAndActions";
import WorkoutCardTitle from "./WorkoutCardTitle";
import WorkoutCardIllustration from "./WorkoutCardIllustration";
import WorkoutCardBadges from "./WorkoutCardBadges";
import { useLockedBody } from "usehooks-ts";

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
  onDuplicate,
  onEdit,
  onDelete,
  onSelect,
  onMoveResultUp,
  onMoveResultDown,
  footer,
}: WorkoutCardProps) {
  const [mode, set_mode] = useState<"minified" | "expanded" | "full-screen">(
    "minified"
  );

  useLockedBody(mode === "full-screen");

  return (
    <>
      <AnimatePresence>
        {mode === "full-screen" && (
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
            className="fixed top-0 left-0 z-20 h-full w-full bg-base-300 bg-opacity-60 backdrop-blur-sm"
          ></motion.div>
        )}
      </AnimatePresence>
      <motion.div
        layout
        className={`overflow-hidden bg-base-300 p-5 pb-4
          ${
            mode === "full-screen"
              ? "fixed top-0 left-0 z-50 min-h-screen w-full  overflow-scroll rounded-none"
              : "relative z-10 rounded-3xl"
          }
        `}
      >
        <WorkoutCardIllustration mode={mode} />
        <motion.div className="relative z-20">
          <motion.div
            layout="position"
            onClick={() => set_mode("minified")}
            className="btn-ghost btn btn-circle absolute z-30"
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

          <WorkoutCardUserAndActions workout={workout} mode={mode} />
          <WorkoutCardTitle workout={workout} mode={mode} />
          <motion.div
            onClick={() => mode === "minified" && set_mode("expanded")}
            className={`
            text-center text-xs font-light
            ${mode !== "full-screen" ? " mt-2" : "mt-9 mb-6"}
          `}
          >
            FEAT. WALLBALLS - ROWING - BURPEES
          </motion.div>

          <motion.div
            onClick={() => mode === "expanded" && set_mode("minified")}
            className={`
                mt-5 whitespace-pre-wrap text-center  text-base-content 
                ${mode === "minified" ? "hidden" : "visible"}
                ${
                  mode === "full-screen"
                    ? "mb-8 text-[14px] leading-[24px] text-opacity-100"
                    : "text-[11.5px] leading-[18px] text-opacity-70"
                }
              `}
          >
            {workout.description}
          </motion.div>

          <WorkoutCardBadges workout={workout} />

          <div className="mt-3.5 flex items-center justify-center gap-3 ">
            <button
              onClick={() => set_mode("full-screen")}
              type="button"
              className="btn-ghost btn btn-circle"
              disabled={mode === "full-screen"}
            >
              <BiExpand size={26} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

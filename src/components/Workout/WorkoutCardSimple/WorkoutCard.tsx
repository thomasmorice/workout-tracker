import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { RxDotsVertical } from "react-icons/rx";
import { BiExpand } from "react-icons/bi";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineArrowBackIos } from "react-icons/md";
import WorkoutCardUserAndActions from "./WorkoutCardUserAndActions";
import WorkoutCardTitle from "./WorkoutCardTitle";
import WorkoutCardIllustration from "./WorkoutCardIllustration";
import WorkoutCardBadges from "./WorkoutCardBadges";
import { useLockedBody } from "usehooks-ts";
import { getWorkoutItemsAndRandomIllustrationByDescription } from "../../../utils/workout";

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
  const [workoutItems, set_workoutItems] = useState<string[]>();
  const [illustration, set_illustration] = useState<string>();

  useEffect(() => {
    const itemsAndIllustration =
      getWorkoutItemsAndRandomIllustrationByDescription(workout.description);
    set_workoutItems(itemsAndIllustration.items);
    set_illustration(itemsAndIllustration.illustration);
  }, []);

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
        className={` bg-base-300 p-5 pb-4
          ${
            mode === "full-screen"
              ? "fixed top-0 bottom-0 left-0 z-50 w-full overflow-scroll rounded-none"
              : "relative z-10 overflow-hidden rounded-3xl"
          }
        `}
      >
        <WorkoutCardIllustration illustration={illustration} mode={mode} />
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

          {workoutItems && workoutItems.length > 0 && (
            <motion.div
              onClick={() => mode === "minified" && set_mode("expanded")}
              className={`
            text-center text-xs font-light uppercase
            ${mode !== "full-screen" ? " mt-2" : "mt-9 mb-14 text-sm"}
          `}
            >
              FEAT. {workoutItems?.join(" - ")}
            </motion.div>
          )}

          <motion.div
            onClick={() => mode === "expanded" && set_mode("minified")}
            className={`relative mt-5 whitespace-pre-wrap text-center  text-base-content 
                ${mode === "minified" ? "hidden" : "visible"}
                ${
                  mode === "full-screen"
                    ? "mb-24 text-sm font-light leading-[22px] tracking-tight text-opacity-80"
                    : "text-[11.5px] leading-[18px] text-opacity-70"
                }
              `}
          >
            <motion.div
              className={`absolute -left-1 -top-6 text-[76px] opacity-20 ${
                mode === "full-screen" ? "visible" : "hidden"
              }`}
            >
              “
            </motion.div>
            {workout.description}
            <motion.div
              className={`absolute -right-1 -bottom-12 text-[76px] opacity-20 ${
                mode === "full-screen" ? "visible" : "hidden"
              }`}
            >
              ”
            </motion.div>
          </motion.div>

          <WorkoutCardBadges workout={workout} />

          {mode !== "full-screen" && (
            <div className="mt-3.5 flex items-center justify-center gap-3 ">
              <button
                onClick={() => set_mode("full-screen")}
                type="button"
                className="btn-ghost btn btn-circle"
              >
                <BiExpand size={26} />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

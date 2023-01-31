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
import {
  MdArrowBack,
  MdCloseFullscreen,
  MdExpandLess,
  MdExpandMore,
  MdFullscreen,
  MdOutlineArrowBackIos,
} from "react-icons/md";
// import WorkoutCardHeader from "./WorkoutCardHeader";
import WorkoutCardUserAndActions from "./WorkoutCardUserAndActions";
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
            className="fixed top-0 left-0 z-50 h-full w-full bg-base-300 bg-opacity-60 backdrop-blur-sm"
          ></motion.div>
        )}
      </AnimatePresence>
      <motion.div
        layout
        className={`overflow-hidden bg-base-300 p-5 pb-4
          ${
            mode === "full-screen"
              ? "fixed top-0 left-0 z-50 w-full rounded-none border-b border-b-base-content border-opacity-10"
              : "relative z-30 rounded-3xl"
          }
        `}
      >
        <motion.div
          style={{
            background:
              "radial-gradient(126.53% 118.31% at 50.16% 0%, #000000 0%, rgba(22, 25, 31, 0.27) 0%, #20252E 100%)",
          }}
          layout
          className="absolute top-0 left-0 z-10 h-full w-full"
        ></motion.div>

        <Image
          fill
          className="absolute top-0 z-0 h-full w-full object-cover opacity-50"
          alt="Wallballs"
          src="/workout-item/wallballs.png"
        />

        <motion.div
          layout="position"
          onClick={() => set_mode("expanded")}
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
        <motion.div
          layout="position"
          className="btn-ghost btn btn-sm btn-circle absolute right-4 z-30"
        >
          <RxDotsVertical size={23} />
        </motion.div>
        <WorkoutCardUserAndActions workout={workout} mode={mode} />
        <WorkoutCardTitle workout={workout} isExpanded={mode !== "minified"} />

        <motion.div
          className={` relative z-30
                mt-5 whitespace-pre-wrap text-center  text-base-content 
                ${mode === "minified" ? "hidden" : "visible"}
                ${
                  mode === "full-screen"
                    ? "text-[14px] leading-[24px] text-opacity-100"
                    : "text-[11.5px] leading-[18px] text-opacity-70"
                }
              `}
        >
          {workout.description}
        </motion.div>

        <div className="relative z-30 mt-3.5 flex items-center justify-center gap-3 ">
          <button
            onClick={() =>
              set_mode(mode === "full-screen" ? "expanded" : "minified")
            }
            type="button"
            className="btn-ghost btn btn-circle"
            disabled={mode === "minified"}
          >
            <MdExpandLess size={22} />
          </button>

          <button
            onClick={() => set_mode("full-screen")}
            type="button"
            className="btn-ghost btn btn-circle"
            disabled={mode === "full-screen"}
          >
            <MdFullscreen size={26} />
          </button>

          <button
            onClick={() =>
              set_mode(mode === "minified" ? "expanded" : "full-screen")
            }
            type="button"
            className="btn-ghost btn btn-circle"
            disabled={mode === "full-screen"}
          >
            <MdExpandMore size={22} />
          </button>
        </div>
      </motion.div>
    </>
  );
}

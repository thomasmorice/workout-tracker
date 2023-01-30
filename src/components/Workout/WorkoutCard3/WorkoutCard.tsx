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
    <motion.div layout>
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
            className="fixed top-0 left-0 z-50 h-full w-full bg-base-300 bg-opacity-80"
          ></motion.div>
        )}
      </AnimatePresence>
      <motion.div
        layout
        className={` flex  overflow-hidden bg-base-300 p-5
        ${
          isExpanded
            ? "fixed top-0 left-0 z-50  w-full"
            : "relative z-40 rounded-3xl"
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
        <motion.img
          layout
          className="absolute top-0 z-0 object-cover opacity-50"
          alt="Wallballs"
          src="/workout-item/wallballs.png"
        />
        <motion.div
          layout
          transition={{
            layout: {
              duration: 1.5,
            },
          }}
          className="relative z-10 -mt-5 w-full"
        >
          {/* HEADER */}
          <motion.div
            layout
            className="flex w-full items-center justify-between"
          >
            {/* AUTHOR */}
            <motion.div className="flex gap-2">
              <motion.div className="avatar self-center">
                <motion.div className="w-8 rounded-full border-2 border-base-content border-opacity-50 bg-transparent">
                  <Image
                    fill
                    className="rounded-full p-1"
                    referrerPolicy="no-referrer"
                    src={workout.creator.image ?? "https://i.pravatar.cc/300"}
                    alt="Workout creator"
                  />
                </motion.div>
              </motion.div>

              {/* Creator name and date */}
              <motion.div className="hidden flex-col">
                <motion.div className="text-xs font-bold uppercase leading-[14px] tracking-[0.05em]">
                  {workout.creator.name}
                </motion.div>
                <motion.div className="text-[11px] tracking-tight text-base-content text-opacity-50">
                  {format(workout.createdAt, "dd/MM/yyyy")}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Workout title */}
            <motion.div className="mt-5 flex flex-col items-center font-bold">
              <motion.div className=" flex items-center gap-1.5 text-center text-xs font-semibold tracking-[0.03rem]">
                {workout.elementType.includes("STRENGTH") && (
                  <GiBiceps size={14} />
                )}
                {workout.elementType.includes("WOD") && (
                  <BsLightningChargeFill size={14} />
                )}
                {enumToString(workout.elementType)}
              </motion.div>
              <motion.div className="flex items-center text-base tracking-[0.15rem]">
                16MN AMRAP
              </motion.div>
            </motion.div>

            <motion.div>
              <RxDotsVertical size={26} />
            </motion.div>
          </motion.div>

          <motion.div className="mt-2.5 text-center text-[11px] font-light leading-[11px]">
            FEAT. WALLBALLS - ROWING - BURPEES
          </motion.div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div className="mt-5 whitespace-pre-wrap text-center text-[11px] leading-[15px] text-base-content text-opacity-70">
                {workout.description}
              </motion.div>
            )}
          </AnimatePresence>

          {/* BADGES */}
          <motion.div className="mt-4 flex justify-center gap-2">
            <motion.div className="badge-outline badge ">black</motion.div>
            <motion.div className="badge-outline badge">{`${workout.totalTime}mn`}</motion.div>
            <motion.div className="badge-outline badge ">{`${workout._count.workoutResults} results`}</motion.div>
          </motion.div>

          {/* ACTIONS */}
          <motion.div className="mt-3.5 flex justify-center">
            <motion.button
              onClick={() => set_isExpanded(!isExpanded)}
              type="button"
              className="btn-ghost btn btn-sm btn-circle"
            >
              <BiExpandAlt size={20} />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

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
          duration: 0.8,
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
        <div
          style={{
            background:
              "radial-gradient(126.53% 118.31% at 50.16% 0%, #000000 0%, rgba(22, 25, 31, 0.27) 0%, #20252E 100%)",
          }}
          className="absolute top-0 left-0 z-10 h-full w-full rounded-3xl "
        ></div>
        <Image
          fill
          className="absolute top-0 z-0 rounded-3xl object-cover opacity-50 "
          alt="Wallballs"
          src="/workout-item/wallballs.png"
        />

        {/* HEADER */}
        <motion.div layout className="relative z-10 w-full">
          <motion.div
            layout
            className="z-30 flex w-full justify-between text-center"
          >
            <AnimatePresence>
              {isExpanded && <MdArrowBack size={22} />}
            </AnimatePresence>
            {/* AUTHOR */}
            <motion.div
              layout
              style={
                isExpanded
                  ? {
                      alignItems: "center",
                    }
                  : {
                      alignItems: "flex-start",
                    }
              }
              className={`flex flex-col gap-2`}
            >
              <motion.div className="avatar ">
                <motion.div className="relative w-8 rounded-full border-2 border-base-content border-opacity-50 bg-transparent">
                  <Image
                    fill
                    className="rounded-full object-contain p-0.5"
                    referrerPolicy="no-referrer"
                    src={workout.creator.image ?? "https://i.pravatar.cc/300"}
                    alt="Workout creator"
                  />
                </motion.div>
              </motion.div>

              {/* Creator name and date */}
              <motion.div
                transition={{
                  delay: isExpanded ? 0.3 : 0,
                }}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  // visibility: isExpanded ? "visible" : "hidden",
                }}
                className="flex-col"
              >
                <motion.div className="text-xs font-bold uppercase leading-[14px] tracking-[0.05em]">
                  {workout.creator.name}
                </motion.div>
                <motion.div className="text-[11px] tracking-tight text-base-content text-opacity-50">
                  {format(workout.createdAt, "dd/MM/yyyy")}
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div>
              <RxDotsVertical size={26} />
            </motion.div>
          </motion.div>
          {/* Workout title */}
          <motion.div
            transition={{
              duration: 0.7,
            }}
            animate={{
              y: isExpanded ? 0 : -32,
            }}
            className={`flex flex-col items-center font-bold`}
          >
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
        </motion.div>
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

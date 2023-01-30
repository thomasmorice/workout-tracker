import { inferRouterOutputs } from "@trpc/server";
import { motion } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { enumToString } from "../../../utils/formatting";
import Image from "next/image";
import { format } from "date-fns";
import { RxDotsVertical } from "react-icons/rx";
import { GiBiceps } from "react-icons/gi";
import { BsLightningChargeFill } from "react-icons/bs";

type WorkoutCardHeaderProps = {
  isExpanded: boolean;
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
};

export default function WorkoutCardHeader({
  isExpanded,
  workout,
}: WorkoutCardHeaderProps) {
  return (
    <motion.div layout className="relative z-10 w-full">
      <motion.div className="">
        <MdArrowBack className="absolute w-0" size={22} />

        {/* AUTHOR */}
        <motion.div
          style={{
            alignItems: isExpanded ? "center" : "start",
          }}
          className={`flex flex-col `}
        >
          <motion.div layout className={`avatar `}>
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
              height: isExpanded ? "auto" : 0,
              // visibility: isExpanded ? "visible" : "hidden",
            }}
          >
            <motion.div className="text-xs font-bold uppercase leading-[14px] tracking-[0.05em]">
              {workout.creator.name}
            </motion.div>
            <motion.div className="text-[11px] tracking-tight text-base-content text-opacity-50">
              {format(workout.createdAt, "dd/MM/yyyy")}
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="btn-ghost btn btn-sm btn-circle absolute right-0 top-0">
          <RxDotsVertical size={23} />
        </div>
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
          {workout.elementType.includes("STRENGTH") && <GiBiceps size={14} />}
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
  );
}

import { inferRouterOutputs } from "@trpc/server";
import { AnimatePresence, motion } from "framer-motion";
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
    <motion.div
      transition={{
        delay: 0.3,
      }}
      layout
      className="relative z-10 w-full"
    >
      <motion.div className="">
        <MdArrowBack className="absolute w-0" size={22} />

        {/* AUTHOR */}
        <motion.div
          style={{
            alignItems: isExpanded ? "center" : "start",
          }}
          className={`flex flex-col text-center`}
        >
          <motion.div transition={{ delay: 0.25 }} layout className={`avatar `}>
            <motion.div className="relative w-8 rounded-full border-2 border-base-content border-opacity-50 bg-transparent">
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
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="mt-1 w-full text-center"
                transition={{
                  delay: 0.3,
                }}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <motion.div className="text-xs font-bold uppercase leading-[14px] tracking-[0.05em]">
                  {workout.creator.name}
                </motion.div>
                <motion.div className="text-[11px] tracking-tight text-base-content text-opacity-50">
                  {format(workout.createdAt, "dd/MM/yyyy")}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

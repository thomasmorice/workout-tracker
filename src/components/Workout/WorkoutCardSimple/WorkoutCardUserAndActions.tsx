import { inferRouterOutputs } from "@trpc/server";
import { AnimatePresence, motion } from "framer-motion";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import Image from "next/image";
import { format } from "date-fns";

type WorkoutCardUserAndActionsProps = {
  expanded: "minified" | "expanded" | "full-screen";
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
};

export default function WorkoutCardUserAndActions({
  expanded,
  workout,
}: WorkoutCardUserAndActionsProps) {
  return (
    <motion.div layout className="relative z-10 w-full">
      {/* AUTHOR */}
      <motion.div
        className={`flex items-center gap-3
            ${expanded === "full-screen" ? "flex-col justify-center" : ""}
          `}
      >
        <motion.div layout className={`avatar`}>
          <motion.div
            className={`relative  rounded-full border-2 border-base-content border-opacity-50 bg-transparent transition ${
              expanded === "full-screen" ? "w-10" : "w-8"
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
          className={`w-full
              ${expanded !== "full-screen" ? "text-left" : "text-center"}
            }`}
          transition={
            {
              // delay: 0.25,
              // duration: 0.25,
            }
          }
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: expanded === "minified" ? 0 : 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <motion.div className="text-xs font-bold uppercase leading-[15px] tracking-[0.05em]">
            {workout.creator.name}
          </motion.div>
          <motion.div className="text-[11px] tracking-tight text-base-content text-opacity-50">
            {format(workout.createdAt, "dd/MM/yyyy")}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
